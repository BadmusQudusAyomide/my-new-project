import {
    clearLocalStorage,
    createTimer,
    getLocalStorage,
    sendDebugMessage,
} from '../utils/AvayaChatUtils.js';
import AvayaTypingIndicator from './AvayaTypingIndicator/AvayaTypingIndicator.js';
import AvayaChatControl from './AvayaChatControl/AvayaChatControl';
import {
    removeSuggestionBubbles,
    updateShowFooter
} from '../utils/MutationUtils.js';
import ChatMetricsLogger from '../helpers/ChatMetricsLogger';

const CLOSE_EVENT_CODES = {
    NORMAL_CLOSURE: 1000, // The connection successfully completed the purpose for which it was created.
    GOING_AWAY: 1001, // The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.
    PROTOCOL_ERROR: 1002, // The endpoint is terminating the connection due to a protocol error.
    NO_STATUS_RCVD: 1005, // Reserved. Indicates that no status code was provided even though one was expected.
    ABNORMAL_CLOSURE: 1006, // Reserved. Indicates that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.
};

const CLOSE_EVENT_REASONS = {
    NORMAL_CLOSURE: 'REASON_CLOSING_CLEANUP',
    SESSION_RECONNECT: 'REASON_SESSION_RECONNECT',
};

class AvayaChatSocket {
    constructor(
        avayaChatConfig,
        avayaChatUserInterface,
        avayaChatStore,
        writeResponse,
        handleNotification,
        addToTimeouts,
        chatLogin,
        clearRefresh,
        writeChatSessionTransferred,
        botResponseTimeoutCallback,
        clearAllInactiveTimers
    ) {
        this.avayaChatConfig = avayaChatConfig;
        this.avayaChatUserInterface = avayaChatUserInterface;
        this.avayaChatStore = avayaChatStore;
        this.writeResponse = writeResponse;
        this.handleNotification = handleNotification;
        this.addToTimeouts = addToTimeouts;
        this.chatLogin = chatLogin;
        this.clearRefresh = clearRefresh;
        this.writeChatSessionTransferred = writeChatSessionTransferred;
        this.avayaTypingIndicator = new AvayaTypingIndicator();
        this.avayaChatControl = new AvayaChatControl();
        this.botResponseTimeoutCallback = botResponseTimeoutCallback;
        this.botResponseTimeoutTimer = createTimer(
            this.avayaChatConfig.websocketResponseTimeout,
            () => {
                this.botResponseTimeoutTimer.stop(
                    'AvayaChatSocket -- response time reached the limit; calling timeout callback'
                );
                this.botResponseTimeoutCallback();
            },
            this
        );
        this.clearAllInactiveTimers = clearAllInactiveTimers;

        // authentication token for customer's firewall
        this.authToken = '';
        this.pingInterval = null;
        this.chatMetricsLogger = new ChatMetricsLogger();
        this.websocketMessageSentTimestamp = null;
    }

    /**
     * Handle the WebSocket closing.
     *
     * @param event
     * @param webChatUrl
     */
    handleClose(event, webChatUrl) {
        sendDebugMessage('Stopping timer for the websocket response timeout (handleClose)');
        this.botResponseTimeoutTimer.stop('AvayaChatSocket::handleClose()');

        if (!event.wasClean) {
            // eslint-disable-next-line no-console
            console.warn(
                'WebChat: WebSocket closed abnormally. This may be caused by the user exiting before the chat starts or the agent closing the chat (in which case, ignore this), a certificate issue (e.g. your browser considers the certificate to be invalid), or an incorrect URL (e.g. not using a secure connection to a cluster that enforces secure connections). The URL is: ',
                webChatUrl
            );
        } else {
            // eslint-disable-next-line no-console
            console.info('WebChat: Closing the WebSocket.');
        }

        this.avayaChatControl.disableControls(true);
        this.avayaChatStore.initCalled = false;
        this.avayaChatStore.users = {};

        // if the customer hasn't closed it manually and chat wasn't initiated, let them know.
        // otherwise, ignore the timer
        if (!this.avayaChatStore.manualClose && this.avayaChatStore.chatWasInitiated) {
            this.avayaTypingIndicator.removeIsTypingIndicator(true);
        } else {
            this.avayaChatStore.initCalled = false;
        }

        // When we close the socket, we no longer want the customer to be able to
        // select a suggestion bubble or enter text input
        removeSuggestionBubbles();
        updateShowFooter(false);
        this.clearAllInactiveTimers();
    }

