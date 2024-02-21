import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class AvayaChatControl {
    constructor() {
        this.chatPrefix = 'avaya-chat';
    }

    /**
     * Disable the form controls.
     *
     * @param shouldControlsBeDisabled
     */
    disableControls(shouldControlsBeDisabled) {
        // TODO every function call instances.
        sendDebugMessage('Running AvayaChatUserInterface:disableControls');
        const footerFormElements = document.querySelectorAll(
            `.tw-chat--${this.chatPrefix}__footer-form button`
        );
        Array.from(footerFormElements).forEach((footerFormElement) => {
            footerFormElement.disabled = shouldControlsBeDisabled;
        });
    }
}

export default AvayaChatControl;