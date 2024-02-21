import DOMPurify from 'dompurify';
import {
    sendDebugMessage
} from '../../../utils/AvayaChatUtils.js';

class AvayaChatFormCheckboxItem {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
        this.modalId = 'avaya-chat-modal';
        this.currentPage = window.document.location.pathname.split('/')[1];
        this.pagesUpdatePosition = ['trips'];
    }

    /**
     * Generates the Avaya Chat Checkbox Group Item
     *
     * @param label
     * @param options
     * @returns {HTMLDivElement}
     */
    generateAvayaChatFormCheckboxItem(name, label, options, required) {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatFormCheckboxItem');

        const fieldSet = document.createElement('fieldset');
        fieldSet.classList.add('tw-chat--tds-form-item');
        fieldSet.setAttribute('name', name);
        if (required) {
            fieldSet.setAttribute('required', '');
        }

        const legendElement = document.createElement('legend');
        legendElement.classList.add('tw-chat--tds-form-label');
        legendElement.innerHTML = DOMPurify.sanitize(label);

        fieldSet.appendChild(legendElement);

        const inputGroup = document.createElement('div');
        inputGroup.classList.add('tw-chat--tds-form-input-group');

        options.forEach((option) => {
            const {
                isChatLite,
                attributes
            } = this.avayaChatConfig;

            // For Sales flow - only include Powerwall as a product interest on chat lite if
            // we are in the US.
            // https://issues.teslamotors.com/browse/DWP-12530
            if (
                isChatLite &&
                option.value === 'Powerwall' &&
                attributes &&
                (attributes.includes('LOB.Sales-stg') || attributes.includes('LOB.Sales')) &&
                this.avayaChatConfig.countryCode !== 'US'
            ) {
                return;
            }

            const formWrapper = document.createElement('div');
            formWrapper.classList.add('tw-chat--tds-form-input');

            const checkboxInput = document.createElement('input');
            checkboxInput.setAttribute('type', 'checkbox');
            checkboxInput.setAttribute('id', option.value.split(' ').join(''));
            checkboxInput.setAttribute('name', option.value);
            checkboxInput.classList.add('tw-chat--tds-form-input-choice');

            formWrapper.appendChild(checkboxInput);

            const labelOuterWrapper = document.createElement('div');
            labelOuterWrapper.classList.add('tds-form-input-choice-label');

            const labelWrapper = document.createElement('div');
            labelWrapper.classList.add('tw-chat--tds-form-label');

            const checkboxLabel = document.createElement('label');
            checkboxLabel.classList.add('tw-chat--tds-form-label-text');
            checkboxLabel.setAttribute('for', option.label.split(' ').join(''));
            checkboxLabel.innerHTML = DOMPurify.sanitize(option.label);

            labelWrapper.appendChild(checkboxLabel);
            labelOuterWrapper.appendChild(labelWrapper);
            formWrapper.appendChild(labelOuterWrapper);
            inputGroup.appendChild(formWrapper);
        });

        fieldSet.appendChild(inputGroup);

        const checkboxFeedbackWrap = document.createElement('div');
        checkboxFeedbackWrap.classList.add('tw-chat--tds-form-feedback-wrap');

        const checkboxFeedback = document.createElement('div');
        checkboxFeedback.classList.add('tw-chat--tds-form-feedback');

        checkboxFeedbackWrap.appendChild(checkboxFeedback);
        fieldSet.appendChild(checkboxFeedbackWrap);

        return fieldSet;
    }
}

export default AvayaChatFormCheckboxItem;