    /**
     * Handle WebSocket error.
     *
     * @param event
     */
    handleError(event) {
        sendDebugMessage('Running AvayaChatSocket:handleError');
        // eslint-disable-next-line no-console
        console.error('WebChat: WebSocket error', event);

        this.botResponseTimeoutTimer.stop('AvayaChatSocket::handleError()');

        if (this.avayaChatConfig ? .isTeslaAssist === true) {
            this.avayaChatUserInterface.displayFinalError();
            this.avayaChatUserInterface.avayaChatBubble.hideChatBubbleBadge();
        }

        this.writeResponse(
            this.avayaChatConfig.initializers.connectionErrorText,
            this.avayaChatConfig.writeResponseClassSystem
        );
    }

    /**
     * Handle WebSocket message.
     *
     * @param event
     */
    handleMessage(event) {
        sendDebugMessage('Running AvayaChatSocket:handleMessage');
        const message = JSON.parse(event.data);
        const {
            body
        } = message;

        // Handle the message according to the type and method.
        // Notifications are in their own method to reduce complexity.
        if (message.type === this.avayaChatConfig.messageTypeNotification) {
            if (body.method === this.avayaChatConfig.jsonMethodRequestNewMessage) {
                this.botResponseTimeoutTimer.stop('AvayaChatSocket::handleMessage()');
            }

            if (
                message.body.displayName === 'Oceana-Connector' &&
                this.avayaChatStore.customerDetails.isContinuingAfterRefresh === false
            ) {
                this.chatMetricsLoggerHandleWebsocketReceive();
            }

            this.handleNotification(message);
        } else if (message.type === this.avayaChatConfig.messageTypeError) {
            // parse the error message
            this.parseErrorMessage(body);
        } else if (message.type === this.avayaChatConfig.messageTypeAck) {
            // Nothing to do for acks
        } else {
            // Error will be handled at AvayaChatInit
            throw new TypeError(`Unknown message type:\n${message}`);
        }
    }

    /**
     * Handle WebSocket opening.
     */
    handleOpen() {
        sendDebugMessage('Running AvayaChatSocket:handleOpen');
        this.avayaChatStore.manualClose = false;

        // set up the ping mechanism here.
        this.pingInterval = setInterval(() => {
            this.sendPing();
        }, this.avayaChatConfig.pingTimer);
        this.addToTimeouts(this.avayaChatConfig.pingInterval);

        this.chatLogin();

        // if there are agents in the chat, enable the controls
        if (Object.keys(this.avayaChatStore.users).length === 0) {
            // eslint-disable-next-line no-console
            console.debug('WebChat: No users in room, disabling controls');
            this.avayaChatControl.disableControls(true);
        } else {
            // eslint-disable-next-line no-console
            console.debug('WebChat: Agents already in chat, enabling controls');
            this.avayaChatControl.disableControls(false);
        }
    }

