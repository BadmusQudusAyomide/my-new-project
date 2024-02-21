import axios from 'axios';
import qs from 'qs';
import AvayaChat from './AvayaChat.js';
import * as Sentry from '@sentry/browser';
import {
    getLocalStorage
} from './utils/AvayaChatUtils';

const AvayaChatInit = (requestData, optionalData = {}) => {
    requestData.locale = requestData.locale.replace(/[_-]/, '-').toLowerCase();

    // get chat optional params from window or chat initiation
    let optionalParams = {};
    if (window.avaya && window.avaya.options) {
        optionalParams = window.avaya.options;
    } else if (window.avaya_chat_options) {
        optionalParams = window.avaya_chat_options;
    } else {
        optionalParams = optionalData;
    }

    const url = `${
    optionalParams.apiEndpointsDomain ? optionalParams.apiEndpointsDomain : ''
  }/conversation/check-availability-v2`;

    window.avaya.is_agent_available = false;

    const checkAvayaChatAvailability = (avayaChat) => {
        axios
            .post(url, qs.stringify(requestData))
            .then((response) => {
                let {
                    error = false,
                        success,
                        avayaPrerequisite,
                        chatWidgetParams,
                        forceHideChatBubble = false,
                        useEngagementPlaceholderDataUpdated = false,
                        teslaAssistEnabled = false,
                } = response.data;

                if (forceHideChatBubble === true) {
                    return;
                }

                chatWidgetParams = { ...chatWidgetParams,
                    ...optionalParams
                };

                if (teslaAssistEnabled) {
                    const avayaChat = new AvayaChat({
                        ...chatWidgetParams,
                        isTriagePreChat: false, // Tesla assist hasn't been designed to work with triage.
                        isTeslaAssist: teslaAssistEnabled,
                        useEngagementPlaceholderData: false,
                        locale: requestData.locale,
                    });
                    avayaChat.initTeslaAssist();
                } else if (success === true) {
                    window.avaya.is_agent_available = true;

                    const avayaChat = new AvayaChat({
                        ...chatWidgetParams,
                        isTriagePreChat: requestData.triagePreChat,
                        useEngagementPlaceholderData: useEngagementPlaceholderDataUpdated,
                        locale: requestData.locale,
                    });
                    avayaChat.init();
                    avayaChat.parseServiceMap(
                        avayaPrerequisite.serviceMetricsResponseMap[avayaChat.estimatedWaitTimeMapId]
                    );
                } else if (requestData.chatLiteFlag === true) {
                    window.avaya.is_agent_available = false;

                    const avayaChat = new AvayaChat({
                        ...chatWidgetParams,
                        isTriagePreChat: requestData.triagePreChat,
                        isChatLite: true,
                        locale: requestData.locale,
                    });
                    avayaChat.init();
                } else if (error === true) {
                    window.avaya.is_agent_available = false;
                } else {
                    window.avaya.is_agent_available = false;
                }
            })
            .catch((e) => {
                Sentry.captureException(e);
                // TODO: https://issues.teslamotors.com/browse/DWP-12804.
                if (requestData.teslaAssistFlag) {
                    avayaChat.displayFinalError();
                    this.avayaChatButton.hideChatButton();
                }
            });
    };

    // don't show chat and call endpoints if hideOnMobiles is true and device width is smaller than 600px
    if (!(requestData.hideOnMobiles && window.screen.width <= 599)) {
        let avayaChat;
        try {
            const localStorageIsTAS = getLocalStorage('isTAS');

            const isTeslaAssist =
                typeof localStorageIsTAS === 'boolean' || typeof localStorageIsTAS === 'string' ?
                getLocalStorage('isTAS') === 'true' :
                requestData.teslaAssistFlag;

            avayaChat = new AvayaChat({
                isTriagePreChat: isTeslaAssist ? false : requestData.triagePreChat,
                isTeslaAssist,
                locale: requestData.locale,
            });

            const sessionExist = avayaChat.checkForValidSessionInLocalStorage();
            // check if session exist, show chat without calling endpoint if it exist
            if (sessionExist) {
                if (isTeslaAssist) {
                    avayaChat.initTeslaAssist(true);
                } else {
                    avayaChat.init(true);
                }
            } else {
                checkAvayaChatAvailability(avayaChat);
            }
        } catch (err) {
            Sentry.captureException(err);

            if (requestData.teslaAssistFlag) {
                avayaChat ? .displayFinalError();
            }
        }
    }
};

export default AvayaChatInit;