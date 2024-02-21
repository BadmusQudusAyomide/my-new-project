import {
    validateEmail
} from '@tesla/validation';
import {
    getCountryCode
} from '@tesla/intl-phone';
import {
    validatePostalCode
} from '@tesla/intl-address';
import DOMPurify from 'dompurify';
import {
    addGIOEvent,
    GIO_EVENTS,
    GIO_EVENT_TYPES
} from '../utils/gio';
import {
    getPatterns,
    getFormats
} from '@tesla/intl-phone';

class FormHelper {
    constructor(form, formConfig, onSubmit, avayaChatConfig) {
        this.form = form;
        this.fields = Array.from(
            this.form.querySelectorAll(
                ".tw-chat--tds-form-input-text:not([type='checkbox']), .tw-chat--tds-fieldset"
            )
        );
        this.onSubmit = onSubmit;
        this.avayaChatConfig = avayaChatConfig;
        this.valid = false;
        this.activatedFields = {};
        this.timeout = null;

        // eslint-disable-next-line no-restricted-syntax
        for (const field of formConfig.fields) {
            this.activatedFields[field.attributes.name] = false;
        }

        this.validateForm();
    }

    init() {
        this.validateOnEntry();
        this.validateOnSubmit(this.avayaChatConfig.isChatLite);
    }

    /**
     * Checks if the form ready to be submitted
     */
    validateForm() {
        const {
            countryCode
        } = this.avayaChatConfig;
        let formValid = true;

        // this.avayaChatConfig.useEngagementPlaceholderData: https://issues.teslamotors.com/browse/DWP-11888.
        this.fields.forEach((field) => {
            // validate fieldset
            if (field.tagName === 'FIELDSET' && !this.avayaChatConfig.useEngagementPlaceholderData) {
                if (field.hasAttribute('required') && this.fieldsetIsEmpty(field)) {
                    formValid = false;
                }

                return;
            }

            // Check presence of values
            if (
                field.hasAttribute('required') &&
                field.value.trim() === '' &&
                !this.avayaChatConfig.useEngagementPlaceholderData
            ) {
                formValid = false;
            }

            if (field.value.trim() !== '') {
                if (field.name === 'email' && !validateEmail(field.value)) {
                    formValid = false;
                }

                // Check for a valid phone number
                // Package that's used for phone validation throws warnings in case phone number is shorter than 4 characters
                if (field.name === 'phoneNumber' || field.name === 'phone') {
                    if (
                        (field.value.length >= 4 &&
                            !this.validatePhone(field.value, countryCode, {
                                format: 'national'
                            })) ||
                        field.value.length < 4
                    ) {
                        formValid = false;
                    }
                }

                // Check for a valid postal dode
                if (
                    (field.name === 'postalCode' || field.name === 'zip') &&
                    !validatePostalCode(field.value, {
                        countryCode
                    })
                ) {
                    formValid = false;
                }

                // Check for a valid first and last name
                if (
                    (field.name === 'firstName' || field.name === 'lastName') &&
                    !this.validateName(field.value)
                ) {
                    formValid = false;
                }
            }
        });

        this.valid = formValid;
        this.changeSubmitButtonStatus();
    }