    /**
     * Open the WebSocket
     *
     * @param webChatUrl
     * @returns {boolean}
     */
    openSocket(webChatUrl) {
        sendDebugMessage('Running AvayaChatSocket:openSocket');
        // eslint-disable-next-line no-console
        console.info('WebChat: Opening the WebSocket');
        // Ensures only one connection is open at a time
        if (
            typeof this.avayaChatStore.webSocket !== 'undefined' &&
            this.avayaChatStore.webSocket !== null &&
            this.avayaChatStore.webSocket.readyState !== WebSocket.CLOSED
        ) {
            // eslint-disable-next-line no-console
            console.warn('WebChat: WebSocket is already opened');
            return false;
        }

        clearTimeout(this.avayaChatStore.reconnectionTimeout);

        // Create a new instance of the WebSocket using the specified url
        this.avayaChatStore.webSocket = new WebSocket(webChatUrl);
        // attach event handlers
        this.avayaChatStore.webSocket.onopen = () => {
            this.handleOpen();
        };
        this.avayaChatStore.webSocket.onmessage = (event) => {
            this.handleMessage(event);
        };
        this.avayaChatStore.webSocket.onerror = (event) => {
            this.handleError(event);
        };
        this.avayaChatStore.webSocket.onclose = (event) => {
            // eslint-disable-next-line no-console
            console.debug(`WebChat: Websocket closed with code ${event.code}`);

            // disable the controls upon close
            this.avayaChatControl.disableControls(true);

            // If it is an expected/graceful close, do not attempt to reconnect.
            // Don't attempt reconnect if we haven't connected successfully
            // before
            if (!this.avayaChatStore.previouslyConnected ||
                this.avayaChatStore.dontRetryConnection ||
                event.code === CLOSE_EVENT_CODES.NORMAL_CLOSURE ||
                event.code === CLOSE_EVENT_CODES.NO_STATUS_RCVD
            ) {
                const isChatTransferred =
                    event.code === CLOSE_EVENT_CODES.NORMAL_CLOSURE &&
                    event.reason === CLOSE_EVENT_REASONS.SESSION_RECONNECT;
                !isChatTransferred && clearLocalStorage() && this.handleClose(event, webChatUrl);
                if (isChatTransferred) {
                    this.clearAllInactiveTimers();
                    this.avayaChatUserInterface.makeEndChatButtonInvisible();
                    updateShowFooter(false);
                    removeSuggestionBubbles();
                    this.writeChatSessionTransferred();
                }
            } else if (
                (event.code === CLOSE_EVENT_CODES.ABNORMAL_CLOSURE ||
                    event.code === CLOSE_EVENT_CODES.GOING_AWAY) &&
                parseInt(getLocalStorage('lastChatRequestTimestamp'), 10) >
                this.avayaChatStore.lastChatRequestTimestamp
            ) {
                sendDebugMessage(
                    `AvayaChatSocket::onclose() -- unknown reason for close, code: ${event.code}, reason: ${event.reason}`
                );
            } else {
                this.reconnect();
            }
        };
        return true;
    }

    /**
     * Parse the error message.
     *
     * @param error
     */
    parseErrorMessage(error) {
        sendDebugMessage('Running AvayaChatSocket:parseErrorMessage');
        // eslint-disable-next-line no-console
        const {
            code
        } = error;
        const message = error.errorMessage;

        // eslint-disable-next-line no-console
        console.warn('WebChat: An error with status', code, 'occurred. Error message:', message);

        this.botResponseTimeoutTimer.stop('AvayaChatSocket::parseErrorMessage()');

        // HTTP 503 means "service unavailable" - which is a perfect description
        // for shutting down
        if (code === 503) {
            this.writeResponse(
                this.avayaChatConfig.initializers.closedForMaintenanceText,
                this.avayaChatConfig.writeResponseClassSystem
            );
        } else {
            const errorMsg = this.avayaChatConfig.initializers.errorOccurredText
                .replace('{0}', error.code)
                .replace('{1}', message);
            this.writeResponse(errorMsg, this.avayaChatConfig.writeResponseClassSystem);
        }

        // allow the user to clear the page if not error code 1
        // this stands for "invalid message"
        if (code !== 1) {
            this.avayaChatStore.dontRetryConnection = true;
            this.clearRefresh();
            if (
                typeof this.avayaChatStore.webSocket !== 'undefined' &&
                this.avayaChatStore.webSocket !== null
            ) {
                this.avayaChatStore.webSocket.close();
            }
        }
    }

