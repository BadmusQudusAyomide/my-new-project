import {
    getCountryData
} from '../../utils/LocationUtils';
import AvayaChatFormTextItem from './AvayaChatFormTextItem/AvayaChatFormTextItem';
import AvayaChatFormSelectItem from './AvayaChatFormSelectItem/AvayaChatFormSelectItem';
import AvayaChatFormCheckboxItem from './AvayaChatFormCheckboxItem/AvayaChatFormCheckboxItem';
import {
    isCN
} from '../../utils/LocationUtils';
import {
    sendDebugMessage,
    showElement
} from '../../utils/AvayaChatUtils.js';
import DOMPurify from 'dompurify';
import {
    flag
} from '../../Data/flags';
import FormHelper from '../../helpers/FormHelper.js';

class AvayaChatForm {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper, onChatFormSubmit) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
        this.modalId = 'avaya-chat-modal';
        this.currentPage = window.document.location.pathname.split('/')[1];
        this.pagesUpdatePosition = ['trips'];
        const componentProperties = [avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper];
        this.avayaChatFormTextItem = new AvayaChatFormTextItem(...componentProperties);
        this.avayaChatFormSelectItem = new AvayaChatFormSelectItem(...componentProperties);
        this.avayaChatFormCheckboxItem = new AvayaChatFormCheckboxItem(...componentProperties);
        this.onChatFormSubmit = onChatFormSubmit;
    }

    /**
     * Disable all of the form inputs and buttons
     */
    // eslint-disable-next-line class-methods-use-this
    disableFormButtonAndInputs() {
        const elements = document.querySelectorAll(
            '.tw-chat--avaya-chat__modal-form .tw-chat--avaya-chat__form-button, .tw-chat--avaya-chat__modal-form .tw-chat--tds-form-input'
        );
        elements.forEach((elem) => {
            elem.setAttribute('disabled', '');
        });
    }

    /**
     * Handler for select options for CN
     * Currently, this is only for CN chat form.
     */
    handleSelectOptions(obj = null) {
        if (!isCN()) {
            return;
        }

        // handle selected field
        if (obj && obj.id === 'city') {
            this.selectedCity = obj.value;
        } else if (obj && obj.id === 'province') {
            this.selectedProvince = obj.value;
            this.selectedCity = null;
        }

        // make preparation for the new data
        const divCity = document.querySelector('#city');
        const divProvince = document.querySelector('#province');
        if (!divCity && !divProvince) {
            return;
        }

        const updateSelectOptions = (element, options) => {
            element.innerHTML = null;
            options.forEach((option) => {
                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', option.fieldName);
                if (option.selected) {
                    optionElement.setAttribute('selected', '');
                }
                optionElement.innerHTML = option.fieldLabel;
                element.append(optionElement);
            });
        };
        const filterSelectOptions = (field) => {
            const isCity = field === 'city';
            const defaultFieldName = '';
            const defaultFieldLabel = isCity ? '市（区）' : '省份';
            const defaultSelected = isCity ? !!this.selectedCity : !!this.selectedProvince;
            const currentList = isCity ? this.cityList[this.selectedProvince] || [] : this.provinceList;
            const optionsArr = [];
            for (const currentItem in currentList) {
                const currentObj = {
                    fieldName: isCity ? currentList[currentItem] : currentItem,
                    fieldLabel: currentList[currentItem],
                    selected: isCity ?
                        currentList[currentItem] === this.selectedCity :
                        currentItem === this.selectedProvince,
                };
                optionsArr.push(currentObj);
            }
            // add default item for options
            optionsArr.unshift({
                fieldName: defaultFieldName,
                fieldLabel: defaultFieldLabel,
                selected: defaultSelected,
            });
            return optionsArr;
        };

        updateSelectOptions(divProvince, filterSelectOptions('province'));
        updateSelectOptions(divCity, filterSelectOptions('city'));
    }

    /**
     * Generates the Avaya Chat Logon Form
     *
     * @returns {HTMLDivElement}
     */
    generateAvayaChatForm() {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatForm');
        const {
            isTriagePreChat,
            isChatLite,
            isTeslaAssist
        } = this.avayaChatConfig;

        const avayaChatFormWrapper = document.createElement('div');
        avayaChatFormWrapper.setAttribute('id', 'chat-page');
        avayaChatFormWrapper.classList.add(`tw-chat--full-height-screen`);

        if (isTriagePreChat) {
            avayaChatFormWrapper.style.display = 'none';
        }

        const avayaChatForm = document.createElement('form');

        // disable google ''Please Fill out This Field" suggestions
        avayaChatForm.setAttribute('novalidate', 'novalidate');
        avayaChatForm.classList.add(
            'tw-chat--tds-form-fieldset',
            `tw-chat--${this.chatPrefix}__modal-form`
        );

        if (isTeslaAssist) {
            avayaChatForm.classList.add(`tw-chat--${this.chatPrefix}__modal-tas-form`);
        }

        const {
            formDetails: {
                disablePrefilledInputs,
                chatLiteForm,
                preEngagementForm
            },
            callBackFormConfig,
            preEngagementConfig,
            tasCallBackFormConfig,
            tasPreEngagementConfig,
        } = this.avayaChatConfig;

        const formConfig =
            isTeslaAssist && !window.avaya.is_agent_available ?
            tasCallBackFormConfig :
            isChatLite ?
            callBackFormConfig :
            isTeslaAssist ?
            tasPreEngagementConfig :
            preEngagementConfig;

        const {
            fields = {}, submitLabel, description = null
        } = formConfig;

        // Only CN needs to handle these two fields
        if (isCN()) {
            const isLocationForm =
                fields.filter(function(item) {
                    return ['city', 'province'].includes(item.attributes.name);
                }).length > 0;
            if (isLocationForm) {
                getCountryData().then((response) => {
                    const {
                        provinceList,
                        cityList
                    } = response.data;
                    if (provinceList) {
                        this.provinceList = provinceList;
                    }
                    if (cityList) {
                        this.cityList = cityList;
                    }
                    this.handleSelectOptions();
                });
            }
        }

        const formPrefilledValues = (isChatLite ? chatLiteForm : preEngagementForm) || {};

        if (!this.avayaChatConfig.isTeslaAssist) {
            const avayaChatFormHeaderBlock = document.createElement('div');
            avayaChatFormHeaderBlock.classList.add(`tw-chat--${this.chatPrefix}__topic-header-container`);

            if (!isChatLite) {
                const avayaChatFormPoliteRequest = document.createElement('h6');
                avayaChatFormPoliteRequest.classList.add(`tw-chat--${this.chatPrefix}__topic-header`);
                avayaChatFormPoliteRequest.innerHTML = DOMPurify.sanitize(
                    this.avayaChatConfig.initializers.headerSubtext
                );
                avayaChatFormHeaderBlock.append(avayaChatFormPoliteRequest);
            }

            if (description) {
                const avayaChatFormSubHeader = document.createElement('p');
                avayaChatFormSubHeader.classList.add(`tw-chat--${this.chatPrefix}__topic-sub-heading`);
                avayaChatFormSubHeader.innerHTML = DOMPurify.sanitize(description);
                avayaChatFormHeaderBlock.append(avayaChatFormSubHeader);
            }

            avayaChatFormWrapper.append(avayaChatFormHeaderBlock);
        }
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].type === 'InputItem') {
                let defaultValue =
                    fields[i].attributes.name in formPrefilledValues ?
                    formPrefilledValues[fields[i].attributes.name] :
                    null;

                if (fields[i].attributes.name === 'phone' || fields[i].attributes.name === 'phoneNumber') {
                    defaultValue =
                        typeof formPrefilledValues['phone'] === 'string' ? formPrefilledValues['phone'] : null;
                    if (typeof formPrefilledValues['phone'] === 'string') {
                        defaultValue = formPrefilledValues['phone'];
                    } else if (typeof formPrefilledValues['phone'] === 'object') {
                        defaultValue = formPrefilledValues['phone'].number;
                    } else {
                        defaultValue = '';
                    }
                }

                let fieldLabel = fields[i].label;

                if (
                    this.avayaChatConfig.countryCode === 'QA' &&
                    fields[i].attributes.name === 'postalCode'
                ) {
                    fieldLabel = fields[i].zoneLabel.value;
                }

                avayaChatForm.append(
                    this.avayaChatFormTextItem.generateAvayaChatFormTextItem(
                        fields[i].attributes.name,
                        fieldLabel,
                        fields[i].attributes.required,
                        '',
                        fields[i].attributes.type,
                        defaultValue,
                        disablePrefilledInputs
                    )
                );
            } else if (fields[i].type === 'SelectItem') {
                const optionsArr = [];

                for (let j = 0; j < fields[i].options.length; j++) {
                    if (fields[i].attributes.name === 'getUpdates') {
                        optionsArr.push({
                            fieldName: fields[i].options[j].value,
                            fieldLabel: fields[i].options[j].label,
                            selected: flag.optOutNewsletter ?
                                !fields[i].options[j].selected :
                                fields[i].options[j].selected,
                        });
                    } else {
                        optionsArr.push({
                            fieldName: fields[i].options[j].value,
                            fieldLabel: fields[i].options[j].label,
                            selected: fields[i].options[j].selected,
                        });
                    }
                }

                avayaChatForm.append(
                    this.avayaChatFormSelectItem.generateAvayaChatFormSelectItem(
                        fields[i].attributes.name,
                        fields[i].label,
                        fields[i].attributes.required,
                        optionsArr
                    )
                );
            } else if (fields[i].type === 'CheckboxItem') {
                avayaChatForm.append(
                    this.avayaChatFormCheckboxItem.generateAvayaChatFormCheckboxItem(
                        fields[i].attributes.name,
                        fields[i].label,
                        fields[i].options,
                        fields[i].attributes.required
                    )
                );
            }
        }

        const avayaChatFormButton = document.createElement('button');
        avayaChatFormButton.classList.add(
            'tw-chat--tds-btn',
            'tw-chat--tds-btn--blue',
            `tw-chat--${this.chatPrefix}__form-button`
        );
        avayaChatFormButton.setAttribute('type', 'submit');
        avayaChatFormButton.innerText = submitLabel;
        avayaChatFormButton.addEventListener('click', () => {
            if (isTeslaAssist) {
                this.avayaAnalyticsHelper.fireEvent(
                    this.avayaAnalyticsHelper.taCallbackFormSubmittedInteraction
                );
            }
        });

        avayaChatForm.append(avayaChatFormButton);

        const formHelper = new FormHelper(
            avayaChatForm,
            formConfig,
            this.onChatFormSubmit,
            this.avayaChatConfig
        );

        formHelper.init();

        avayaChatFormWrapper.append(avayaChatForm);

        return avayaChatFormWrapper;
    }

    showChatEngagementForm(logEvent = false, analyticsHelper = null, chatLiveFormId = 'chat-page') {
        if (logEvent) {
            analyticsHelper.fireEvent(analyticsHelper.formShownInteraction);
        }
        showElement(chatLiveFormId);
    }

    hideTasForm() {
        const form = document.getElementsByClassName(`tw-chat--${this.chatPrefix}__modal-tas-form`);
        form.length > 0 && form[0].remove();
    }
}

export default AvayaChatForm;