    /**
     * Validates a field and manages errors
     *
     * @param field
     */
    // eslint-disable-next-line class-methods-use-this
    validateField(field) {
        const {
            countryCode,
            initializers: {
                formErrorMessageIsRequired,
                formErrorMessageMaxLength,
                formErrorMessageInvalid,
            },
        } = this.avayaChatConfig;

        // validate fieldset
        if (field.tagName === 'FIELDSET') {
            const label = DOMPurify.sanitize(field.firstElementChild.innerHTML);

            if (!this.fieldsetIsEmpty(field)) {
                this.activatedFields[field.name] = true;
            }

            if (field.hasAttribute('required') && this.fieldsetIsEmpty(field)) {
                const errorMessage = formErrorMessageIsRequired.replace('{0}', label);
                this.changeErrorStyles(false, field, errorMessage, true);
            } else {
                this.changeErrorStyles(true, field, '', true);
            }

            return;
        }

        const label = DOMPurify.sanitize(
            field.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild
            .innerHTML
        );

        // Don't check validity of the field if it's empty
        if (field.value.trim() !== '') {
            this.activatedFields[field.name] = true;

            // Check for a valid email address
            if (field.name === 'email') {
                const errorMessage = formErrorMessageInvalid.replace('{0}', label);
                this.changeErrorStyles(validateEmail(field.value), field, errorMessage);
            }

            // Check for a valid phone number
            // Package that's used for phone validation throws warnings in case phone number is shorter than 4 characters
            if (field.name === 'phoneNumber' || field.name === 'phone') {
                const errorMessage = formErrorMessageInvalid.replace('{0}', label);
                const fieldIsValid =
                    field.value.length >= 4 ?
                    this.validatePhone(field.value, countryCode, {
                        format: 'national'
                    }) :
                    false;
                this.changeErrorStyles(fieldIsValid, field, errorMessage);
            }

            // Check for a valid postal dode
            if (field.name === 'postalCode' || field.name === 'zip') {
                const errorMessage = formErrorMessageInvalid.replace('{0}', label);
                this.changeErrorStyles(
                    validatePostalCode(field.value, {
                        countryCode
                    }),
                    field,
                    errorMessage
                );
            }

            // Check for a valid first and last name
            if (field.name === 'firstName' || field.name === 'lastName') {
                const errorMessage = formErrorMessageMaxLength.replace('{0}', label).replace('{1}', '50');
                this.changeErrorStyles(this.validateName(field.value), field, errorMessage);
            }

            // Check for a valid province and city
            if (field.name === 'province' || field.name === 'city') {
                const errorMessage = formErrorMessageInvalid.replace('{0}', label);
                const fieldIsValid = field.value.length > 0;
                this.changeErrorStyles(fieldIsValid, field, errorMessage);
            }
        } else {
            // Check presence of values
            // eslint-disable-next-line no-lonely-if
            if (field.hasAttribute('required')) {
                const errorMessage = formErrorMessageIsRequired.replace('{0}', label);
                this.changeErrorStyles(field.value.trim() !== '', field, errorMessage);
            } else {
                // if optional fields was emptied, remove the error
                this.changeErrorStyles(true, field);
            }
        }
    }

    /**
     * Adds or removes classes to display error based on field validity, changes error message
     *
     * @param isValid
     * @param field
     * @param errorMessage
     */
    // eslint-disable-next-line class-methods-use-this
    changeErrorStyles(isValid, field, errorMessage = '', isFieldset = false) {
        let grandParent;
        let feedbackWrap;

        if (isFieldset) {
            grandParent = field;
            feedbackWrap = field.lastElementChild.lastElementChild;
        } else {
            grandParent = field.parentElement.parentElement;
            feedbackWrap =
                field.parentElement.parentElement.lastElementChild.lastElementChild.lastElementChild;
        }

        if (!isValid && this.activatedFields[field.name]) {
            grandParent.classList.add('tw-chat--tds-form--error', 'tw-chat--avaya-chat__form-item-error');
            feedbackWrap.innerHTML = DOMPurify.sanitize(errorMessage.toLowerCase());
        } else {
            grandParent.classList.remove(
                'tw-chat--tds-form--error',
                'tw-chat--avaya-chat__form-item-error'
            );
            feedbackWrap.innerHTML = DOMPurify.sanitize('');
        }
    }

    /**
     * Validates on field entry.
     */
    validateOnEntry() {
        const self = this;
        this.fields.forEach((field) => {
            // Checks if the form is valid and submit button should be enabled
            field.addEventListener('input', () => {
                window.clearTimeout(this.timeout);
                self.validateForm();
                // if user has not entered anything in 2 second, check and display errors on last input
                this.timeout = setTimeout(() => self.validateField(field), 2000);
            });

            // Checks changed field and manages error display,
            if (field.tagName === 'FIELDSET') {
                // fieldset blur event doesn't work the way it works on regular inputs, so we're using click instead
                field.addEventListener('click', () => {
                    self.validateField(field);
                });
            } else {
                field.addEventListener('blur', () => {
                    self.validateField(field);
                });
            }

            if (field.tagName === 'SELECT') {
                // we're using change event for select field
                field.addEventListener('change', () => {
                    self.validateField(field);
                });
            }
        });
    }

