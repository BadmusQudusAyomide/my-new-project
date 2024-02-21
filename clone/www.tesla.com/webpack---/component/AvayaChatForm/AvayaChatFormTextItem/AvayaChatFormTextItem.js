import AvayaChatFormItem from '../AvayaChatFormItem/AvayaChatFormItem.js';
import {
    sendDebugMessage
} from '../../../utils/AvayaChatUtils.js';

class AvayaChatFormTextItem {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
        this.modalId = 'avaya-chat-modal';
        this.currentPage = window.document.location.pathname.split('/')[1];
        this.pagesUpdatePosition = ['trips'];
        this.avayaChatFormItem = new AvayaChatFormItem(
            avayaChatConfig,
            userInterfaceEvents,
            avayaAnalyticsHelper
        );
    }

    /**
     * Generates the Avaya Chat Text Item
     *
     * @param fieldName
     * @param fieldLabel
     * @param required
     * @param placeholder
     * @param errorMessage
     * @param type
     * @returns {HTMLDivElement}
     */
    generateAvayaChatFormTextItem(
        fieldName,
        fieldLabel,
        required,
        placeholder,
        type = 'text',
        defaultValue = '',
        disableField = false
    ) {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatFormTextItem');
        const avayaChatFormTextItem = this.avayaChatFormItem.generateAvayaChatFormItem(
            fieldName,
            fieldLabel,
            required,
            type,
            defaultValue,
            disableField
        );

        const tdsTextInput = avayaChatFormTextItem.querySelector(`#${fieldName}`);
        tdsTextInput.setAttribute('placeholder', placeholder);

        if (required) {
            tdsTextInput.setAttribute('required', '');
        }

        return avayaChatFormTextItem;
    }
}

export default AvayaChatFormTextItem;