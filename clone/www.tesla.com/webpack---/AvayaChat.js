import axios from 'axios';
import {
    getSuperRegion
} from '@tesla/region';
import qs from 'qs';
import {
    modal
} from './tds/tds.js';
const {
    openModal
} = modal;
import {
    formatPhone,
    getCountryCode
} from '@tesla/intl-phone';
import LinkHelper from './helpers/LinkHelper.js';
import UpdateContextHelper, {
    ChatEndReasonsEnum
} from './helpers/UpdateContextHelper.js';
import AvayaChatConfig from './config/AvayaChatConfig.js';
import AvayaChatForm from './component/AvayaChatForm/AvayaChatForm.js';
import AvayaChatMessage from './component/AvayaChatMessage/AvayaChatMessage.js';
import AvayaChatLoader from './component/AvayaChatLoader/AvayaChatLoader.js';
import AvayaStatusPopUp from './component/AvayaStatusPopUp/AvayaStatusPopUp.js';
import AvayaChatStore from './store/AvayaChatStore.js';
import AvayaChatSocket from './component/AvayaChatSocket.js';
import AvayaChatUserInterface from './component/AvayaChatUserInterface.js';
import AvayaTypingIndicator from './component/AvayaTypingIndicator/AvayaTypingIndicator.js';
import AvayaHeader from './component/AvayaHeader/AvayaHeader.js';
import AvayaChatControl from './component/AvayaChatControl/AvayaChatControl';
import AvayaChatButton from './component/AvayaChatButton/AvayaChatButton.js';
import UserInterfaceEvents from './helpers/UserInterfaceEvents.js';
import DOMPurify from 'dompurify';
import _merge from 'lodash/merge';

import {
    setLocalStorage,
    getLocalStorage,
    clearLocalStorage,
    sendDebugMessage,
    hideElement,
    createTimer,
} from './utils/AvayaChatUtils.js';
import AnalyticsHelper from './helpers/AnalyticsHelper.js';
import './index.scss';
import './index-configurator-override.css';
import './index-product-override.css';
import {
    createElementWithAttributes,
    getProductInterested,
    getTrafficData,
    setProductInterest,
} from './utils/CommonUtils.js';
import {
    removePendingConnectionIndicator,
    removeSuggestionBubbles,
    updateShowFooter,
} from './utils/MutationUtils.js';
import {
    trafficProperties
} from './Data/constants.js';
import * as Sentry from '@sentry/browser';

// noinspection JSCheckFunctionSignatures
class AvayaChat {
    constructor(config) {
        this.linkHelper = new LinkHelper(config);
        this.avayaChatConfig = _merge(AvayaChatConfig, config);
        this.updateContextHelper = new UpdateContextHelper(this.avayaChatConfig);
        this.avayaChatConfig.isTeslaAssist = config.isTeslaAssist || false;

        this.isCheckAvayaLiveAgentAvailabilityInProgress = false;

        // we need modifiedChatInit if chat was initiated on tcc pages
        if (config.bypassChatBubble || config.formDetails) {
            this.avayaChatConfig.modifiedChatInit = true;
        }

        this.setAnalyticsStatusAndCountryCode();
        this.avayaAnalyticsHelper = new AnalyticsHelper(
            this.avayaChatConfig.isTriagePreChat,
            this.avayaChatConfig.analyticsIsOn
        );

        this.customerDetails = {};
        this.avayaChatStore = new AvayaChatStore();

        this.userInterfaceEvents = new UserInterfaceEvents(
            this.avayaChatConfig,
            this.userInterfaceEvents,
            this.avayaAnalyticsHelper,
            () => {}
        );

        this.avayaChatUserInterface = new AvayaChatUserInterface(
            this.avayaChatConfig,
            this.userInterfaceEvents,
            this.avayaAnalyticsHelper,
            () => {},
            () => {
                this.avayaChatUserInterface.avayaChatBubble.hideChatBubbleBadge();
                if (this.avayaChatStore.webSocket !== null && !this.avayaChatConfig.isWindowMinimized) {
                    this.avayaChatSocket.clearRefresh();
                    this.avayaChatStore.manualClose = true;

                    if (this.avayaChatStore.closeTimer > 0) {
                        clearTimeout(this.avayaChatStore.closeTimer);
                    }

                    if (this.avayaChatStore.webSocket.readyState !== WebSocket.CLOSING) {
                        this.avayaChatStore.dontRetryConnection = true;
                        this.quitChat();
                    }
                }
            },
            async (data) => await this.onChatFormSubmit(data),
            (text) => {
                this.sendChatMessage(text);
            },
            () => {
                this.startTypingTimer();
            },
            () => {
                this.resetChat();
            },
            () => {
                this.onTeslaAssistOpen();
            },
            () => {
                this.updateContextHelper.updateContext(ChatEndReasonsEnum.X_CLICKED_CONFIRMED_YES);
                this.quitChat();
            },
            () => this.avayaChatSocket.isWebsocketClosed()
        );

        this.avayaChatSocket = new AvayaChatSocket(
            this.avayaChatConfig,
            this.avayaChatUserInterface,
            this.avayaChatStore,
            (text, className) => {
                this.writeResponse(text, className);
            },
            (message) => {
                this.handleNotification(message);
            },
            (timeout) => {
                this.addToTimeouts(timeout);
            },
            () => {
                this.chatLogin();
            },
            () => {
                this.clearRefresh();
            },
            () => {
                this.writeChatSessionTransferred();
            },
            () => {
                this.handleBotResponseTimeout();
            },
            () => {
                this.clearAllInactiveTimers();
            }
        );

        this.avayaChatMessage = new AvayaChatMessage({
            avayaChatConfig: this.avayaChatConfig,
            avayaAnalyticsHelper: this.avayaAnalyticsHelper,
            sendMessage: (text, question = null) => {
                this.sendChatMessage(text, question);
            },
            startNewChatSessionCallback: async () => {
                this.minimizeChatAfterConversationEndedTimer.stop();
                this.resetChat();
                this.avayaChatUserInterface.resetChatUserInterface();

                setTimeout(() => {
                    const chatButton = document.querySelector('#tw-chat--avaya-chat__animated_button');
                    chatButton.click();
                }, 500);
            },
        });

        const componentProperties = [
            this.avayaChatConfig,
            this.userInterfaceEvents,
            this.avayaAnalyticsHelper,
        ];
        this.avayaChatForm = new AvayaChatForm(...componentProperties, () => {});
        this.avayaChatLoader = new AvayaChatLoader(...componentProperties);
        this.avayaTypingIndicator = new AvayaTypingIndicator();
        this.avayaStatusPopUp = new AvayaStatusPopUp(this.avayaChatConfig);
        this.avayaHeader = new AvayaHeader();
        this.avayaChatControl = new AvayaChatControl();
        this.avayaChatButton = new AvayaChatButton(...componentProperties);

        this.lastIsTypingSent = 0;
        this.onHoldComfortInterval = null;
        this.onHoldUrlInterval = null;
        // by default, only use one service map.
        this.services = {
            1: {},
        };
        this.timeouts = [];
        this.webOnHoldComfortGroup = null;
        this.webOnHoldURLs = null;
        this.estimatedWaitTimeMapId = '1';
        window.appendMessage = this.appendMessage;
        this.userInactiveTimer = createTimer(120, this.appendInactiveMessage, this);
        this.chatEndTimer = createTimer(120, this.handleChatInactivity, this);
        this.formInactiveTimer = createTimer(240, this.handleFormInactivity, this);
        this.minimizeChatAfterConversationEndedTimer = createTimer(
            // Supposed to be a 5 sec delay, but changing to 0 per Dar's request
            0,
            this.handleMinimizeChatAfterConversationEndedTimer,
            this
        );
    }

    handleBotResponseTimeout() {
        this.avayaChatStore.isChatTransferRequested = true;
        this.tasCheckAvayaLiveAgentAvailability(
            true,
            this.avayaChatConfig.initializers.tas_forms.errorCallBackFormMsg.replace(
                '{0}',
                this.avayaChatConfig.tasCallbackFormsEtaHours
            ),
            () => {
                removeSuggestionBubbles();
            }
        );
    }

    handleChatInactivity() {
        this.avayaChatUserInterface.handleEndChat();
        this.quitChat(this.avayaChatConfig.initializers.chatInactiveEndMsg);
        if (this.avayaChatConfig.isTeslaAssist) {
            this.updateContextHelper.updateContext(ChatEndReasonsEnum.INACTIVITY);
        }
    }

    // refactor later to have all the inactivity handlers
    handleFormInactivity() {
        hideElement('chat-page');
        this.avayaChatUserInterface.handleEndChat();
        this.quitChat(this.avayaChatConfig.initializers.chatInactiveEndMsg);
        if (this.avayaChatConfig.isTeslaAssist) {
            this.updateContextHelper.updateContext(ChatEndReasonsEnum.INACTIVITY);
        }
    }

    handleMinimizeChatAfterConversationEndedTimer() {
        this.avayaChatUserInterface.minimizeChatDialog();
    }

