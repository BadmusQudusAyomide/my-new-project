import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class AvayaChatModal {
    constructor() {
        this.chatPrefix = 'avaya-chat';
        this.modalId = 'avaya-chat-modal';
    }

    generateChatWindow() {
        const avayaChatDialog = document.createElement('dialog');
        avayaChatDialog.classList.add(
            'tw-chat--tds-modal',
            'tw-chat--tds-scrim--white',
            `tw-chat--${this.chatPrefix}__modal`
        );
        avayaChatDialog.id = this.modalId;

        const avayaChatDialogHeader = document.createElement('header');
        avayaChatDialogHeader.classList.add(
            'tw-chat--tds-modal-header',
            `tw-chat--${this.chatPrefix}__modal-header`
        );

        const avayaChatButtonContainer = document.createElement('div');
        avayaChatButtonContainer.style.width = '30px';

        return {
            avayaChatButtonContainer,
            avayaChatDialog,
            avayaChatDialogHeader
        };
    }

    /**
     * Checks if the modal is open.
     *
     * @returns {boolean}
     */
    isModalOpen() {
        sendDebugMessage('Running AvayaChatUserInterface:isModalOpen');
        let modalIsOpen = false;
        const modal = document.querySelector(`.tw-chat--${this.chatPrefix}__modal`);
        if (modal && modal.hasAttribute('open')) {
            modalIsOpen = true;
        }
        return modalIsOpen;
    }
}

export default AvayaChatModal;