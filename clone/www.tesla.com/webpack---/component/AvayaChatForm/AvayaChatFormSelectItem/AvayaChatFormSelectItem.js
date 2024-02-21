import AvayaChatFormItem from '../AvayaChatFormItem/AvayaChatFormItem.js';
import DOMPurify from 'dompurify';
import {
    sendDebugMessage
} from '../../../utils/AvayaChatUtils.js';

class avayaChatFormSelectItem {
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
     * Generates the Avaya Chat Select Item
     *
     * @param fieldName
     * @param fieldLabel
     * @param required
     * @param options
     * @returns {HTMLDivElement}
     */
    generateAvayaChatFormSelectItem(fieldName, fieldLabel, required, options) {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatFormSelectItem');
        const avayaChatFormSelectItem = this.avayaChatFormItem.generateAvayaChatFormItem(
            fieldName,
            fieldLabel,
            required,
            'select'
        );

        const tdsSelectInput = avayaChatFormSelectItem.querySelector(`#${fieldName}`);

        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', option.fieldName);
            if (option.selected) {
                optionElement.setAttribute('selected', '');
            }
            optionElement.innerHTML = DOMPurify.sanitize(option.fieldLabel);
            tdsSelectInput.append(optionElement);
        });

        return avayaChatFormSelectItem;
    }
}

export default avayaChatFormSelectItem;