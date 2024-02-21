import axios from 'axios';
import qs from 'qs';
import {
    getLocalStorage,
    sendDebugMessage
} from '../utils/AvayaChatUtils.js';
import * as Sentry from '@sentry/browser';

class UpdateContextHelper {
    constructor(avayaChatConfig) {
        this.avayaChatConfig = avayaChatConfig;
    }

    updateContext = async (chatEndReason) => {
        var chatEndReasonIsValid = Object.keys(ChatEndReasonsEnum).some((key) => {
            return chatEndReason === ChatEndReasonsEnum[key];
        });
        if (!chatEndReasonIsValid) {
            Sentry.captureException(new Error('Invalid End chat reason passed: ' + chatEndReason));
            return;
        }
        const {
            locale,
            apiEndpointsDomain,
            isTeslaAssist
        } = this.avayaChatConfig;
        const contextID = getLocalStorage('avayaContextID');
        const localeArr = locale.split('-');
        const countryCode = localeArr[1].toUpperCase();

        const updateContextData = {
            locale: [localeArr[0], countryCode].join('-'),
            contextID,
            isTAS: isTeslaAssist,
            contextData: [],
        };

        if (chatEndReason) {
            updateContextData['contextData']['tas-chat-end-reason'] = chatEndReason;
        }

        const updateContextPayload = qs.stringify(updateContextData);
        const updateContextUrl = `${
      apiEndpointsDomain ? apiEndpointsDomain : ''
    }/conversation/update-context`;

        try {
            await axios.post(updateContextUrl, updateContextPayload);
        } catch (err) {
            sendDebugMessage('Failed to call /conversation/update-context => ', err);
            Sentry.captureException(err, {
                tags: {
                    errorMessage: 'Error occurred while updating context',
                },
            });
        }
    };
}

export var ChatEndReasonsEnum = {
    INACTIVITY: 'inactivity',
    X_CLICKED_CONFIRMED_YES: 'X-button-yes',
    END_CHAT_BUBBLE_CLICKED: 'end_chat_bubble',
};

export default UpdateContextHelper;