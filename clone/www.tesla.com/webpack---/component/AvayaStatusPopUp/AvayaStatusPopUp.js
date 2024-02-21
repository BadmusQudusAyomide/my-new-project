import {
    hideElement,
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class AvayaStatusPopUp {
    constructor(avayaChatConfig) {
        this.avayaChatConfig = avayaChatConfig;
        this.chatPrefix = 'avaya-chat';
        this.statusMessageTimeout = null;
    }

    /**
     * Generates the Avaya chat status pop up
     *
     * @returns {HTMLElement}
     */
    generateStatusPopUp() {
        const {
            statusCardSuccessHeader,
            statusCardSuccessText,
            statusCardErrorHeader,
            statusCardErrorText,
        } = this.avayaChatConfig.initializers;

        sendDebugMessage('Running AvayaChatUserInterface:generateChatLitePopUp');
        const avayaCanvasTray = document.createElement('div');
        avayaCanvasTray.classList.add('tw-chat--tds-card', `tw-chat--${this.chatPrefix}__status-card`);

        avayaCanvasTray.style.position = 'relative';
        avayaCanvasTray.style.minHeight = 108;
        avayaCanvasTray.style.left = 0;
        avayaCanvasTray.style.bottom = 0;
        avayaCanvasTray.style.display = 'none';

        const avayaCanvasTrayBodySuccess = document.createElement('div');
        avayaCanvasTrayBodySuccess.classList.add(
            'tw-chat--tds-card-body',
            'tw-chat--tds-card-body-success',
            `tw-chat--${this.chatPrefix}__thank-you-body`
        );
        avayaCanvasTrayBodySuccess.style.display = 'none';

        const avayaCanvasTrayHeaderSuccess = document.createElement('h6');
        avayaCanvasTrayHeaderSuccess.classList.add(`tw-chat--${this.chatPrefix}__status-popup-header`);
        avayaCanvasTrayHeaderSuccess.innerText = statusCardSuccessHeader;

        const avayaCanvasTrayParagraphSuccess = document.createElement('p');
        avayaCanvasTrayParagraphSuccess.classList.add(`tw-chat--${this.chatPrefix}__status-popup-text`);
        avayaCanvasTrayParagraphSuccess.innerText = statusCardSuccessText;

        avayaCanvasTrayBodySuccess.append(avayaCanvasTrayHeaderSuccess);
        avayaCanvasTrayBodySuccess.append(avayaCanvasTrayParagraphSuccess);

        const avayaCanvasTrayBodyError = document.createElement('div');
        avayaCanvasTrayBodyError.classList.add(
            'tw-chat--tds-card-body',
            'tw-chat--tds-card-body-error'
        );
        avayaCanvasTrayBodyError.style.display = 'none';

        const avayaCanvasTrayHeaderError = document.createElement('h6');
        avayaCanvasTrayHeaderError.classList.add(`tw-chat--${this.chatPrefix}__status-popup-header`);
        avayaCanvasTrayHeaderError.innerText = statusCardErrorHeader;

        const avayaCanvasTrayParagraphError = document.createElement('p');
        avayaCanvasTrayParagraphError.classList.add(`tw-chat--${this.chatPrefix}__status-popup-text`);
        avayaCanvasTrayParagraphError.innerText = statusCardErrorText;

        avayaCanvasTrayBodyError.append(avayaCanvasTrayHeaderError);
        avayaCanvasTrayBodyError.append(avayaCanvasTrayParagraphError);

        avayaCanvasTray.append(avayaCanvasTrayBodySuccess);
        avayaCanvasTray.append(avayaCanvasTrayBodyError);

        return avayaCanvasTray;
    }

    /**
     * Hide status pop up.
     */
    hideStatusPopUp() {
        const chatLitePopUp = document.querySelector(`.tw-chat--${this.chatPrefix}__status-card`);
        if (chatLitePopUp) {
            chatLitePopUp.style.display = 'none';
        }

        // adjust padding of the frame to make messages that are behind the popup visible, scroll to the last message
        const modalForm = document.querySelector(`.tw-chat--${this.chatPrefix}__modal-content`);

        if (modalForm) {
            modalForm.style.paddingBottom = '24px';
            modalForm.scrollTo({
                top: modalForm.scrollHeight,
            });
        }
    }

    /**
     * Shows the chat status pop up with different content based on the success parameter.
     */
    showStatusPopUp(success = true, hideMessage = false) {
        sendDebugMessage('Running AvayaChatUserInterface:showStatusPopUp');
        window.clearTimeout(this.statusMessageTimeout);

        const chatLitePopUpSuccessMessage = document.querySelector(`.tw-chat--tds-card-body-success`);
        const chatLitePopUpErrorMessage = document.querySelector(`.tw-chat--tds-card-body-error`);

        if (chatLitePopUpSuccessMessage && chatLitePopUpErrorMessage) {
            if (success) {
                chatLitePopUpErrorMessage.style.display = 'none';
                chatLitePopUpSuccessMessage.style.display = '';
            } else {
                chatLitePopUpSuccessMessage.style.display = 'none';
                chatLitePopUpErrorMessage.style.display = '';
            }
        } else {
            // in case messages couldn't be found don't show empty pop up
            return;
        }

        const chatLitePopUp = document.querySelector(`.tw-chat--${this.chatPrefix}__status-card`);

        if (chatLitePopUp) {
            chatLitePopUp.style.display = '';
        }

        // adjust padding of the frame to make messages that are behind the popup visible, scroll to the last message
        const modalForm = document.querySelector(`.tw-chat--${this.chatPrefix}__modal-content`);

        if (modalForm) {
            modalForm.style.marginBottom = `${chatLitePopUp.offsetHeight}px`;
            modalForm.scrollTo({
                top: modalForm.scrollHeight,
            });
        }

        if (hideMessage) {
            this.statusMessageTimeout = setTimeout(() => {
                this.hideStatusPopUp();
            }, this.avayaChatConfig.statusCardShowTime);
        } else {
            hideElement('avaya-chat__back-button');
        }
    }
}

export default AvayaStatusPopUp;