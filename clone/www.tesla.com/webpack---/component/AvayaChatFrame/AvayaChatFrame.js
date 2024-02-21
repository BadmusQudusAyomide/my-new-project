import {
    sendDebugMessage,
    setAttributes
} from '../../utils/AvayaChatUtils.js';
import {
    chatPrefix
} from '../../Data/constants';
import {
    removeSuggestionBubbles
} from '../../utils/MutationUtils.js';

class AvayaChatFrame {
    constructor(
        avayaChatConfig,
        userInterfaceEvents,
        avayaAnalyticsHelper,
        onChatFooterSubmit,
        onTyping
    ) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.onTyping = onTyping;
        this.onChatFooterSubmit = onChatFooterSubmit;
    }

    /**
     * Generates the Avaya Chat Frame
     *
     * @returns {HTMLDivElement}
     */
    generateAvayaChatFrame() {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatFrame');
        const {
            InputPlaceHolder
        } = this.avayaChatConfig.initializers;
        const avayaChatFrameWrapper = document.createElement('div');
        const avayaChatFrame = document.createElement('div');
        avayaChatFrame.classList.add(`tw-chat--${chatPrefix}__frame`, 'tw-chat--full-height-screen');

        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // scroll to the last message in chat frame when open or close keyboard on android,
        // because android doesn't do that automatically and covers last few messages with keyboard
        if (/android/i.test(userAgent)) {
            new ResizeObserver(() => {
                avayaChatFrame.scrollTo({
                    top: avayaChatFrame.scrollHeight,
                });
            }).observe(avayaChatFrame);
        }

        const avayaChatFooter = document.createElement('footer');
        avayaChatFooter.classList.add(`tw-chat--${chatPrefix}__footer`);

        const avayaChatFooterForm = document.createElement('form');
        avayaChatFooterForm.classList.add(`tw-chat--${chatPrefix}__footer-form`);

        const footerFormItem = document.createElement('div');
        footerFormItem.classList.add(
            'tw-chat--tds-form-item',
            'tw-chat--tds-form-item--text',
            'tw-chat--avaya-chat__form-item'
        );

        const footerTextInputWrapper = document.createElement('div');
        // tds-form-input tds-form-input--default
        footerTextInputWrapper.classList.add(
            'tw-chat--tds-form-input',
            'tw-chat--tds-form-input--default',
            'tw-chat--tds-form-input-textarea-extendable-wrapper'
        );

        setAttributes(footerTextInputWrapper, {
            id: 'expandable-textarea-wrapper',
        });

        footerTextInputWrapper.setAttribute(
            'aria-label',
            this.avayaChatConfig.initializers.ariaLabelMessageArea
        );

        const footerTextInput = document.createElement('textarea');
        footerTextInput.classList.add('tw-chat--tds-form-input-textarea-extendable');
        footerTextInput.classList.add('tw-chat--tds-form-input-text');
        const charLimit = 500;

        setAttributes(footerTextInput, {
            id: 'expandable-textarea',
            placeholder: InputPlaceHolder,
            maxlength: charLimit,
        });

        const adjustHeight = (event) => {
            let el = event.target;
            const maxHeight = 320;

            if (!el) {
                return;
            }

            // Reset height to its default height
            // to get accurate scrollHeight
            el.style.height = '40px'; // initial height.
            // Adjust height to scrollHeight
            if (el.scrollHeight > el.clientHeight) {
                el.style.height = el.scrollHeight + 'px';
            }

            const footer = document.getElementsByClassName('tw-chat--avaya-chat__footer')[0];
            footer.style.height = el.scrollHeight + 48 + 'px';
            const avayaChatFrame = document.getElementsByClassName('tw-chat--avaya-chat__frame')[0];
            avayaChatFrame.style.marginBottom = el.scrollHeight + 48 + 'px';

            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight + maxHeight,
            });
        };

        footerTextInput.addEventListener('input', (event) => {
            if (footerTextInput.value.length > charLimit) {
                footerTextInput.value = footerTextInput.value.substring(0, charLimit); // truncate the value.
            }

            adjustHeight(event);
        });

        footerTextInput.addEventListener('focus', adjustHeight);
        footerTextInput.addEventListener('keyup', (e) => {
            if (!e.shiftKey && (e.key === 'Enter' || e ? .keyCode === 13)) {
                removeSuggestionBubbles();
            }
        });

        const avayaChatIconSendSvgOutline = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        setAttributes(avayaChatIconSendSvgOutline, {
            width: '19',
            height: '19',
            viewBox: '0 0 19 19',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            id: 'send-icon-outline',
        });

        const avayaChatIconSendPathOutline = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        setAttributes(avayaChatIconSendPathOutline, {
            d: 'M18.78 10.53a.747.747 0 0 1-1.06 0l-4.974-4.97.004 14.69a.75.75 0 0 1-1.5 0l-.004-14.69-4.966 4.96a.75.75 0 1 1-1.06-1.06l6.246-6.241a.75.75 0 0 1 1.06 0l6.254 6.25a.75.75 0 0 1 0 1.06z',
            fill: '#F4F4F4',
        });

        avayaChatIconSendSvgOutline.append(avayaChatIconSendPathOutline);

        const footerButton = document.createElement('button');
        footerButton.classList.add(
            `tw-chat--${chatPrefix}__footer-button`,
            'tw-chat--tds-text_color--30',
            'tw-chat--tds-text--30'
        );
        footerButton.setAttribute('type', 'button');
        footerButton.setAttribute('aria-label', this.avayaChatConfig.initializers.ariaLabelSendButton);

        footerButton.append(avayaChatIconSendSvgOutline);
        footerButton.addEventListener('click', removeSuggestionBubbles);

        footerTextInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                footerButton.click();
            } else {
                this.onTyping();
            }
        });

        footerButton.addEventListener('click', () => {
            const text = footerTextInput.value;
            footerTextInput.value = '';
            this.onChatFooterSubmit(text);
            footerTextInput.style.height = '40px';
            const avayaChatFrame = document.getElementsByClassName('tw-chat--avaya-chat__frame')[0];
            avayaChatFrame.style.marginBottom = '';
            const avayaChatFooter = document.getElementsByClassName('tw-chat--avaya-chat__footer')[0];
            avayaChatFooter.style.height = '';
        });

        // Updates the message send button to be tds-blue when there is content
        // in the text input and the input is NOT disabled
        footerTextInput.addEventListener('keydown', (e) => {
            if (e.target.value && !footerButton.disabled) {
                footerButton.classList.add('tw-chat--message-button-send-enabled');
            } else {
                footerButton.classList.remove('tw-chat--message-button-send-enabled');
            }
        });

        footerTextInputWrapper.append(footerTextInput);
        footerTextInputWrapper.append(footerButton);

        footerFormItem.append(footerTextInputWrapper);

        avayaChatFooterForm.append(footerFormItem);

        avayaChatFooter.append(avayaChatFooterForm);

        avayaChatFrameWrapper.append(avayaChatFrame);
        avayaChatFrameWrapper.append(avayaChatFooter);

        return avayaChatFrameWrapper;
    }
}

export default AvayaChatFrame;