    /**
     * Validates on form submit.
     */
    validateOnSubmit(isChatLite) {
        const self = this;

        const {
            locale
        } = this.avayaChatConfig;
        const localeArr = locale.split('-');
        const countryCode = localeArr[1].toUpperCase();

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            self.validateForm();

            if (this.valid) {
                const formData = new FormData(self.form);
                let data = {};

                if (!isChatLite) {
                    const entries = formData.entries();
                    data = Object.fromEntries(entries);
                } else {
                    data = [];
                    let chatLiteInterests = this.avayaChatConfig.callBackFormConfig.fields.find(
                        (item) => item.attributes.name === 'productInterested'
                    ).options;

                    chatLiteInterests = chatLiteInterests.map((interest) => interest.value);

                    // eslint-disable-next-line no-restricted-syntax
                    for (const pair of formData.entries()) {
                        if (chatLiteInterests.includes(pair[0])) {
                            const interestsIdx = data.findIndex((item) => item.name === 'productInterested');
                            if (interestsIdx !== -1) {
                                data[interestsIdx].value.push(pair[0]);
                            } else {
                                data.push({
                                    name: 'productInterested',
                                    value: [pair[0]]
                                });
                            }
                        } else {
                            // data.push({ name: pair[0], value: pair[1] });
                            let updatedValue = pair[1];
                            if (pair[0] === 'phone') {
                                updatedValue = {
                                    country: countryCode,
                                    code: getCountryCode(countryCode),
                                    number: pair[1],
                                };
                            }
                            data.push({
                                name: pair[0],
                                value: updatedValue
                            });
                        }
                    }
                }

                const label = isChatLite ?
                    this.avayaChatConfig.callBackFormConfig ? .submitLabel :
                    this.avayaChatConfig.preEngagementConfig ? .submitLabel;
                addGIOEvent(
                    this.avayaChatConfig.locale,
                    GIO_EVENTS.TRACK,
                    GIO_EVENT_TYPES.CHAT_START_CLICK, {
                        web_chat_button_name: label,
                    }
                );
                this.onSubmit(data);
            } else {
                // if form isn't valid, check all field for errors
                this.fields.forEach((field) => {
                    this.validateField(field);
                });
            }
        });
    }

    /**
     * Disabled or enabled form submit button based on the form validation
     */
    changeSubmitButtonStatus() {
        const submitBtn = this.form.querySelector('button[type="submit"]');

        if (this.valid) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    /**
     * Validates first and last name (they should not exceed 50 characters)
     *
     * @param name
     */
    // eslint-disable-next-line class-methods-use-this
    validateName(name) {
        return name.length <= this.avayaChatConfig.namesMaxCharCount;
    }

    /**
     * Check if fieldset have any inputs selected
     *
     * @param field
     */
    // eslint-disable-next-line class-methods-use-this
    fieldsetIsEmpty(field) {
        return field.querySelectorAll("input[type='checkbox']:checked").length === 0;
    }

    validatePhone(value, country, options = {}) {
        if (value) {
            if (!getPatterns(country)) {
                return false;
            }

            // Get the pattern based on country code
            // Brackets are required for `^` to be applied to
            // all or-ed (`|`) parts, not just the first one.
            const pattern = `^(${getPatterns(country).national})$`;

            const parsedPhone = this.parsePhone(value, country, options);

            // We have value and it does not match the pattern
            if (parsedPhone != null && !new RegExp(pattern).test(parsedPhone)) {
                return false;
            }
        }
        return true;
    }

    parsePhone(value, country, options = {}) {
        let v = value != null && value !== '' ? String(value).replace(/\D/g, '') : undefined;

        const formatData = getFormats(country);

        // Example1: nddPrefix = 0  returns 0678 ---> 678
        // Example2: nddPrefix = 06 returns 0678 ---> 78
        if (typeof formatData.nddPrefix !== 'undefined') {
            if (
                options.format === 'national' &&
                v &&
                v.slice(0, formatData.nddPrefix.length) == formatData.nddPrefix
            ) {
                v = v.slice(formatData.nddPrefix.length, v.length);
            }
        }

        return v;
    }
}

export default FormHelper;