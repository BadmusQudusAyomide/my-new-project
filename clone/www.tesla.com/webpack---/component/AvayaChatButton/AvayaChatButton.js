import DOMPurify from 'dompurify';
import {
    localizeUrl
} from '@tesla/parse-locale';
import {
    flag
} from '../../Data/flags';
import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class AvayaChatButton {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
    }

    // eslint-disable-next-line class-methods-use-this
    createButtonElements(containerName, elements) {
        const {
            locale
        } = this.avayaChatConfig;
        const {
            isEnergyPage
        } = this.avayaChatConfig;
        const divContainer = document.createElement('div');
        divContainer.setAttribute('id', `div-${containerName}`);
        divContainer.classList.add('tw-chat--tds-btn_group', 'tw-chat--tds-btn_group--vertical');

        let domElement = null;
        Object.entries(elements).forEach(([key, value]) => {
            if (key === 'account-support') {
                domElement = document.createElement('a');
                domElement.classList.add(
                    'tw-chat--tds-btn',
                    'tw-chat--avaya-topic-btn',
                    'tw-chat--avaya-topic--event'
                );
                domElement.setAttribute('id', `btn-${key}`);
                const localizedSupportURL = localizeUrl('/contactus', {
                    locale,
                    delimiter: '_'
                });
                domElement.setAttribute('href', localizedSupportURL);
                domElement.innerHTML = DOMPurify.sanitize(value);
            } else if (key === 'vehicle-upcoming-delivery' && !flag.showDeliveryOnTriage) {
                return;
            } else if (key === 'schedule-test-drive') {
                if (isEnergyPage === true) {
                    return;
                }
                domElement = document.createElement('a');
                domElement.classList.add(
                    'tw-chat--tds-btn',
                    'tw-chat--avaya-topic-btn',
                    'tw-chat--avaya-topic--event'
                );
                domElement.setAttribute('id', `btn-${key}`);
                const localizedDriveURL = localizeUrl('/drive', {
                    locale,
                    delimiter: '_'
                });
                domElement.setAttribute('href', localizedDriveURL);

                if (
                    this.avayaChatConfig.triageConfig.teslaProducts &&
                    this.avayaChatConfig.triageConfig.teslaProducts['schedule-test-drive']
                ) {
                    domElement.innerHTML = DOMPurify.sanitize(
                        flag.demoDriveCopy &&
                        this.avayaChatConfig.triageConfig.teslaProducts['schedule-test-drive'].demoDrive ?
                        this.avayaChatConfig.triageConfig.teslaProducts['schedule-test-drive'].demoDrive
                        .label || '' :
                        this.avayaChatConfig.triageConfig.teslaProducts['schedule-test-drive'].label || ''
                    );
                }
            } else {
                domElement = document.createElement('button');
                domElement.classList.add(
                    'tw-chat--tds-btn',
                    'tw-chat--avaya-topic-btn',
                    'tw-chat--avaya-topic--event'
                );

                domElement.setAttribute('id', `btn-${key}`);
                domElement.setAttribute('data-target', `div-${key}-sub-topic`);
                domElement.innerHTML = DOMPurify.sanitize(value);
            }

            divContainer.append(domElement);
        });

        return divContainer;
    }

    /**
     * Hides the Avaya Chat Button
     *
     * @returns {HTMLDivElement}
     */
    hideChatButton() {
        // TODO update function call instance
        sendDebugMessage('Running AvayaChatUserInterface:hideChatButton');
        const avayaChatButton = document.querySelector(
            `.tw-chat--${this.chatPrefix}__permanent_cta_style`
        );
        if (avayaChatButton) {
            avayaChatButton.style.display = 'none';
        }
    }

    /**
     * Checks if the Chat Button is visible.
     *
     * @returns {boolean}
     */
    isChatButtonVisible() {
        sendDebugMessage('Running AvayaChatUserInterface:isChatButtonVisible');
        let chatButtonIsVisible = false;
        const avayaChatButton = document.querySelector(`.tw-chat--${this.chatPrefix}__button`);
        if (
            avayaChatButton &&
            avayaChatButton.style &&
            avayaChatButton.style.display !== 'none' &&
            !avayaChatButton.classList.contains('tw-chat--avaya-chat__button-is-loading')
        ) {
            chatButtonIsVisible = true;
        }
        return chatButtonIsVisible;
    }

    /**
     * Shows the chat button.
     */
    showChatButton() {
        // TODO update function call instance
        sendDebugMessage('Running AvayaChatUserInterface:showChatButton');

        if (!this.avayaChatConfig.capturedChatImpression) {
            this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.impressionInteraction);
            this.avayaChatConfig.capturedChatImpression = true;
        }

        const avayaChatButton = document.querySelector(
            `.tw-chat--${this.chatPrefix}__permanent_cta_style`
        );

        if (avayaChatButton) {
            avayaChatButton.classList.remove('tw-chat--avaya-chat__button-is-loading');
            avayaChatButton.style.display = '';
        }
    }

    /**
     * Switch chat button to loading.
     */
    switchChatButtonToLoading() {
        // TODO update function call instance
        sendDebugMessage('Running AvayaChatUserInterface:switchChatButtonToLoading');
        const avayaChatButton = document.querySelector(
            `.tw-chat--${this.chatPrefix}__permanent_cta_style`
        );
        if (avayaChatButton) {
            avayaChatButton.classList.add('tw-chat--avaya-chat__button-is-loading');
        }
    }
}

export default AvayaChatButton;