    onChatFormSubmit = async (data) => {
        // need these fields to present to avoid websocket errors
        data.phoneNumber = data.phoneNumber || '';
        data.phone = data.phone || {
            code: '',
            country: '',
            number: ''
        };
        data.zip = data.zip || '';
        data.postalCode = data.postalCode || '';
        data.firstName = data.firstName || '';
        data.lastName = data.lastName || '';
        data.province = data.province || '';
        data.city = data.city || '';

        const customerDetails = data;
        this.customerDetails = customerDetails;
        const {
            isChatLite
        } = this.avayaChatConfig;
        this.clearAllInactiveTimers();
        this.avayaStatusPopUp.hideStatusPopUp();

        if (isChatLite) {
            await this.submitCallbackForm();

            const normalizedlocalStorageDetails = {};

            for (let i = 0; i < this.customerDetails.length; i++) {
                normalizedlocalStorageDetails[this.customerDetails[i].name] = this.customerDetails[i].value;
            }

            normalizedlocalStorageDetails.postalCode = normalizedlocalStorageDetails.zip;
            setLocalStorage('customerDetails', JSON.stringify(normalizedlocalStorageDetails));

            const modalDialog = document.querySelector(`.tw-chat--avaya-chat__modal`);

            if (modalDialog) {
                modalDialog.scrollTo({
                    top: modalDialog.scrollHeight,
                });
            }
        } else {
            this.customerDetails.phone = customerDetails.phoneNumber;
            this.customerDetails.zip = customerDetails.postalCode;

            setLocalStorage('customerDetails', JSON.stringify(this.customerDetails));
            // if we are not on tcc pages, set autoInitiate for next chat
            if (!this.avayaChatConfig.modifiedChatInit) {
                this.avayaChatConfig.autoInitiate = true;
            }

            if (this.avayaChatConfig.isTeslaAssist) {
                await this.submitLead();
            } else {
                this.initChat(true, customerDetails);
            }
        }
    };

    tasCheckAvayaLiveAgentAvailability = (
        transferToLiveAgent = true,
        callBackFormMsg = this.avayaChatConfig.initializers.tas_forms.callBackFormMsg,
        onFormGeneratedCallback = () => {}
    ) => {
        if (this.isCheckAvayaLiveAgentAvailabilityInProgress) return;
        this.isCheckAvayaLiveAgentAvailabilityInProgress = true;

        // to do: this is already called in index.js but for incremental refactor we will call it again here.
        // We tried to pass in the flags from upstream and read them in avayachatconfig but it broke the experience.
        // Once we migrate to new LD flags, we will refactor this next
        const url = '/conversation/get-chat-init-configs';
        const windowLocale = window ? .avaya ? .locale;
        const localeWithDash = windowLocale.replace(/[_-]/, '-').toLowerCase() || 'en-us';
        axios
            .post(url, qs.stringify({
                locale: windowLocale
            }))
            .then((response) => {
                let {
                    isChatLite,
                    isMobile,
                    triage
                } = response ? .data ? .LDChatConfigurations;

                this.agentRequestData = {
                    chatLiteFlag: isChatLite,
                    hideOnMobiles: !isMobile,
                    locale: localeWithDash,
                    teslaAssistFlag: !transferToLiveAgent,
                    triagePreChat: triage,
                    transferToLiveAgent: transferToLiveAgent,
                    request_id_type: 'contextID',
                    request_id: getLocalStorage('avayaContextID'),
                };

                axios
                    .post('/conversation/check-availability-v2', qs.stringify(this.agentRequestData))
                    .then((response) => {
                        const {
                            // error = false,
                            success,
                            avayaPrerequisite,
                        } = response.data;
                        let {
                            chatWidgetParams
                        } = response.data;
                        this.avayaChatConfig = { ...this.avayaChatConfig,
                            ...chatWidgetParams
                        };

                        const chatFrame = document.querySelector('.tw-chat--avaya-chat__frame');
                        if (success === true) {
                            window.avaya.is_agent_available = true;
                            this.writeResponse(
                                this.avayaChatConfig.initializers.tas_forms.chatFormMsg,
                                this.avayaChatConfig.writeResponseClassResponse
                            );
                            const serviceMap =
                                avayaPrerequisite.serviceMetricsResponseMap[this.estimatedWaitTimeMapId];
                            this.parseServiceMap(serviceMap);
                            this.avayaChatUserInterface.showChatForm(chatFrame);
                            this.formInactiveTimer.start();
                            onFormGeneratedCallback();
                        } else {
                            window.avaya.is_agent_available = false;
                            this.writeResponse(
                                callBackFormMsg.replace('{0}', this.avayaChatConfig.tasCallbackFormsEtaHours),
                                this.avayaChatConfig.writeResponseClassResponse
                            );
                            this.showChatCallBackFrom(chatFrame);
                            onFormGeneratedCallback();
                        }
                    })
                    .catch((error) => {
                        Sentry.captureException(error, {
                            tags: {
                                errorMessage: 'Error occurred while checking Avaya Chat availability.',
                            },
                        });

                        // TODO: https://issues.teslamotors.com/browse/DWP-12804.
                        if (this.avayaChatConfig.isTeslaAssist) {
                            this.displayFinalError();
                            this.avayaChatButton.hideChatButton();
                        }
                    });
            })
            .catch((error) => {
                Sentry.captureException(error, {
                    tags: {
                        errorMessage: 'Error occurred while fetching LD flags before agent transfer',
                    },
                });

                // TODO: https://issues.teslamotors.com/browse/DWP-12804.
                if (this.avayaChatConfig.isTeslaAssist) {
                    this.displayFinalError();
                    this.avayaChatButton.hideChatButton();
                }
            });
    };

