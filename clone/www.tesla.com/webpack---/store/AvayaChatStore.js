/* eslint-disable no-underscore-dangle */
class AvayaChatStore {
    constructor() {
        this._authenticationKey = null;
        // holds details such as names; etc.
        this._customerDetails = {};
        // If set to true, if the Websocket connection fails we will not attempt to re-establish the session
        this._closeTimer = -1;
        this._dontRetryConnection = false;
        this._globallyUniqueIdentifier = null;
        this._initCalled = false;
        // set to true if the user closes manually
        this._manualClose = false;
        this._previouslyConnected = false;
        this._reconnectionTimeout = null;
        this._retries = 0;
        this._totalNumberOfRetries = 0;
        this._users = {};
        this._webSocket = null;
        this._webChatUrl = null;
        this._lastChatRequestTimestamp = null;
        this._chatWasInitiated = false;
        this._mockupWasDisplayed = false;
    }

    /**
     * Get the authentication key.
     * @returns {null}
     */
    get authenticationKey() {
        return this._authenticationKey;
    }

    /**
     * Set the authentication key.
     *
     * @param authenticationKey
     */
    set authenticationKey(authenticationKey) {
        this._authenticationKey = authenticationKey;
    }

    /**
     * Get the customer details.
     * @returns {null}
     */
    get customerDetails() {
        return this._customerDetails;
    }

    /**
     * Set the customer details.
     *
     * @param customerDetails
     */
    set customerDetails(customerDetails) {
        this._customerDetails = customerDetails;
    }

    /**
     * Get the close timer value.
     *
     * @returns {number}
     */
    get closeTimer() {
        return this._closeTimer;
    }

    /**
     * Set the close timer value.
     *
     * @param closeTimer
     */
    set closeTimer(closeTimer) {
        this._closeTimer = closeTimer;
    }

    /**
     * Get whether to retry connection.
     *
     * @returns {boolean}
     */
    get dontRetryConnection() {
        return this._dontRetryConnection;
    }

    /**
     * Set whether to retry connection.
     *
     * @param dontRetryConnection
     */
    set dontRetryConnection(dontRetryConnection) {
        this._dontRetryConnection = dontRetryConnection;
    }

    /**
     * Get the guid.
     * @returns {null}
     */
    get globallyUniqueIdentifier() {
        return this._globallyUniqueIdentifier;
    }

    /**
     * Set the guid.
     *
     * @param globallyUniqueIdentifier
     */
    set globallyUniqueIdentifier(globallyUniqueIdentifier) {
        this._globallyUniqueIdentifier = globallyUniqueIdentifier;
    }

    /**
     * Check if init was called.
     * @returns {null}
     */
    get initCalled() {
        return this._initCalled;
    }

    /**
     * Set true if the init was called.
     *
     * @param initCalled
     */
    set initCalled(initCalled) {
        this._initCalled = initCalled;
    }

    /**
     * True if the chat was closed manually.
     *
     * @returns {boolean}
     */
    get manualClose() {
        return this._manualClose;
    }

    /**
     * Set manual close.
     *
     * @param manualClose
     */
    set manualClose(manualClose) {
        this._manualClose = manualClose;
    }

    /**
     * Get whether previously connected.
     *
     * @returns {boolean}
     */
    get previouslyConnected() {
        return this._previouslyConnected;
    }

    /**
     * Set true if previously connected.
     *
     * @param previouslyConnected
     */
    set previouslyConnected(previouslyConnected) {
        this._previouslyConnected = previouslyConnected;
    }

    /**
     * Get the reconnection timeout.
     *
     * @returns {null}
     */
    get reconnectionTimeout() {
        return this._reconnectionTimeout;
    }

    /**
     * Set the reconnection timeout.
     *
     * @param reconnectionTimeout
     */
    set reconnectionTimeout(reconnectionTimeout) {
        this._reconnectionTimeout = reconnectionTimeout;
    }

    /**
     * Get the retries value.
     *
     * @returns {number}
     */
    get retries() {
        return this._retries;
    }

    /**
     * Get the total number of retries.
     *
     * @returns {number}
     */
    get totalNumberOfRetries() {
        return this._totalNumberOfRetries;
    }

    /**
     * Set the total number of retries.
     *
     * @param totalNumberOfRetries
     */
    set totalNumberOfRetries(totalNumberOfRetries) {
        this._totalNumberOfRetries = totalNumberOfRetries;
    }

    /**
     * Get the users.
     *
     * @returns {null}
     */
    get users() {
        return this._users;
    }

    /**
     * Set the users.
     *
     * @param users
     */
    set users(users) {
        this._users = users;
    }

    /**
     * Set the users.
     *
     * @param users
     */
    set webChatUrl(webChatUrl) {
        this._webChatUrl = webChatUrl;
    }

    /**
     * Get the webSocket.
     *
     * @returns {null}
     */
    get webChatUrl() {
        return this._webChatUrl;
    }

    /**
     * Get the webSocket.
     *
     * @returns {null}
     */
    get webSocket() {
        return this._webSocket;
    }

    /**
     * Set the webSocket.
     *
     * @param webSocket
     */
    set webSocket(webSocket) {
        this._webSocket = webSocket;
    }

    /**
     * Last chat request timestamp.
     *
     * @returns {string}
     */
    get lastChatRequestTimestamp() {
        return this._lastChatRequestTimestamp;
    }

    /**
     * Set last chat request timestamp.
     *
     * @param lastChatRequestTimestamp
     */
    set lastChatRequestTimestamp(lastChatRequestTimestamp) {
        this._lastChatRequestTimestamp = lastChatRequestTimestamp;
    }

    /**
     * get chat was initiated (agent has joined).
     *
     * @returns {boolean}
     */
    get chatWasInitiated() {
        return this._chatWasInitiated;
    }

    /**
     * set chat was initiated (agent has joined).
     *
     * @param status
     */
    set chatWasInitiated(status) {
        this._chatWasInitiated = status;
    }

    /**
     * get chat was initiated (agent has joined).
     *
     * @returns {boolean}
     */
    get mockupWasDisplayed() {
        return this._mockupWasDisplayed;
    }

    /**
     * set chat was initiated (agent has joined).
     *
     * @param status
     */
    set mockupWasDisplayed(status) {
        this._mockupWasDisplayed = status;
    }
}

export default AvayaChatStore;