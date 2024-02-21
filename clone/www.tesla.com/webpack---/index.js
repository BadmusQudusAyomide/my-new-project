import AvayaChatInit from './AvayaChatInit.js';
import qs from 'qs';
import axios from 'axios';
import * as Sentry from '@sentry/browser';
import {
    sendDebugMessage
} from './utils/AvayaChatUtils';

const startChat = () => {
    // do not start chat more than once
    if (window.avaya && window.avaya.is_initialized === true) {
        return;
    }

    const locale = window.avaya_chat_locale ? window.avaya_chat_locale : 'en-us';
    const localeUpdated = window.avaya && window.avaya.locale ? window.avaya.locale : locale;

    // legacy flag: for backward compatibility (CUA-2364-enable-chat-lite)
    // defaulting chatlite to false as we have more locales without it than with it at the moment.
    const chatLiteFlag = window.show_avaya_chat_lite ? window.show_avaya_chat_lite : false;

    // new flag: should take priority over legacy flag (cua-2871-show-avaya-chat-consolidated)
    const chatLiteFlagUpdated =
        window.avaya && typeof window.avaya.chat_lite !== 'undefined' ?
        window.avaya.chat_lite :
        chatLiteFlag;

    const triagePreChat = window.show_avaya_triage ? window.show_avaya_triage : false;
    const triagePreChatUpdated =
        window.avaya && typeof window.avaya.triage !== 'undefined' ?
        window.avaya.triage :
        triagePreChat;

    const hideOnMobiles = window.hide_avaya_on_mobile ? !window.hide_avaya_on_mobile : false;
    const hideOnMobilesUpdated =
        window.avaya && typeof window.avaya.mobile !== 'undefined' ?
        !window.avaya.mobile :
        hideOnMobiles;

    // option to pass attributes for pages that use static assets integration
    const requestAttributes =
        window.avaya && typeof window.avaya.attributes !== 'undefined' ? window.avaya.attributes : {};

    const url = '/conversation/get-chat-init-configs';
    axios.post(url, qs.stringify({
        locale: localeUpdated
    })).then((response) => {
        let {
            // Dayana to do: put back when ready to test DWP-14175 again in stage
            isChatLite,
            triage,
            isMobile,
            teslaAssistFlag,
            useEngagementPlaceholderData,
            useRefactoredFlag,
        } = response ? .data ? .LDChatConfigurations;

        let {
            sentry_dsn = null, sentry_env = 'production', sentry_releaseID = null
        } =
        response ? .data ? .sentry || {};

        // Initialize Sentry if the dsn value is passed in, otherwise skip initialization to prevent unneeded logging errors.
        if (sentry_dsn && sentry_releaseID) {
            Sentry.init({
                dsn: sentry_dsn,
                maxBreadcrumbs: 50,
                environment: sentry_env,
                integrations: [
                    new Sentry.Integrations.Breadcrumbs({
                        console: false
                    }),
                    new Sentry.BrowserTracing(),
                ],
                release: sentry_releaseID,
                beforeSend: (event) => {
                    sendDebugMessage('Sentry caught exception!', {
                        event
                    });
                    return event;
                },
            });

            Sentry.configureScope((scope) => {
                scope.setTag('locale', localeUpdated);
            });
        }

        if (isChatLite !== chatLiteFlagUpdated) {
            var mistmatchMessageChatlite = `Chatlite configuration mismatch for locale ${localeUpdated} and path ${window.location.pathname}`;
            console.log(mistmatchMessageChatlite);
            Sentry.captureMessage(mistmatchMessageChatlite);
        }

        if (triagePreChatUpdated !== triage) {
            var mistmatchMessageTriage = `Triage configuration mismatch for locale ${localeUpdated} and path ${window.location.pathname}`;
            console.log(mistmatchMessageTriage);
            Sentry.captureMessage(mistmatchMessageTriage);
        }

        if (teslaAssistFlag) {
            AvayaChatInit({
                locale: localeUpdated,
                chatLiteFlag: isChatLite,
                triagePreChat: triage,
                hideOnMobiles: !isMobile,
                teslaAssistFlag: teslaAssistFlag,
                transferToLiveAgent: false,
                useEngagementPlaceholderDataFlag: useEngagementPlaceholderData, // passed in the check availability call
                ...requestAttributes,
            });
        } else {
            AvayaChatInit({
                locale: localeUpdated,
                chatLiteFlag: isChatLite,
                triagePreChat: triage,
                hideOnMobiles: useRefactoredFlag ? !isMobile : hideOnMobilesUpdated,
                teslaAssistFlag: window.avaya ? .tesla_assist || false,
                useEngagementPlaceholderDataFlag: useEngagementPlaceholderData, //passed in the check availability call
                transferToLiveAgent: false,
                ...requestAttributes,
            });
        }
    });
    window.avaya.is_initialized = true;
};

// expose init_chat and is_initialized to init chat asynchronously
if (!window.avaya) {
    window.avaya = {};
}
window.avaya.init_chat = startChat;
window.avaya.is_initialized = false;

document.addEventListener('DOMContentLoaded', startChat);