import {
    sendDebugMessage,
    setAttributes,
    hideElement,
    showElement,
} from '../../utils/AvayaChatUtils.js';
import {
    addGIOEvent,
    GIO_EVENTS,
    GIO_EVENT_TYPES
} from '../../utils/gio';

class AvayaChatBubble {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper, onTeslaAssistOpen) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
        this.modalId = 'avaya-chat-modal';
        this.currentPage = window.document.location.pathname.split('/')[1];
        this.pagesUpdatePosition = ['trips'];
        this.onTeslaAssistOpen = onTeslaAssistOpen;
        this.chatButtonBadgeId = 'avaya-chat-button-badge';
    }

    /**
     * Handler for click eveent
     */
    handleBubbleClick() {
        const {
            isTeslaAssist
        } = this.avayaChatConfig;
        hideElement('tw-chat--avaya-chat__button');
        this.hideChatBubbleBadge();

        this.avayaAnalyticsHelper.fireEvent(
            isTeslaAssist ?
            this.avayaAnalyticsHelper.taFormInitializedInteraction :
            this.avayaAnalyticsHelper.formInitiatedInteraction
        );

        const contentEmbeddedChatCTA = document.querySelector('#chatPageContentCTA');

        // submit form and start chat immediately if autoInitiate is true and isChatLite,
        // isWindowMinimized are false when press chat bubble
        if (
            contentEmbeddedChatCTA ||
            (this.avayaChatConfig.autoInitiate &&
                !this.avayaChatConfig.isChatLite &&
                !this.avayaChatConfig.isTriagePreChat &&
                !this.avayaChatConfig.isWindowMinimized)
        ) {
            const submitButton = document.querySelector(`.tw-chat--avaya-chat__form-button`);
            submitButton.click();
        }

        this.avayaChatConfig.isWindowMinimized = false;
    }

    /**
     * Generates the Avaya Chat Button
     *
     * @returns {HTMLButtonElement}
     */
    generateAvayaChatButton() {
        const {
            isTeslaAssist
        } = this.avayaChatConfig;
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatButton');
        const avayaChatButton = document.createElement('button');
        avayaChatButton.setAttribute('type', 'button');
        avayaChatButton.setAttribute('data-tds-open-modal', this.modalId);
        avayaChatButton.setAttribute(
            'aria-label',
            this.avayaChatConfig.initializers.ariaLabelChatButton
        );

        avayaChatButton.classList.add(`tw-chat--${this.chatPrefix}__button`);
        avayaChatButton.classList.add(`tw-chat--${this.chatPrefix}__permanent_cta_style`);
        avayaChatButton.setAttribute('id', `tw-chat--${this.chatPrefix}__permanent_cta_style`);

        // Backward compatibility. Configurator is targeting that class for their override.
        avayaChatButton.classList.add(`tw-chat--${this.chatPrefix}__animated_button`);
        avayaChatButton.setAttribute('id', `tw-chat--${this.chatPrefix}__animated_button`);

        // Detect if button needs additional positioning
        if (this.currentPage && this.pagesUpdatePosition.includes(this.currentPage)) {
            avayaChatButton.classList.add(`tw-chat--position__${this.currentPage}`);
        }

        if (this.avayaChatConfig.isChatLite === false && !this.avayaChatConfig.isTeslaAssist) {
            avayaChatButton.style.display = 'none';
        }

        this.avayaAnalyticsHelper.fireEvent(
            isTeslaAssist ?
            this.avayaAnalyticsHelper.taImpressionInteraction :
            this.avayaAnalyticsHelper.impressionInteraction
        );

        avayaChatButton.addEventListener('click', () => {
            if (this.avayaChatConfig.isTeslaAssist) {
                this.onTeslaAssistOpen(); //TODO: Handle reconnection to TAS and transferred session to live agent
            }

            this.handleBubbleClick();
            addGIOEvent(this.avayaChatConfig.locale, GIO_EVENTS.TRACK, GIO_EVENT_TYPES.CHAT_CLICK, {
                web_chat_button_name: this.avayaChatConfig.initializers ? .ariaLabelChatButton,
            });
        });

        const avayaChatSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        setAttributes(avayaChatSvg, {
            xmlns: 'http://www.w3.org/2000/svg',
        });
        avayaChatSvg.classList.add(`tw-chat--tds-icon`);
        avayaChatSvg.classList.add(`tw-chat--avaya-chat__bubble_icon`);

        const avayaChatSvgPathOne = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        avayaChatSvgPathOne.setAttribute(
            'd',
            'M19.5 4h-15A2.5 2.5 0 0 0 2 6.5v9A2.5 2.5 0 0 0 4.5 18H7v2.07a.928.928 0 0 0 1.507.725l3.22-2.576A1 1 0 0 1 12.35 18h7.15a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 19.5 4zm1 11.5a1 1 0 0 1-1 1h-7.15a2.5 2.5 0 0 0-1.56.548L8.5 18.879V17a.5.5 0 0 0-.5-.5H4.5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h15c.551 0 1 .449 1 1v9zM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z'
        );

        const avayaChatButtonBadge = document.createElement('div');
        avayaChatButtonBadge.setAttribute('id', this.chatButtonBadgeId);
        avayaChatButtonBadge.classList.add('tw-chat--avaya-chat__bubble_badge');

        avayaChatSvg.append(avayaChatSvgPathOne);
        avayaChatButton.append(avayaChatSvg);
        avayaChatButton.append(avayaChatButtonBadge);

        return avayaChatButton;
    }

    showChatBubbleBadge() {
        showElement(this.chatButtonBadgeId);
    }

    hideChatBubbleBadge() {
        hideElement(this.chatButtonBadgeId);
    }
}

export default AvayaChatBubble;