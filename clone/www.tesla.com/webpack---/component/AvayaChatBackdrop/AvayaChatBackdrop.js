import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class AvayaChatBackdrop {
    /**
     * Generates the Avaya Chat Backdrop
     *
     * @returns {HTMLDivElement}
     */
    // eslint-disable-next-line class-methods-use-this
    generateAvayaChatBackdrop() {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatBackdrop');
        const avayaChatBackdrop = document.createElement('div');
        avayaChatBackdrop.classList.add('tw-chat--tds-modal-backdrop');
        return avayaChatBackdrop;
    }
}

export default AvayaChatBackdrop;