    /**
     * Reconnect to the WebSocket.
     */
    reconnect() {
        sendDebugMessage('Running AvayaChatSocket:reconnect');
        if (this.avayaChatStore.dontRetryConnection) {
            // eslint-disable-next-line no-console
            console.warn("Attempting to reconnect when we shouldn't!");
            return;
        }

        if (this.avayaChatStore.webSocket.readyState !== WebSocket.OPEN) {
            this.avayaChatStore.customerDetails.isContinuingAfterRefresh = false;
            this.avayaChatStore.reconnectionTimeout = setTimeout(() => {
                if (this.avayaChatStore.totalNumberOfRetries <= this.avayaChatConfig.maxNumberOfRetries) {
                    this.writeResponse(
                        this.avayaChatConfig.initializers.attemptingToReconnectText,
                        this.avayaChatConfig.writeResponseClassSystem
                    );
                    clearTimeout(this.avayaChatStore.reconnectionTimeout);
                    this.avayaChatStore.totalNumberOfRetries += 1;
                    this.openSocket(this.avayaChatStore.webChatUrl);
                } else {
                    this.writeResponse(
                        this.avayaChatConfig.initializers.unableToReconnectText,
                        this.avayaChatConfig.writeResponseClassSystem
                    );
                }
            }, this.avayaChatConfig.retryInterval);
        }
    }

    /**
     * Reset the number of connection attempts after a successful login.
     */
    resetConnectionAttempts() {
        sendDebugMessage('Running AvayaChatSocket:resetConnectionAttempts');
        this.avayaChatStore.totalNumberOfRetries = 0;
        clearTimeout(this.avayaChatStore.reconnectionTimeout);
    }

    /**
     * Reset the WebSocket.
     */
    resetWebSocket() {
        sendDebugMessage('Running AvayaChatSocket:resetWebSocket');
        this.avayaChatStore.initCalled = false;
        this.avayaChatStore.previouslyConnected = false;
        this.avayaChatStore.totalNumberOfRetries = 0;
        this.avayaChatStore.webSocket = null;
    }

    /**
     * Send a message over the WebSocket. May throw an InvalidStateError if
     * connection has failed; this can be ignored.
     *
     * @param {object} outMessage - A JSON object.
     */
    sendMessage(outMessage) {
        sendDebugMessage('Running AvayaChatSocket:sendMessage');
        const newMsg = {
            ...{
                authToken: this.authToken,
            },
            ...outMessage,
        };

        if (outMessage.body.method !== 'requestChat' && outMessage.body.method !== 'renewChat') {
            if (
                typeof this.avayaChatStore.webSocket === 'undefined' ||
                this.avayaChatStore.webSocket === null
            ) {
                return;
            }

            if (this.avayaChatStore.webSocket ? .readyState !== WebSocket.OPEN) {
                return;
            }
        }

        if (
            this.avayaChatConfig ? .isTeslaAssist === true &&
            outMessage.body.method === 'newMessage' &&
            outMessage.body.type === 'text' &&
            this.avayaChatStore ? .isChatTransferRequested !== true
        ) {
            this.botResponseTimeoutTimer.start('AvayaChatSocket::sendMessage()');
        }

        if (newMsg.body.method === 'newMessage' && !this.avayaChatStore.isChatTransferRequested) {
            this.avayaChatStore.customerDetails.isContinuingAfterRefresh = false;
            this.chatMetricsLoggerHandleWebsocketSend();
        }

        this.avayaChatStore.webSocket.send(JSON.stringify(newMsg));
    }

    /**
     * Sends the ping message.
     */
    sendPing() {
        sendDebugMessage('Running AvayaChatSocket:sendPing');
        const ping = {
            apiVersion: '1.0',
            type: 'request',
            body: {
                method: 'ping',
            },
        };
        this.sendMessage(ping);
    }

    isWebsocketClosed() {
        return (
            this.avayaChatStore ? .webSocket &&
            this.avayaChatStore.webSocket ? .readyState === WebSocket.CLOSED
        );
    }

    chatMetricsLoggerHandleWebsocketSend() {
        this.websocketMessageSentTimestamp = new Date().getTime();
    }

    chatMetricsLoggerHandleWebsocketReceive() {
        let timestamp = new Date().getTime();
        if (
            typeof this.websocketMessageSentTimestamp === 'number' &&
            timestamp > this.websocketMessageSentTimestamp
        ) {
            this.chatMetricsLogger.addWorkerId(getLocalStorage('avayaContextID'));
            this.chatMetricsLogger.addMetric('wsrt', timestamp - this.websocketMessageSentTimestamp);
        }
    }
}

export default AvayaChatSocket;