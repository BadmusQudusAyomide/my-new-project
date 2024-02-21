import {
    setAttributes,
    sendDebugMessage
} from '../../../utils/AvayaChatUtils.js';
import {
    localizeUrl
} from '@tesla/parse-locale';
import {
    isCN
} from '../../../utils/LocationUtils';

class AvayaChatFormItem {
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
     * Generates the Avaya Chat Form Item
     *
     * @param fieldName
     * @param fieldLabel
     * @param required
     * @param errorMessage
     * @param type
     * @returns {HTMLDivElement}
     */
    generateAvayaChatFormItem(
        fieldName,
        fieldLabel,
        required,
        type = 'text',
        defaultValue = null,
        disableField = false
    ) {
        const {
            locale
        } = this.avayaChatConfig;

        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatFormItem');
        // let formItemType = type;

        // if (type === 'email') {
        //   formItemType = 'text';
        // }
        const avayaChatFormItem = document.createElement('div');
        avayaChatFormItem.classList.add(
            'tw-chat--tds-form-item',
            // `tw-chat--tds-form-item--${formItemType}`,
            `tw-chat--${this.chatPrefix}__form-item`
        );

        if (this.avayaChatConfig.countryCode === 'CN') {
            if (!this.avayaChatConfig.isChatLite && type === 'email' && disableField) {
                avayaChatFormItem.classList.add('tds--is_hidden');
            }
            if (this.avayaChatConfig.isChatLite && fieldName === 'zip') {
                avayaChatFormItem.classList.add('tds--is_hidden');
            }
        }

        const avayaChatFormItemLabelWrap = document.createElement('div');
        avayaChatFormItemLabelWrap.classList.add('tw-chat--tds-form-label');

        // we need to use different parentheses for some of the APAC countries
        const parentheses = ['TW', 'HK', 'MO', 'CN'].includes(this.avayaChatConfig.countryCode) ?
            ['（', '）'] :
            [' (', ') '];

        const labelForField = required ?
            fieldLabel :
            `${fieldLabel}${parentheses[0]}${this.avayaChatConfig.initializers.optionalField}${parentheses[1]}`;

        const fieldLabelAsNode = document.createTextNode(labelForField);

        const isNA = ['US', 'CA', 'MX', 'PR'].includes(this.avayaChatConfig.countryCode);

        if (isNA && fieldName === 'getUpdates') {
            const avayaChatFormItemLabel = document.createElement('a');
            avayaChatFormItemLabel.setAttribute('target', '_blank');
            avayaChatFormItemLabel.setAttribute('rel', 'noreferrer noopener');
            avayaChatFormItemLabel.classList.add('tw-chat--tds-link');
            avayaChatFormItemLabelWrap.append(avayaChatFormItemLabel);
            avayaChatFormItemLabel.append(fieldLabelAsNode);
            avayaChatFormItemLabel.href = localizeUrl('/legal/tesla-updates', {
                locale,
                delimiter: '_'
            });
        } else {
            const avayaChatFormItemLabel = document.createElement('label');
            avayaChatFormItemLabel.setAttribute('for', fieldName);
            avayaChatFormItemLabel.classList.add('tw-chat--tds-form-label-text');
            avayaChatFormItemLabelWrap.append(avayaChatFormItemLabel);

            const avayaChatFormItemLabelText = document.createElement('span');

            avayaChatFormItemLabelText.classList.add(
                'tw-chat--tds-form-label-text',
                'tw-chat--tds-text--600'
            );

            avayaChatFormItemLabelText.append(fieldLabelAsNode);
            avayaChatFormItemLabel.append(avayaChatFormItemLabelText);
        }

        if (type === 'text' || type === 'email') {
            const tdsTextInputWrapper = document.createElement('div');
            tdsTextInputWrapper.classList.add(
                'tw-chat--tds-form-input',
                'tw-chat--tds-form-input--default'
            );

            const tdsTextInput = document.createElement('input');
            tdsTextInput.classList.add('tw-chat--tds-form-input-text');

            const tdsTextInputAttributes = {
                id: fieldName,
                name: fieldName,
                type,
            };

            if (required) {
                tdsTextInputAttributes.required = '';
            }

            if (defaultValue != null) {
                tdsTextInputAttributes.value = defaultValue;

                if (disableField) {
                    tdsTextInputAttributes.readonly = '';
                }
            }

            setAttributes(tdsTextInput, tdsTextInputAttributes);
            tdsTextInputWrapper.append(tdsTextInput);

            avayaChatFormItem.append(avayaChatFormItemLabelWrap);
            avayaChatFormItem.append(tdsTextInputWrapper);

            const tdsFormFeedbackWrap = document.createElement('div');
            tdsFormFeedbackWrap.classList.add('tw-chat--tds-form-feedback-wrap');
            let tdsFormItemFeedback = document.createElement('div');
            tdsFormItemFeedback.classList.add(
                'tw-chat--tds-form-feedback',
                `tw-chat--${this.chatPrefix}__form-item-feedback`
            );

            const formFeedback = document.createElement('div');
            formFeedback.classList.add('tw-chat--tds-form-feedback-text');
            tdsFormItemFeedback.appendChild(formFeedback);

            tdsFormFeedbackWrap.append(tdsFormItemFeedback);
            avayaChatFormItem.append(tdsFormFeedbackWrap);
        }

        if (type === 'select') {
            const tdsSelect = document.createElement('div');
            tdsSelect.classList.add('tw-chat--tds-form-input', 'tw-chat--tds-form-input--default');

            const tdsSelectInput = document.createElement('select');
            tdsSelectInput.classList.add('tw-chat--tds-form-input-select');

            const tdsSelectInputAttributes = {
                id: fieldName,
                name: fieldName,
            };

            if (isCN() && required) {
                tdsSelectInputAttributes.required = '';
            }

            setAttributes(tdsSelectInput, tdsSelectInputAttributes);

            const tdsFormInputTrailing = document.createElement('div');
            tdsFormInputTrailing.classList.add('tw-chat--tds-form-input-trailing');

            const tdsSelectArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            tdsSelectArrow.classList.add(
                'tw-chat--tds-icon',
                'tw-chat--tds-icon--inline',
                'tw-chat--tds-icon-arrow'
            );
            setAttributes(tdsSelectArrow, {
                viewBox: '0 0 30 30',
                xmlns: 'http://www.w3.org/2000/svg',
            });

            const tdsSelectArrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            setAttributes(tdsSelectArrowPath, {
                stroke: 'var(--tds-icon--fill, #171a20)',
                'stroke-width': '1.5',
                d: 'M10.5 17.5l4.5-4 4.5 4',
                fill: 'none',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                transform: 'rotate(180 15 15)',
            });

            tdsSelectArrow.append(tdsSelectArrowPath);

            tdsFormInputTrailing.append(tdsSelectArrow);

            if (isCN()) {
                tdsSelectInput.addEventListener('change', (e) => this.handleSelectOptions(e.target));
            }

            tdsSelect.append(tdsSelectInput);
            tdsSelect.append(tdsFormInputTrailing);

            avayaChatFormItem.append(avayaChatFormItemLabelWrap);
            avayaChatFormItem.append(tdsSelect);

            if (isCN()) {
                const tdsFormFeedbackWrap = document.createElement('div');
                tdsFormFeedbackWrap.classList.add('tw-chat--tds-form-feedback-wrap');
                const tdsFormItemFeedback = document.createElement('div');
                tdsFormItemFeedback.classList.add(
                    'tw-chat--tds-form-feedback-feedback',
                    `tw-chat--${this.chatPrefix}__form-item-feedback`
                );
                tdsFormFeedbackWrap.append(tdsFormItemFeedback);
                avayaChatFormItem.append(tdsFormFeedbackWrap);
            }
        }

        return avayaChatFormItem;
    }
}

export default AvayaChatFormItem;