    showChatCallBackFrom(chatFrame) {
        this.avayaChatConfig.isChatLite = true;
        this.clearAllInactiveTimers();
        const componentProperties = [{ ...this.avayaChatConfig
            },
            this.userInterfaceEvents,
            this.avayaAnalyticsHelper,
        ];
        this.avayaChatForm = new AvayaChatForm(...componentProperties, this.onChatFormSubmit);

        const avayaChatForm = this.avayaChatForm.generateAvayaChatForm();
        avayaChatForm.classList.add(`tw-chat--avaya-chat__modal-logon`);
        chatFrame.append(avayaChatForm);

        chatFrame.scroll({
            top: chatFrame.scrollHeight,
        });
        updateShowFooter(false);
        this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.taCallbackFormShownInteraction);
        this.formInactiveTimer.start();
    }

    async onTeslaAssistOpen(shouldResetChat = false) {
        const data = {};
        // need these fields to present to avoid websocket errors
        data.phoneNumber = '';
        data.phone = {
            code: '',
            country: '',
            number: ''
        };
        data.zip = '';
        data.postalCode = '';
        data.firstName = '';
        data.lastName = '';
        data.province = '';
        data.city = '';

        const customerDetails = data;
        this.customerDetails = customerDetails;
        this.avayaStatusPopUp.hideStatusPopUp();
        sendDebugMessage('Running AvayaChat:onTeslaAssistOpen');

        if (shouldResetChat === true) {
            this.resetChat();
            this.avayaChatUserInterface.resetChatUserInterface();
        }

        this.initChat(true, customerDetails);
    }

    /**
     * Add to the timeouts.
     *
     * @param timeout
     */
    addToTimeouts(timeout) {
        sendDebugMessage('Running AvayaChat:addToTimeouts');
        this.timeouts.push(timeout);
    }

    /**
     * Sets analytics status depending on the country (analytics is off only in REEU countries)
     */
    setAnalyticsStatusAndCountryCode() {
        const countryCode = this.avayaChatConfig.locale.split('-')[1].toUpperCase();
        const superRegionCode = getSuperRegion(countryCode).code;

        let analyticsIsOn = true;
        if (
            superRegionCode === 'REEU' ||
            (this.avayaChatConfig.isChatLite && !this.avayaChatConfig.isTriagePreChat)
        ) {
            analyticsIsOn = false;
        }
        this.avayaChatConfig.analyticsIsOn = analyticsIsOn;
        this.avayaChatConfig.countryCode = countryCode;
    }

    /**
     * Log the user into the chat.
     */
    chatLogin() {
        sendDebugMessage('Running AvayaChat:chatLogin');
        const wantsEmail = false;
        const topic = this.avayaChatConfig.typeOfPage;
        const {
            leaseTime
        } = this.avayaChatConfig;
        sendDebugMessage(
            `WebChat: Chat attributes are ${JSON.stringify(this.avayaChatConfig.attributes)}`
        );

        const calledParty = window.location.href;
        let msg;

        if (!this.avayaChatStore.previouslyConnected) {
            let customFields = [];
            if (typeof this.avayaChatStore.customerDetails.getUpdates !== 'undefined') {
                customFields = [{
                    title: 'getUpdates',
                    value: this.avayaChatStore.customerDetails.getUpdates,
                }, ];
            }
            this.avayaChatStore.isChatTransferRequested = false;

            const isProd =
                window.origin &&
                (window.origin.includes('https://www.tesla.com') ||
                    window.origin.includes('http://www.tesla.com'));

            let envPostFix = '';
            let routePointIdentifier = this.avayaChatConfig.routePointIdentifier;
            if (!isProd && this.avayaChatConfig.isTeslaAssist) {
                envPostFix = '-stg';

                if (!routePointIdentifier.includes('_stg')) {
                    routePointIdentifier += '_stg';
                }
            }

            msg = {
                apiVersion: '1.0',
                type: 'request',
                body: {
                    method: 'requestChat',
                    deviceType: navigator.userAgent,
                    routePointIdentifier: routePointIdentifier,
                    workFlowType: this.avayaChatConfig.workflowType,
                    requestTranscript: wantsEmail,
                    workRequestId: getLocalStorage('contextId'),
                    calledParty,
                    leaseTime,
                    intrinsics: {
                        channelAttribute: 'Chat',
                        textDirection: document.dir.toUpperCase(),
                        attributes: this.avayaChatConfig.isTeslaAssist ?
                            [...this.avayaChatConfig.attributes, `Automation.TAS${envPostFix}`] :
                            [...this.avayaChatConfig.attributes],
                        email: this.avayaChatStore.customerDetails.email,
                        name: this.avayaChatStore.customerDetails.firstName,
                        lastName: this.avayaChatStore.customerDetails.lastName,
                        phoneNumber: this.avayaChatStore.customerDetails.phoneNumber,
                        teslaupdate: this.avayaChatStore.customerDetails.teslaupdate,
                        topic,
                        customFields,
                    },
                    priority: this.avayaChatConfig.isTeslaAssist ?
                        this.avayaChatConfig.tasPriority :
                        this.avayaChatConfig.priority,
                    customData: {
                        ...this.avayaChatConfig.customData,
                        locale: this.avayaChatConfig.locale.replace('-', '_'),
                    },
                },
            };
        } else {
            if (!this.avayaChatConfig.bypassChatBubble) {
                this.avayaChatButton.showChatButton();
            }

            // check if this is continuing after a page refresh or just a network glitch
            // if this is a page refresh, then we will request the full transcript
            const isAfterRefresh = this.avayaChatStore.customerDetails.isContinuingAfterRefresh;
            // eslint-disable-next-line no-console

            msg = {
                apiVersion: '1.0',
                type: 'request',
                body: {
                    method: 'renewChat',
                    guid: this.avayaChatStore.globallyUniqueIdentifier,
                    authenticationKey: this.avayaChatStore.authenticationKey,
                    requestFullTranscript: isAfterRefresh, // TODO: Get Tesla assist reconnection payload
                },
            };
        }

        this.avayaChatSocket.sendMessage(msg);
    }

    /**
     * Change agent visibility
     *
     * @param id
     * @param role
     * @returns {boolean}
     */
    checkAgentVisibility(id, role) {
        sendDebugMessage('Running AvayaChat:checkAgentVisibility');
        // check if notifications are allowed/required
        const announceBot =
            id === 'AvayaAutomatedResource' && !this.avayaChatConfig.suppressChatbotPresence;
        const announceObserve = role === 'supervisor_observe' && this.avayaChatConfig.notifyOfObserve;
        const announceBarge =
            role === 'supervisor_barge' &&
            this.avayaChatConfig.notifyOfBarge &&
            !this.avayaChatConfig.notifyOfObserve;

        // if notifications are allowed/required, display them
        return announceBot || announceObserve || announceBarge || role === 'active_participant';
    }

    /**
     * Clear all In-Active timers
     */
    clearAllInactiveTimers() {
        this.userInactiveTimer.stop();
        this.chatEndTimer.stop();
        this.formInactiveTimer.stop();
    }
    /**
     * Clear all timeouts
     */
    clearAllTimeouts() {
        sendDebugMessage('Running AvayaChat:clearAllTimeouts');
        this.clearAllInactiveTimers();
        for (let timeoutIndex = 0; timeoutIndex < this.timeouts.length; timeoutIndex++) {
            clearTimeout(this.timeouts[timeoutIndex]);
        }
    }

    /**
     * Clear session storage.
     */
    clearRefresh() {
        sendDebugMessage('Running AvayaChat:clearRefresh');
        // eslint-disable-next-line no-console
        console.debug('WebChat: clearing refresh');
        if (!this.avayaChatConfig.sessionWasTransferred) {
            clearLocalStorage();
        }
        this.avayaChatStore.initCalled = false;
    }

    /**
     * Clears the customer's typing timeout.
     *
     * @param agentTypeOut
     */
    // eslint-disable-next-line class-methods-use-this
    clearTypingTimeout(agentTypeOut) {
        sendDebugMessage('Running AvayaChat:clearTypingTimeout');
        if (agentTypeOut) {
            clearTimeout(agentTypeOut);
        }
    }

    /**
     * Converts the chatLogon attributes array into a service map
     * @returns {{Channel: [string]}}
     */
    createAttributeMap() {
        sendDebugMessage('Running AvayaChat:createAttributeMap');
        // eslint-disable-next-line no-console
        console.debug('Estimated Wait Time: Creating attribute map');

        // Channel.Chat is required for Web Chat, so hard-code this in here
        const attributes = {
            Channel: ['Chat'],
        };

        const attributesArray = this.avayaChatConfig.attributes;
        for (let i = 0; i < attributesArray.length; i++) {
            const attr = attributesArray[i];
            const array = attr.split('.');
            const key = array[0];
            const value = array[1];
            let attrArray;

            // Check if the attribute key (e.g. Location) already exists. If not, add it.
            // Otherwise, update the attributes.
            if (Object.keys(attributes).indexOf(key) < 0) {
                attrArray = [value];
                attributes[key] = attrArray;
            } else {
                attrArray = attributes[key];
                if (attrArray.indexOf(value) < 0) {
                    attrArray.push(value);
                }
            }
        }

        return attributes;
    }

    /**
     * Handle WebSocket notification
     *
     * @param message
     */
    handleNotification(message) {
        sendDebugMessage('Running AvayaChat:handleNotification');
        const messageObject = JSON.parse(JSON.stringify(message));
        let {
            body
        } = messageObject;
        let {
            method
        } = body;

        if (method === this.avayaChatConfig.jsonMethodRequestChat) {
            this.notifyRequestChat(body);
        } else if (method === this.avayaChatConfig.jsonMethodRouteCancel) {
            this.notifyRouteCancel();
        } else if (method === this.avayaChatConfig.jsonMethodRequestNewParticipant) {
            this.notifyNewParticipant(body);
        } else if (method === this.avayaChatConfig.jsonMethodRequestIsTyping) {
            this.notifyIsTyping(body);
        } else if (method === this.avayaChatConfig.jsonMethodRequestNewMessage) {
            this.notifyNewMessage(body);
        } else if (method === this.avayaChatConfig.jsonMethodRequestCloseConversation) {
            this.notifyCloseConversation();
        } else if (method === this.avayaChatConfig.jsonMethodRequestParticipantLeave) {
            this.notifyParticipantLeave(body);
        } else if (method === this.avayaChatConfig.jsonMethodPing) {
            // do nothing with pings. They just confirm that the
            // WebSocket is open.
            // } else if (method === this.avayaChatConfig.jsonMethodFileTransfer) {
            //   this.notifyFileTransfer(body);
        } else {
            // Error will be handled at AvayaChatInit
            throw new TypeError('Received notification with unknown method: '.concat(method));
        }
    }

    prePopulateUserForms(customerDetails) {
        // if chat wasn't called from tcc page with additional parameter, and we have costumer details in local storage then
        // we updating avayaChatConfig with data from local storage to pre-populate chat lite and auto-initiate chat
        if (
            (customerDetails || this.avayaChatConfig.useEngagementPlaceholderData) &&
            !this.avayaChatConfig.modifiedChatInit
        ) {
            if (Object.keys(this.avayaChatConfig.formDetails.preEngagementForm).length === 0) {
                this.avayaChatConfig.formDetails.preEngagementForm = customerDetails;
                this.avayaChatConfig.autoInitiate = true;
            }

            if (Object.keys(this.avayaChatConfig.formDetails.chatLiteForm).length === 0) {
                this.avayaChatConfig.formDetails.chatLiteForm = customerDetails;
            }
        }
    }

    async initTeslaAssist(useLocalSession) {
        sendDebugMessage('Running AvayaChat:initTeslaAssist');
        this.linkHelper.setupSecurity();
        const customerDetails = JSON.parse(getLocalStorage('customerDetails'));

        if (useLocalSession) {
            this.getChatSessionFromLocalStorage();

            // We've already loaded session data from the storage thus resetting the status of the session transfer.
            this.avayaChatConfig.sessionWasTransferred = false;
        }
        this.avayaChatUserInterface.initTeslaAssistUI();
        if (useLocalSession) {
            const chatFormDetails = JSON.parse(getLocalStorage('chatFormDetails'));
            const disable = chatFormDetails ? .submitted ? true : false;
            this.avayaChatUserInterface.reloadChatPanel();
            customerDetails.isContinuingAfterRefresh = true;
            this.initChat(disable, customerDetails);
        }
    }

    /**
     * Initialize the AvayaChat
     *
     * @returns {Promise<void>}
     */
    async init(useLocalSession = false) {
        if (useLocalSession) {
            this.getChatSessionFromLocalStorage();
        }

        sendDebugMessage('Running AvayaChat:init');
        this.linkHelper.setupSecurity();
        const customerDetails = JSON.parse(getLocalStorage('customerDetails'));
        this.prePopulateUserForms(customerDetails);
        this.avayaChatUserInterface.init();
        this.userInterfaceEvents.handleUIEvents(
            this.avayaChatConfig.analyticsIsOn,
            this.avayaChatConfig
        );
        // TODO: remove this. We need to set Tesla Assist to false window object
        // When successfully transfered to agent.
        if (this.avayaChatConfig.isChatLite) {
            this.avayaAnalyticsHelper.fireEvent(null, 'live-agent-unavailable');
            return;
        }

        this.avayaAnalyticsHelper.fireEvent(null, 'live-agent-available');

        if (useLocalSession) {
            hideElement('main-topics');
            this.avayaChatForm.showChatEngagementForm();
            this.avayaChatUserInterface.reloadChatPanel();
            customerDetails.isContinuingAfterRefresh = true;
            this.writeResponse(
                this.avayaChatConfig.initializers.reloadingPageText,
                this.avayaChatConfig.writeResponseClassSystem
            );
            this.initChat(false, customerDetails);
        }

        // If chat is in progress, prevent user from accidentally closing the page.
        // Can't override default message due to security restrictions
        // so the value returned here doesn't really matter.
        window.addEventListener('beforeunload', () => {
            this.avayaAnalyticsHelper.fireEvent(
                this.avayaAnalyticsHelper.navigateInteraction,
                document.activeElement.href
            );

            if (this.avayaChatStore.initCalled) {
                return "You're about to end your session, are you sure?";
            }
            return false;
        });
    }

    /**
     * Initialize the chat.
     * @param {Boolean} disableControls - defines whether or not to disable the controls. If true, the user will not be able to type a message
     * @param customerDetails
     */
    initChat(disableControls = true, customerDetails) {
        sendDebugMessage('Running AvayaChat:initChat');
        // if the chat has already opened, don't bother opening it
        if (this.avayaChatStore.initCalled) {
            return;
        }
        hideElement('main-topics');
        this.hideFinalError();
        this.avayaChatUserInterface.showLoader();
        this.avayaChatStore.customerDetails = customerDetails;
        this.avayaChatControl.disableControls(disableControls);
        this.avayaChatStore.webChatUrl = this.linkHelper.getWebChatUrl();

        const websocketOpened = this.avayaChatSocket.openSocket(this.linkHelper.getWebChatUrl());
        if (websocketOpened === false) {
            // We don't need the loader if we know the connection can't be opened.
            this.avayaChatUserInterface.hideLoader();
        }

        this.avayaChatStore.initCalled = true;
    }

    /**
     * Notification of the close of the conversation.
     */
    notifyCloseConversation() {
        sendDebugMessage('Running AvayaChat:notifyCloseConversation');

        // Closing the websocket on the client side
        this.avayaChatStore.webSocket.close(1000, 'REASON_CLOSING_CLEANUP');

        this.writeChatEnded();
        this.avayaChatStore.dontRetryConnection = true;
        this.avayaChatStore.previouslyConnected = false;
        clearLocalStorage();

        if (this.avayaChatConfig ? .isTeslaAssist === true) {
            this.writeStartNewChatSessionMessage();
            removePendingConnectionIndicator();
            this.avayaChatForm.hideTasForm();

            if (this.avayaChatStore ? .manualClose === true && !this.avayaChatConfig.isWindowMinimized) {
                this.minimizeChatAfterConversationEndedTimer.start();
            }
        }
    }

    /**
     * Notification of a file transfer.
     *
     * @param body
     */
    notifyFileTransfer(body) {
        sendDebugMessage('Running AvayaChat:notifyFileTransfer');
        // eslint-disable-next-line no-console
        console.info('WebChat: Notifying of file transfer');
        const agentname = body.agentName;
        const {
            uuid
        } = body;
        const wrid = body.workRequestId;
        const url = this.linkHelper.getFileDownloadUrl(uuid, wrid);
        const filename = body.name;
        const timestamp = new Date().toLocaleString();
        let message = this.avayaChatConfig.initializers.fileTransferMessageText;
        message = message.replace('{0}', agentname);
        message = message.replace('{1}', filename);
        message = message.replace('{2}', timestamp);
        message = message.replace('{3}', url);
        this.writeResponse(message, this.avayaChatConfig.writeResponseClassResponse);
    }

    /**
     * Notification of typing.
     *
     * @param body
     */
    notifyIsTyping(body) {
        sendDebugMessage('Running AvayaChat:notifyIsTyping');
        const isAgentTyping = body.isTyping;
        this.setLastChatRequestTimestamp();

        if (isAgentTyping === true) {
            const agent = this.avayaChatStore.users[body.agentId];
            agent.isTyping = isAgentTyping;
            this.updateTypingCell(agent, true);

            let agentTypeOut;
            if (agent.type === 'active_participant') {
                agentTypeOut = this.avayaChatConfig.activeAgentTypeOut;
            } else if (agent.type === 'passive_participant') {
                agentTypeOut = this.avayaChatConfig.passiveAgentTypeOut;
            } else {
                agentTypeOut = this.avayaChatConfig.supervisorTypeOut;
            }

            if (agentTypeOut !== undefined) {
                this.clearTypingTimeout(agentTypeOut);
            }

            agentTypeOut = setTimeout(() => {
                if (Object.keys(this.avayaChatStore.users).length !== 0) {
                    agent.isTyping = false;
                    this.updateTypingCell(agent, false);
                }
            }, this.avayaChatConfig.agentTypingTimeout);
            this.timeouts.push(agentTypeOut);
        }
    }

    /**
     * Notification of a new message.
     *
     * @param body
     */
    notifyNewMessage(body) {
        sendDebugMessage('Running AvayaChat:notifyNewMessage');

        const senderType = body.senderType.toLowerCase();
        const displayName = body.displayName.toLowerCase();
        this.setLastChatRequestTimestamp();

        if (senderType === 'customer') {
            // this is likely to be caused by customer refreshing page
            this.writeResponse(body.message, this.avayaChatConfig.writeResponseClassSent);

            // When the chat session is repopulating on page refresh, we want to make sure
            // to remove suggestion bubbles that precede if there is a record of a customer
            // selection or customer message after the suggestion bubbles
            removeSuggestionBubbles();
        } else if (senderType === 'live_agent') {
            this.avayaTypingIndicator.removeIsTypingIndicator(false, body.displayName);
            this.writeResponse(body.message, this.avayaChatConfig.writeResponseClassAgent);
            removePendingConnectionIndicator();

            // send subject value from the form if it's was filled/present after first agent message
            // and only in case we didn't sent that message before
            const {
                subject
            } = this.avayaChatStore.customerDetails;

            if (this.avayaChatConfig.sendSubjectMessage && subject && subject.length > 0) {
                this.sendChatMessage(subject);
                this.avayaChatConfig.sendSubjectMessage = false;
            }
        } else if (displayName === 'oceana-connector') {
            this.avayaChatUserInterface.hideLoader();
            // upon receiving a message from bot remove typing indicator and enable the send button
            this.avayaTypingIndicator.removeIsTypingIndicator(false, displayName);
            this.userInactiveTimer.stop();
            this.chatEndTimer.stop();
            this.avayaChatControl.disableControls(false);
            const oceanaResponse = body ? .customData ? .[0] ? .data ? .oceana_data || null;
            const tASResponse = body.customData ? .[0] ? .data ? .tas_data || null;
            const hasSuggestions = tASResponse ? .suggestion ? .suggestions ? .length > 0;

            const hasError = oceanaResponse ? .error_code || tASResponse ? .error_code;

            if (hasError) {
                const shouldTransferToAnAgent =
                    oceanaResponse ? .agent_transfer || tASResponse ? .agent_transfer;
                if (shouldTransferToAnAgent) {
                    this.avayaChatStore.isChatTransferRequested = true;
                } else {
                    this.avayaChatStore.webSocket.close();
                }
                this.tasCheckAvayaLiveAgentAvailability(shouldTransferToAnAgent);
                return;
            }

            if (tASResponse.response) {
                if (this.handleOceanaResponseEdgeCases(tASResponse ? .response)) {
                    return;
                }

                if (tASResponse.agent_transfer === true) {
                    this.avayaChatStore.isChatTransferRequested = true;
                    const chatFormDetails = JSON.parse(getLocalStorage('chatFormDetails'));
                    if (chatFormDetails ? .submitted) {
                        this.writeResponse(
                            this.avayaChatConfig.initializers.tas_forms.chatFormMsg,
                            this.avayaChatConfig.writeResponseClassResponse
                        );
                        const customerDetails = JSON.parse(getLocalStorage('customerDetails'));
                        const contactInformationBlurb = {
                            title: 'Contact Information',
                            details: {
                                firstName: customerDetails.firstName,
                                lastName: customerDetails.lastName,
                                phone: customerDetails.phone,
                                email: customerDetails.email,
                            },
                        };

                        this.writeContactCardResponse(contactInformationBlurb);
                        this.writeAgentJoinTimeResponse();
                    } else {
                        this.tasCheckAvayaLiveAgentAvailability(tASResponse.agent_transfer);
                        this.isCheckAvayaLiveAgentAvailabilityInProgress = false;
                    }
                    return;
                }

                if (tASResponse.message_type === 'TEXT' && tASResponse.response.message) {
                    this.writeResponse(
                        tASResponse.response.message,
                        this.avayaChatConfig.writeResponseClassResponse
                    );
                } else if (
                    tASResponse.message_type === 'BLOB' &&
                    tASResponse.response.title &&
                    tASResponse.response.cta
                ) {
                    this.writeResponseCTA({
                        text: tASResponse.response.message,
                        className: this.avayaChatConfig.writeResponseClassResponse,
                        responseType: tASResponse.message_type,
                        cta: tASResponse.response.cta,
                        title: tASResponse.response.title,
                    });
                    // Not sure if this else statement will ever be triggered. It depends on whether there are
                    // message_types beyond text/blob
                } else {
                    this.writeResponse(
                        tASResponse.response.message,
                        this.avayaChatConfig.writeResponseClassResponse
                    );

                    if (!hasSuggestions) {
                        updateShowFooter(true);
                    }
                }
            }

            if (hasSuggestions) {
                updateShowFooter(false);
                // Text input should be hidden if TAS suggestions are available
                // will show the input once the user clicks Show More.

                const sortedSuggestions = tASResponse.suggestion.suggestions.sort(
                    (a, b) => a.rank - b.rank
                );
                this.appendSuggestions(sortedSuggestions);
            } else {
                // When the user refreshes the page and the most recent message has no suggestions
                // we want to show the text input / footer
                updateShowFooter(true);
            }

            this.userInactiveTimer.start();
        } else {
            const chatMessageClass =
                senderType === 'bot' ?
                this.avayaChatConfig.writeResponseClassChatbot :
                this.avayaChatConfig.writeResponseClassResponse;
            if (body.type === 'widget') {
                this.writeResponse(body.data.text, chatMessageClass);
            } else {
                this.writeResponse(body.message, chatMessageClass);
            }
        }

        this.bubbleBadgeNotify();
    }

    handleOceanaResponseEdgeCases(response) {
        if (response !== null) {
            if (response ? .message === 'If you need anything, you can start a new chat anytime.') {
                sendDebugMessage('Running AvayaChat:handleOceanaResponseEdgeCases -- quiting chat');
                this.quitChat();

                return true;
            }
        }

        return false;
    }

    bubbleBadgeNotify() {
        if (this.avayaChatConfig.isTeslaAssist === true) {
            this.avayaChatUserInterface.avayaChatBubble.showChatBubbleBadge();
        }
    }

    appendSuggestions = (suggestions) => {
        const showMoreIncrement = 4;

        // This replicates flexbox space-between given a dynamic number of messages before and after
        // the spacer component. It will grow to occupy as much space as possible, thus pushing down the
        // suggestion bubbles. This spacer should be removed whenever the suggestion bubbles dissapear
        const spacerDiv = createElementWithAttributes('div', {
            class: 'tw-chat--suggestions-spacer',
        });
        const avayaChatFrame = document ? .querySelector(`.tw-chat--avaya-chat__frame`);
        avayaChatFrame ? .append(spacerDiv);

        suggestions.forEach((suggestion, index) => {
            if (index === showMoreIncrement) {
                this.writeResponse(
                    'Show more',
                    this.avayaChatConfig.writeResponseClassResponse,
                    'button',
                    'showMore',
                    false
                );
            }

            this.writeResponse(
                suggestion.display_message,
                this.avayaChatConfig.writeResponseClassResponse,
                'button',
                suggestion.question,
                index > showMoreIncrement - 1
            );
        });
    };

    appendInactiveMessage() {
        const inactiveSuggestion = [{
            question: 'I still need help',
            display_message: 'Yes'
        }];
        this.writeResponse('Are you still there?', this.avayaChatConfig.writeResponseClassResponse);
        this.appendSuggestions(inactiveSuggestion);
        this.bubbleBadgeNotify();
        this.chatEndTimer.start();
    }

    /**
     * Notification of a new participant.
     *
     * @param body
     */
    notifyNewParticipant(body) {
        sendDebugMessage('Running AvayaChat:notifyNewParticipant');
        this.setLastChatRequestTimestamp();

        if (!this.avayaChatStore.chatWasInitiated) {
            this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.startedInteraction);
        }

        // enable the controls now in case there are any missing fields in the request
        this.avayaChatControl.disableControls(false);
        updateShowFooter(true);
        this.stopOnHoldMessages();
        this.avayaChatStore.chatWasInitiated = true;

        const id = body.agentId;
        const {
            role
        } = body;

        if (this.checkAgentVisibility(id, role) && !this.avayaChatConfig.isTeslaAssist) {
            this.writeResponse(
                this.avayaChatConfig.initializers.agentJoinedMessage,
                this.avayaChatConfig.writeResponseClassSystem
            );
        } else if (
            this.avayaChatConfig.isTeslaAssist &&
            id !== 'AvayaAutomatedResource' &&
            body ? .displayName !== 'Tesla Chatbot' &&
            role === 'active_participant'
        ) {
            document.querySelector('#chat-page') ? .remove();

            this.avayaAnalyticsHelper.fireEvent(
                this.avayaAnalyticsHelper.taChatAgentAvailableInteraction
            );
            this.avayaChatMessage.writeChatStatusMessage(
                this.avayaChatConfig.initializers ? .taAgentJoinedMessage
            );
        }

        const agents = body.participants;
        this.updateUsers(agents);

        if (
            typeof body.webOnHoldComfortGroup !== 'undefined' &&
            body.webOnHoldComfortGroup.length > 0
        ) {
            const [webOnHoldComfortGroup] = body.webOnHoldComfortGroup;
            this.webOnHoldComfortGroup = webOnHoldComfortGroup;
        }

        this.bubbleBadgeNotify();
        removePendingConnectionIndicator();
    }

    /**
     * Notification that a participant has left the chat.
     *
     * @param body
     */
    notifyParticipantLeave(body) {
        sendDebugMessage('Running AvayaChat:notifyParticipantLeave');
        const id = body.agentId;
        const agents = body.participants;

        // workaround to make sure Chrome closes on a two-node cluster
        if (body.endChatFlag) {
            this.avayaChatStore.dontRetryConnection = true;
        }

        // check if this user is actually present in the users to avoid multiple displays of "An agent has left".
        // This does not affect the chatbot.
        let isAgentContained = false;
        for (let i = 0; i < agents.length; i++) {
            if (agents[i].id === id) {
                isAgentContained = true;
                break;
            }
        }

        const leaveReason = body.leaveReason.toLowerCase();
        // check if this is the chatbot, barge and observer, and if they are to be suppressed.
        const suppressBot = leaveReason === 'escalate' && this.avayaChatConfig.suppressChatbotPresence;
        const suppressBarge =
            this.avayaChatStore.users[id].type === 'supervisor_barge' &&
            !this.avayaChatConfig.notifyOfBarge;
        const suppressObserver =
            this.avayaChatStore.users[id].type === 'supervisor_observe' &&
            !this.avayaChatConfig.notifyOfObserve;

        // if there are no users, check if this is a transfer.
        if (Object.keys(body.participants).length === 0 && !body ? .endChatFlag) {
            // eslint-disable-next-line no-console
            console.info('WebChat: Only the customer remains in the room!!!!!.');
            this.avayaChatControl.disableControls(true);
            this.startOnHoldMessages();

            if (leaveReason === 'transfer' && !this.avayaChatConfig.isTeslaAssist) {
                // use store or local storage to update.
                this.writeResponse(
                    this.avayaChatConfig.initializers.transferNotificationText,
                    this.avayaChatConfig.writeResponseClassSystem
                );
            } else if (leaveReason === 'requeue') {
                this.writeResponse(
                    this.avayaChatConfig.initializers.requeueNotificationText,
                    this.avayaChatConfig.writeResponseClassSystem
                );
            } else if (leaveReason === 'escalate' && !this.avayaChatConfig.suppressChatbotPresence) {
                this.writeResponse(
                    this.avayaChatConfig.initializers.chatbotTransferNotification,
                    this.avayaChatConfig.writeResponseClassSystem
                );
            } else if (leaveReason === 'transfer_to_user') {
                this.writeResponse(
                    this.avayaChatConfig.initializers.transferToUserText,
                    this.avayaChatConfig.writeResponseClassSystem
                );
            } else {
                if (!this.avayaChatConfig.isTeslaAssist) {
                    // use store or local storage to update.
                    this.writeResponse(
                        this.avayaChatConfig.initializers.agentLeftMessage,
                        this.avayaChatConfig.writeResponseClassSystem
                    );
                }
            }
        } else if (!suppressBot && !isAgentContained && !suppressBarge && !suppressObserver) {
            this.writeResponse(
                this.avayaChatConfig.initializers.agentLeftMessage,
                this.avayaChatConfig.writeResponseClassSystem
            );
        }

        if (body.endChatFlag) {
            this.notifyCloseConversation();
        }

        this.updateUsers(agents);
    }

    async submitLead() {
        // After openSocket.
        const {
            attributes,
            locale,
            routePointIdentifier,
            submitLeadURL,
            typeOfPage,
            apiEndpointsDomain,
            isTeslaAssist,
        } = this.avayaChatConfig;
        const contextID = getLocalStorage('avayaContextID');
        const localeArr = locale.split('-');
        const countryCode = localeArr[1].toUpperCase();
        const trafficData = getTrafficData();

        let updatedCustomerDetails = {};
        this.formInactiveTimer.stop();

        if (this.customerDetails && this.customerDetails['phone']) {
            updatedCustomerDetails['phone'] = {
                country: countryCode,
                code: getCountryCode(countryCode),
                number: formatPhone(this.customerDetails['phone'], countryCode),
            };
        }

        const formattedCustomerDetails = {
            ...this.customerDetails,
            ...updatedCustomerDetails,
        };

        if (isTeslaAssist) {
            const isProd =
                window ? .origin ? .includes('https://www.tesla.com') ||
                window ? .origin ? .includes('http://www.tesla.com');

            const envPostFix = routePointIdentifier === 'Sales' || isProd ? '' : '-stg';

            attributes.push(`Automation.TAS${envPostFix}`);
        }

        const submitLeadData = {
            useEngagementPlaceholderData: this.avayaChatConfig.useEngagementPlaceholderData,
            formId: typeOfPage,
            formData: { ...formattedCustomerDetails,
                attributes: attributes.join()
            },
            // format, en-US, not en-US. Country code must be capitalized
            locale: [localeArr[0], countryCode].join('-'),
            contextID,
            isTAS: isTeslaAssist,
        };

        if (trafficData) {
            Object.keys(trafficData).forEach((key) => {
                if (key in trafficProperties) {
                    submitLeadData.formData[key] = trafficData[key];
                }
            });
        }
        const submitLeadPayload = qs.stringify(submitLeadData);
        const submitLeadUrl = apiEndpointsDomain + submitLeadURL;

        try {
            await axios.post(submitLeadUrl, submitLeadPayload);

            if (isTeslaAssist) {
                this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.taChatAgentFormSubmitted);
                const chatFormDetails = JSON.parse(getLocalStorage('chatFormDetails')) || {};
                this.avayaChatForm.hideTasForm();
                this.avayaChatUserInterface.changeToChatMode();

                const ContactInformationBlurb = {
                    title: 'Contact Information',
                    details: {
                        firstName: formattedCustomerDetails.firstName,
                        lastName: formattedCustomerDetails.lastName,
                        email: formattedCustomerDetails.email,
                        phone: formattedCustomerDetails.phone.number,
                        ...(Object.hasOwn(formattedCustomerDetails, 'getUpdates') && {
                            getUpdates: formattedCustomerDetails.getUpdates,
                        }),
                        postalCode: formattedCustomerDetails.zip,
                    },
                };

                this.writeContactCardResponse(ContactInformationBlurb);
                this.writeAgentJoinTimeResponse();
                chatFormDetails.submitted = true;
                setLocalStorage('chatFormDetails', JSON.stringify(chatFormDetails));
            }
        } catch (err) {
            Sentry.captureException(err);
            if (isTeslaAssist) {
                this.displayFinalError();
                this.avayaChatButton.hideChatButton();
            }
        } finally {
            this.isCheckAvayaLiveAgentAvailabilityInProgress = false;
        }

        if (isTeslaAssist) {
            axios
                .post(
                    `${apiEndpointsDomain ? apiEndpointsDomain : ''}/conversation/transfer-live-agent`,
                    qs.stringify({
                        WorkRequestId: contextID,
                        locale
                    })
                )
                .catch((error) => {
                    Sentry.captureException(error, {
                        tags: {
                            errorMessage: 'Failed to call /conversation/transfer-live-agent.',
                        },
                    });
                    this.displayFinalError();
                });
        }
    }

    async submitCallbackForm() {
        const {
            locale,
            callBackURL,
            apiEndpointsDomain,
            isTeslaAssist
        } = this.avayaChatConfig;
        const localeArr = locale.split('-');
        const countryCode = localeArr[1].toUpperCase();
        const {
            pathname
        } = window.location;
        const trafficData = getTrafficData();

        const submitLeadData = {
            formReferrer: 'avayaChat',
            formId: '179',
            formType: 'legacy',
            formLocale: [localeArr[0], countryCode].join('-'),
            formData: {
                fields: this.customerDetails
            },
        };

        if (isTeslaAssist) {
            const chatAttributes = this.avayaChatConfig ? .attributes || [];

            if (chatAttributes.length > 0) {
                const isProd =
                    window ? .origin ? .includes('https://www.tesla.com') ||
                    window ? .origin ? .includes('http://www.tesla.com');
                const envPostFix = isProd ? '' : '-stg';
                chatAttributes.push(`Automation.TAS${envPostFix}`);
            }

            submitLeadData.chatattributes =
                chatAttributes.join(',') ||
                'Country.null,Language.null,LOB.null,Concern.null,Automation.null';

            // add product interested to form data
            const productInterested = getProductInterested(pathname);

            if (productInterested) {
                submitLeadData.formData.fields.push({
                    name: 'productInterested',
                    value: [productInterested],
                });
            }

            //show contact information if tesla assist
            hideElement('chat-page');
            const contactInformationBlurb = {
                title: 'Contact Information',
                details: {},
            };
            this.customerDetails.forEach((detail) => {
                if (typeof detail === 'object' && detail !== null) {
                    if (detail.name === 'phone') {
                        contactInformationBlurb.details[detail.name] = formatPhone(
                            detail.value.number,
                            countryCode
                        );
                        return;
                    }
                    contactInformationBlurb.details[detail.name] = detail.value;
                }
            });
            this.writeContactCardResponse(contactInformationBlurb);
        }

        this.formInactiveTimer.stop();

        // add the traffic data to formData
        if (trafficData) {
            Object.keys(trafficData).forEach((key) => {
                if (key in trafficProperties) {
                    submitLeadData.formData.fields.push({
                        name: key,
                        value: trafficData[key],
                    });
                }
            });
        }

        const submitLeadPayload = JSON.stringify(submitLeadData);
        const domainSpecificCallbackURL = `${apiEndpointsDomain}/${localeArr.join('_')}${callBackURL}`;

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data: submitLeadPayload,
            url: domainSpecificCallbackURL,
        };

        this.avayaChatForm.disableFormButtonAndInputs();
        this.avayaAnalyticsHelper.fireEvent(null, 'request-a-callback');

        try {
            await axios(options);
            if (isTeslaAssist) {
                this.avayaChatUserInterface.handleEndChat();
                this.quitChat(this.avayaChatConfig.initializers.chatEndCallBackMsg);
            } else {
                this.avayaStatusPopUp.showStatusPopUp(true);
            }
        } catch (err) {
            Sentry.captureException(err);
            this.avayaStatusPopUp.showStatusPopUp(false);
        } finally {
            this.isCheckAvayaLiveAgentAvailabilityInProgress = false;
            this.avayaChatButton.hideChatButton();
        }
    }

    /**
     * Notification of a chat request.
     *
     * @param body
     */
    notifyRequestChat(body) {
        sendDebugMessage('Running AvayaChat:notifyRequestChat');
        this.avayaChatStore.globallyUniqueIdentifier = body.guid;
        this.avayaChatStore.customerDetails.displayName = body.intrinsics.name;
        this.avayaChatStore.authenticationKey = body.authenticationKey;

        const {
            workRequestId
        } = body;

        setLocalStorage('avayaContextID', workRequestId);

        if (!this.avayaChatStore.previouslyConnected) {
            setProductInterest(this.avayaChatConfig.attributes);
        }

        const localStorageIsTAS = getLocalStorage('isTAS');

        if (typeof localStorageIsTAS !== 'string' && typeof localStorageIsTAS !== 'boolean') {
            setLocalStorage('isTAS', this.avayaChatConfig.isTeslaAssist);
        }

        setLocalStorage('guid', this.avayaChatStore.globallyUniqueIdentifier);
        setLocalStorage('ak', this.avayaChatStore.authenticationKey);
        setLocalStorage('oceanaWebChatSocket', this.linkHelper.secureSocket);
        setLocalStorage('customerDetails', JSON.stringify(this.avayaChatStore.customerDetails));
        setLocalStorage('initializers', JSON.stringify(this.avayaChatConfig.initializers));
        setLocalStorage(
            'preEngagementConfig',
            JSON.stringify(this.avayaChatConfig.preEngagementConfig)
        );
        setLocalStorage(
            'tasPreEngagementConfig',
            JSON.stringify(this.avayaChatConfig.tasPreEngagementConfig)
        );
        setLocalStorage('triageConfig', JSON.stringify(this.avayaChatConfig.triageConfig));
        setLocalStorage('callBackFormConfig', JSON.stringify(this.avayaChatConfig.callBackFormConfig));
        setLocalStorage('chatAttributes', JSON.stringify(this.avayaChatConfig.attributes));

        // we don't want to submit each time we open new tab or moving to another page
        if (
            workRequestId &&
            getLocalStorage('lastChatRequestTimestamp') == null &&
            !this.avayaChatConfig.isTeslaAssist
        ) {
            this.submitLead();
            this.setUseLatestTDS();
        }

        this.setLastChatRequestTimestamp();

        // eslint-disable-next-line no-console
        console.info(
            `WebChat: workRequestId is ${workRequestId}, contactUUID/chatroom key is ${this.avayaChatStore.authenticationKey}. Valid email? ${body.isEmailValid}`
        );

        if (this.avayaChatStore.retries > 0) {
            this.avayaChatSocket.resetConnectionAttempts();
        }

        // if the customer has already been connected, don't play the on
        // hold messages
        if (!this.avayaChatStore.previouslyConnected) {
            if (!this.avayaChatConfig.isTeslaAssist) {
                this.writeResponse(
                    this.avayaChatConfig.initializers.AutomatedMessageBody,
                    this.avayaChatConfig.writeResponseClassSent
                );
            }

            this.avayaChatConfig.sendSubjectMessage = true;
            this.avayaChatStore.previouslyConnected = true;

            const [webOnHoldComfortGroups] = body.webOnHoldComfortGroups;
            this.webOnHoldComfortGroup = webOnHoldComfortGroups;
            const [webOnHoldURLs] = body.webOnHoldURLs;
            this.webOnHoldURLs = webOnHoldURLs;
            console.info('WebChat: notify Chat request.');

            if (!this.avayaChatConfig.isTeslaAssist) {
                this.startOnHoldMessages();
                this.sendMessageWithEstimatedWaitTime();
                this.writeResponse(
                    this.avayaChatConfig.initializers.successfulReconnectionText,
                    this.avayaChatConfig.writeResponseClassSystem
                );
            }
        }

        this.avayaChatUserInterface.changeToChatMode();

        if (!this.avayaChatConfig.isTeslaAssist) {
            this.avayaChatUserInterface.hideLoader();
        }
    }

    async sendMessageWithEstimatedWaitTime() {
        let minutesString = new Intl.RelativeTimeFormat(this.avayaChatConfig.locale).format(
            this.avayaChatConfig.estimatedWaitTime,
            'minutes'
        );

        // for zh-cn locale we need to add space between numbers and characters
        if (this.avayaChatConfig.locale === 'zh-cn') {
            // minutes label is 3 characters long for zh-cn locale, that's why we subtracting it
            const minutesStringLabelStart = minutesString.length - 3;
            const numberOfMinutes = minutesString.substring(0, minutesStringLabelStart);
            const minutesLabel = minutesString.substring(minutesStringLabelStart);

            minutesString = `${numberOfMinutes} ${minutesLabel}`;
        }

        const estimatedWaitTimeMsg = this.avayaChatConfig.initializers.chatEstimatedWaitTime.replace(
            '{0}',
            minutesString
        );
        this.writeResponse(estimatedWaitTimeMsg, this.avayaChatConfig.writeResponseClassSystem);
    }

    /**
     * Notification of a route cancellation.
     */
    notifyRouteCancel() {
        sendDebugMessage('Running AvayaChat:notifyRouteCancel');
        this.writeResponse(
            this.avayaChatConfig.initializers.routeCancelText,
            this.avayaChatConfig.writeResponseClassSystem
        );
        this.avayaChatStore.dontRetryConnection = true;
    }

    /**
     * Parses the service map.
     *
     * @param serviceMap
     */
    parseServiceMap(serviceMap) {
        sendDebugMessage('Running AvayaChat:parseServiceMap');
        // check if the Estimated Wait Time is defined here. We assume that chat is available,
        // unless specifically stated otherwise

        const {
            bypassChatBubble,
            maxWaitTime,
            minWaitTime,
            minAgentCount,
            chatAvailableMsg,
            chatNotAvailableMsg,
            noAgentsAvailableMsg,
            chatPossibleMsg,
        } = this.avayaChatConfig;

        let alertMsg = chatPossibleMsg;
        let chatAvailable = true;
        const {
            metrics
        } = serviceMap;
        if (metrics !== undefined) {
            const waitTime = parseInt(metrics.EWT, 10);
            const agentCount = parseInt(metrics.ResourceStaffedCount, 10);
            const chatFormDetails = JSON.parse(getLocalStorage('chatFormDetails')) || {};

            // eslint-disable-next-line no-console
            console.debug(
                `Estimated Wait Time: Wait time is ${waitTime}. Maximum wait time is ${maxWaitTime}`
            );
            // eslint-disable-next-line no-console
            console.debug(
                `Estimated Wait Time: ${agentCount} agents are logged in. Minimum allowed are ${minAgentCount}`
            );

            // if waitTime is less than the maximum and agents are logged in, chat is available. Otherwise, it isn't
            // FYI: if agents are logged in, that doesn't necessarily mean they *can* take a call. They may be busy, or on a break.
            if (waitTime < maxWaitTime && waitTime >= minWaitTime && agentCount >= minAgentCount) {
                const waitTimeInMins = Math.max(Math.ceil(waitTime / 60), 1);
                this.avayaChatConfig.estimatedWaitTime = waitTimeInMins;
                chatFormDetails.agentETA = waitTimeInMins;
                setLocalStorage('chatFormDetails', JSON.stringify(chatFormDetails));
                alertMsg = chatAvailableMsg.replace('{0}', waitTimeInMins);
                chatAvailable = true;
                // eslint-disable-next-line no-console
                console.debug(
                    `Click to chat with an agent! Wait time is approximately ${waitTime} minutes`
                );
            } else {
                chatAvailable = false;
                if (waitTime > this.maxWaitTime) {
                    // customise alert messages depending on the circumstances.
                    alertMsg = chatNotAvailableMsg;
                } else {
                    alertMsg = noAgentsAvailableMsg;
                }
            }
        }

        if (!chatAvailable) {
            this.avayaChatButton.hideChatButton();
        } else {
            // if bypassChatBubble is true, then we want to open the chat as soon as it become
            // available and only in case it hasn't been opened before
            // eslint-disable-next-line no-lonely-if
            if (bypassChatBubble) {
                this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.impressionInteraction);
                const avayaChatDialog = document.querySelector('#avaya-chat-modal');
                openModal(avayaChatDialog);
            } else {
                this.avayaChatButton.showChatButton();
            }
        }

        // leave this in for ease of testing
        // eslint-disable-next-line no-console
        console.debug(alertMsg);
    }

    /**
     * Play on hold message.
     *
     * @param array
     */
    playOnHoldMessage(array) {
        sendDebugMessage('Running AvayaChat:playOnHoldMessage');
        let currentMsg;

        // if this has a urls array, it's a WebOnHold URL
        // otherwise, it's a comfort message
        if (array.urls !== undefined) {
            currentMsg = array.urls[array.currentSequence];
            const msgText = `${array.description}: ${currentMsg.url}`;
            this.writeResponse(msgText, this.avayaChatConfig.writeResponseClassSystem);
        } else {
            currentMsg = array.messages[array.currentSequence];
            this.writeResponse(currentMsg.message, this.avayaChatConfig.writeResponseClassSystem);
        }

        // eslint-disable-next-line no-param-reassign
        array.currentSequence += 1;
        if (
            (array.numberOfMessages !== undefined && array.currentSequence >= array.numberOfMessages) ||
            (array.urls !== undefined && array.currentSequence >= array.urls.length)
        ) {
            // eslint-disable-next-line no-param-reassign
            array.currentSequence = 0;
        }
    }

    /**
     * Return object for close connection request
     */
    // eslint-disable-next-line class-methods-use-this
    getCloseRequest() {
        return {
            apiVersion: '1.0',
            type: 'request',
            body: {
                method: 'closeConversation',
            },
        };
    }

    /**
     * Quit the chat.
     */
    quitChat(quitMsg = this.avayaChatConfig.initializers.youHaveEndedTheChat) {
        sendDebugMessage('Running AvayaChat:quitChat');
        if (this.avayaChatStore.webSocket.readyState === this.avayaChatStore.webSocket.CLOSING) {
            return;
        }
        // Prevent reconnect attempts if customer clicks 'Close' while chat is
        // reconnecting
        this.avayaChatStore.dontRetryConnection = true;
        this.avayaChatStore.manualClose = true;
        this.clearAllTimeouts();
        if (
            this.avayaChatStore.webSocket !== null &&
            this.avayaChatStore.webSocket.readyState === this.avayaChatStore.webSocket.OPEN
        ) {
            const closeRequest = this.getCloseRequest();
            this.avayaChatSocket.sendMessage(closeRequest, this.avayaChatStore.webSocket);
        }
        // Disallow any user input at this point
        removeSuggestionBubbles();
        updateShowFooter(false);

        if (!quitMsg && this.avayaChatConfig.initializers.MessageCanvasTrayParagraph) {
            this.writeResponse(
                this.avayaChatConfig.initializers.MessageCanvasTrayParagraph,
                this.avayaChatConfig.writeResponseClassSystem
            );
        } else {
            this.writeResponse(quitMsg, this.avayaChatConfig.writeResponseClassSystem);
        }

        if (this.avayaChatStore.webSocket.readyState === this.avayaChatStore.webSocket.CLOSED) {
            this.writeChatEnded();
        }
    }

    /**
     * Check if have session stored in local store.
     *
     * @returns {boolean}
     */
    checkForValidSessionInLocalStorage() {
        sendDebugMessage('Running AvayaChat:checkForValidSessionInLocalStorage');

        const ak = getLocalStorage('ak');
        const guid = parseInt(getLocalStorage('guid'), 10);
        const lastChatRequestTimestamp = parseInt(getLocalStorage('lastChatRequestTimestamp'), 10);

        if (
            Number.isNaN(lastChatRequestTimestamp) ||
            ak === null ||
            guid === null ||
            Number.isNaN(guid)
        ) {
            // eslint-disable-next-line no-console
            console.warn('WebChat: Chat opened first time!');
            this.clearRefresh();
            return false;
        }

        const currentTimestamp = Date.now();
        const expired =
            currentTimestamp - lastChatRequestTimestamp >=
            this.avayaChatConfig.refreshTimeoutSeconds * 1000;

        // eslint-disable-next-line no-console
        console.debug('Current and closing timestamps are', currentTimestamp, lastChatRequestTimestamp);
        // eslint-disable-next-line no-console
        console.debug(ak, guid, expired);

        if (expired) {
            // eslint-disable-next-line no-console
            console.warn('WebChat: session has probably expired');
            this.clearRefresh();
            return false;
        }

        return true;
    }

    /**
     * Get session from local store.
     */
    getChatSessionFromLocalStorage() {
        console.debug('WebChat: get chat session from local store');

        const ak = getLocalStorage('ak');
        const guid = parseInt(getLocalStorage('guid'), 10);
        const oceanaWebChatSocket = getLocalStorage('oceanaWebChatSocket');
        const initializers = JSON.parse(getLocalStorage('initializers'));
        const triageConfig = JSON.parse(getLocalStorage('triageConfig'));
        const preEngagementConfig = JSON.parse(getLocalStorage('preEngagementConfig'));
        const tasPreEngagementConfig = JSON.parse(getLocalStorage('tasPreEngagementConfig'));
        const callBackFormConfig = JSON.parse(getLocalStorage('callBackFormConfig'));
        const chatAttributes = JSON.parse(getLocalStorage('chatAttributes'));

        this.avayaChatStore.previouslyConnected = true;
        this.avayaChatStore.globallyUniqueIdentifier = guid;
        this.avayaChatStore.authenticationKey = ak;

        this.linkHelper.secureSocket = oceanaWebChatSocket;

        this.avayaChatConfig.initializers = initializers;
        this.avayaChatConfig.triageConfig = triageConfig;
        this.avayaChatConfig.preEngagementConfig = preEngagementConfig;
        this.avayaChatConfig.tasPreEngagementConfig = tasPreEngagementConfig;
        this.avayaChatConfig.callBackFormConfig = callBackFormConfig;
        this.avayaChatConfig.attributes = chatAttributes;
    }

    /**
     * Reset the chat.
     */
    resetChat() {
        sendDebugMessage('Running AvayaChat:resetChat');
        // eslint-disable-next-line no-console
        console.info('WebChat: Resetting chat');
        this.clearAllTimeouts();
        this.avayaChatStore.authenticationKey = null;
        this.avayaChatStore.globallyUniqueIdentifier = null;
        this.avayaChatStore.chatWasInitiated = false;
        this.lastIsTypingSent = 0;
        this.avayaChatSocket.resetWebSocket();
        this.avayaChatStore.dontRetryConnection = false;
        this.avayaChatStore.isChatTransferRequested = false;
        this.avayaChatStore.customerDetails.isContinuingAfterRefresh = false;
        clearLocalStorage();
    }

    resumeChat() {
        // If there is an active agent, then we don't want to make a call to get agent availability
        if (this.avayaChatStore.users.length > 0) {
            // when false, we will call the agent availability endpoint on page refresh
            this.isCheckAvayaLiveAgentAvailabilityInProgress = false;
        }

        // an indication that the chat wasn't closed
        const guid = getLocalStorage('guid');

        //check if TAS
        if (this.avayaChatConfig.isTeslaAssist) {
            this.avayaChatStore.initCalled = false;

            if (guid) {
                document.querySelector('.tw-chat--avaya-chat-container') ? .remove();
                this.initTeslaAssist(true);
                return;
            }
        } else {
            if (guid) {
                document.querySelector('.tw-chat--avaya-chat-container') ? .remove();
                this.init(true);
                return;
            }
        }

        document.querySelector('.tw-chat--chat-end-message-container') ? .remove();
        this.quitChat();
    }

    /**
     * Sends a chat message to the server. If the message box is empty, nothing
     * is sent.
     *
     * @param text
     */
    sendChatMessage(text, question = null) {
        sendDebugMessage('Running AvayaChat:sendChatMessage');

        // User continues to interact with the chat this hide the End Chat prompt.
        this.avayaChatUserInterface.endChatPrompt.hide();

        const sanitizedInput = DOMPurify.sanitize(text);
        const socketChatMessage = question ? DOMPurify.sanitize(question) : sanitizedInput;

        if (text.length !== 0) {
            // add the timestamp message, then the chat.
            this.writeResponse(sanitizedInput, this.avayaChatConfig.writeResponseClassSent);
            const message = {
                apiVersion: '1.0',
                type: 'request',
                body: {
                    method: 'newMessage',
                    message: socketChatMessage,
                    type: 'text',
                    data: {
                        message: socketChatMessage,
                    },
                    customData: {
                        ...this.avayaChatConfig.customData,
                        locale: this.avayaChatConfig.locale.replace('-', '_'),
                        conversation_id: getLocalStorage('avayaContextID'),
                    },
                },
            };
            this.avayaChatSocket.sendMessage(message);
        }
    }

    /**
     * Lets the agents know that the customer is typing.
     *
     * @param isUserTyping
     */
    sendIsTyping(isUserTyping) {
        sendDebugMessage('Running AvayaChat:sendIsTyping');
        const isTypingMessage = {
            apiVersion: '1.0',
            type: 'request',
            body: {
                method: 'isTyping',
                isTyping: isUserTyping,
            },
        };

        // update lastisTypingSent timestamp
        this.lastIsTypingSent = Date.now();

        this.avayaChatSocket.sendMessage(isTypingMessage);
    }

    /**
     * Start the on hold messages.
     */
    startOnHoldMessages() {
        sendDebugMessage('Running AvayaChat:startOnHoldMessages');
        // eslint-disable-next-line no-console
        console.info('WebChat: Starting the On Hold messages');
        const onHoldUrlsDefined = this.webOnHoldURLs !== null && this.webOnHoldURLs.urls.length > 0;
        const onHoldMessagesDefined =
            this.webOnHoldComfortGroup !== null && this.webOnHoldComfortGroup.messages.length > 0;

        if (!onHoldUrlsDefined && !onHoldMessagesDefined) {
            // eslint-disable-next-line no-console
            console.warn('WebChat: On Hold messages are not defined!');
        }

        if (onHoldMessagesDefined) {
            // sort the webOnHoldComfortGroup according to sequence
            this.webOnHoldComfortGroup.messages = this.webOnHoldComfortGroup.messages.sort(
                (a, b) => a.sequence - b.sequence
            );
            this.webOnHoldComfortGroup.currentSequence = 0;

            this.onHoldComfortInterval = setInterval(() => {
                this.playOnHoldMessage(this.webOnHoldComfortGroup);
            }, this.webOnHoldComfortGroup.delay * 1000);
            this.timeouts.push(this.onHoldComfortInterval);
        }

        if (onHoldUrlsDefined) {
            this.webOnHoldURLs.currentSequence = 0;

            this.onHoldUrlInterval = setInterval(() => {
                this.playOnHoldMessage(this.webOnHoldURLs);
            }, this.webOnHoldURLs.holdTime * 1000);
            this.timeouts.push(this.onHoldUrlInterval);
        }
    }

    /**
     * Start the customer's typing timer.
     */
    startTypingTimer() {
        sendDebugMessage('Running AvayaChat:startTypingTimer');
        const isTypingTimer = Date.now();
        const timerExpiryTime = this.lastIsTypingSent + this.avayaChatConfig.timeBetweenMsgs;

        if (isTypingTimer >= timerExpiryTime) {
            this.sendIsTyping(true);
        }
    }

    /**
     * Stop the on hold messages.
     */
    stopOnHoldMessages() {
        sendDebugMessage('Running AvayaChat:stopOnHoldMessages');
        // eslint-disable-next-line no-console
        console.info('Web On Hold: Stopping messages');
        clearInterval(this.onHoldUrlInterval);
        clearInterval(this.onHoldComfortInterval);
    }

    /**
     * Adds the "Typing" message.
     * @param agent
     * @param isTyping
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    updateTypingCell(agent, isTyping) {
        sendDebugMessage('Running AvayaChat:updateTypingCell');
        if (typeof agent !== 'undefined' && typeof agent.displayName !== 'undefined') {
            if (isTyping) {
                this.avayaTypingIndicator.addIsTypingIndicator(agent.displayName);
            } else {
                this.avayaTypingIndicator.removeIsTypingIndicator(false, agent.displayName);
            }
        }
    }

    /**
     * Update the users.
     *
     * @param agents
     */
    updateUsers(agents) {
        sendDebugMessage('Running AvayaChat:updateUsers');
        this.avayaChatStore.users = {};

        if (agents !== undefined) {
            for (let i = 0; i < agents.length; i++) {
                const agent = agents[i];
                if (
                    this.checkAgentVisibility(agent.id, agent.type) ||
                    agent.type === 'passive_participant'
                ) {
                    // eslint-disable-next-line no-console
                    console.debug(`WebChat: Adding agent with id ${agent.id} and name ${agent.name}`);

                    this.avayaChatStore.users[agent.id] = {
                        displayName: agent.name,
                        isTyping: false,
                        agentType: agent.type,
                    };
                }
            }
        }
    }

    /**
     * Write the chat response.
     *
     * @param text
     * @param className
     * @param date
     * @param user
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    writeResponse(text, className, htmlElement, question = null, hide = false) {
        sendDebugMessage('Running AvayaChat:writeResponse');

        this.avayaChatMessage.appendMessage({
            text,
            className,
            htmlElement,
            question,
            hide
        });

        this.setLastChatRequestTimestamp();
    }

    /**
     * Write the chat response.
     *
     * @param text
     * @param className
     * @param date
     * @param user
     */
    writeContactCardResponse(contactInformation) {
        sendDebugMessage('Running AvayaChat:writeResponse');
        this.avayaChatMessage.appendMessage({
            contactInformation,
            responseType: 'CONTACT_INFORMATION',
        });
        this.setLastChatRequestTimestamp();
    }

    writeAgentJoinTimeResponse() {
        if (!this.avayaChatConfig.estimatedWaitTime) {
            try {
                const chatFormDetails = JSON.parse(getLocalStorage('chatFormDetails'));
                this.avayaChatConfig.estimatedWaitTime = chatFormDetails ? .agentETA;
            } catch (err) {
                Sentry.captureException(err, {
                    tags: {
                        errorMessage: 'Error occurred while calculating agent ETA.',
                    },
                });
            }
        }
        const minutesUnitString =
            this.avayaChatConfig.estimatedWaitTime > 1 ?
            this.avayaChatConfig.initializers.shortMinutes :
            this.avayaChatConfig.initializers.shortMinute;

        const estimatedWaitTimeMsg = this.avayaChatConfig.initializers.transferLiveAgentEWT
            .replace('{0}', this.avayaChatConfig.estimatedWaitTime)
            .replace('{1}', minutesUnitString);

        this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.taChatAgentSessionInteraction);

        this.writeResponse(
            estimatedWaitTimeMsg,
            this.avayaChatConfig.writeResponseClassSystem,
            'div',
            'showSpinner'
        );
    }
    /**
     * Write the chat response, supports CTA chat response type
     *
     * @param text
     * @param title
     * @param cta
     * @param responseType
     * @param className
     * @param htmlElement
     * @param question
     * @param hide
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    writeResponseCTA({
        text,
        className,
        htmlElement = 'div',
        question = null,
        hide = false,
        cta,
        responseType, // either 'TEXT' or 'BLOB' atm
        title,
    }) {
        sendDebugMessage('Running AvayaChat:writeResponseCTA');
        this.avayaChatMessage.appendMessage({
            text,
            className,
            htmlElement,
            question,
            hide,
            cta,
            responseType,
            title,
        });
        this.setLastChatRequestTimestamp();
    }

    /**
     * Write the chat ended. Can be done by both customer or agent.
     */
    writeChatEnded() {
        sendDebugMessage('Running AvayaChat:writeChatEnded');

        this.avayaChatUserInterface.makeEndChatButtonInvisible();
        this.avayaChatUserInterface.isInChatMode = false;
        this.isCheckAvayaLiveAgentAvailabilityInProgress = false;

        const sessionEndedMSG = !this.avayaChatConfig.initializers.chatSessionEnded ?
            this.avayaChatConfig.initializers.agentLeftMessage :
            this.avayaChatConfig.initializers.chatSessionEnded;
        this.avayaChatMessage.writeChatStatusMessage(sessionEndedMSG);
    }

    /**
     * Write the chat transferred response.
     */
    writeChatSessionTransferred() {
        sendDebugMessage('Running AvayaChat:writeChatSessionTransferred');
        this.avayaChatMessage.writeChatBoxResumeMessage(
            this.avayaChatConfig.initializers.chatSessionTransferred,
            this.avayaChatConfig.initializers.resumeChatSession,
            () => this.resumeChat()
        );
        this.avayaChatControl.disableControls(true);

        if (!this.avayaChatConfig.isTeslaAssist) {
            this.avayaChatButton.hideChatButton();
        }

        document.querySelector('#chat-page') ? .remove();
        this.avayaChatConfig.sessionWasTransferred = true;
    }

    writeStartNewChatSessionMessage() {
        this.writeResponse(
            this.avayaChatConfig.initializers.startNewChatSession || 'Start new session',
            this.avayaChatConfig.writeResponseClassResponse,
            'button',
            'startNewChatSession',
            false
        );
        updateShowFooter(false);
    }

    setLastChatRequestTimestamp() {
        this.avayaChatStore.lastChatRequestTimestamp = Date.now();
        setLocalStorage('lastChatRequestTimestamp', this.avayaChatStore.lastChatRequestTimestamp);
    }

    setUseLatestTDS() {
        setLocalStorage('useLatestTDS', true);
    }

    displayFinalError() {
        this.clearAllInactiveTimers();
        this.avayaChatUserInterface.displayFinalError();
    }

    hideFinalError() {
        this.avayaChatUserInterface.hideFinalError();
    }
}

export default AvayaChat;