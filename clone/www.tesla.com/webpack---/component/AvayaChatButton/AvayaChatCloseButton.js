import {
    setAttributes
} from '../../utils/AvayaChatUtils.js';

class AvayaChatCloseButton {
    constructor(avayaChatConfig) {
        this.avayaChatConfig = avayaChatConfig;
    }

    generateCloseButton(clickCallback = () => {}, hide = false) {
        const avayaChatCloseButton = document.createElement('button');
        avayaChatCloseButton.classList.add('tw-chat--end-chat');
        setAttributes(avayaChatCloseButton, {
            'aria-label': this.avayaChatConfig ? .initializers ? .endChat || 'X',
            id: 'chat-form__end-chat-button',
        });

        const avayaChatCloseButtonSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        avayaChatCloseButtonSvg.classList.add('tw-chat--tds-icon');
        setAttributes(avayaChatCloseButtonSvg, {
            fill: 'none',
            viewBox: '0 0 24 24',
            xmlns: 'http://www.w3.org/2000/svg',
        });

        const avayaChatCloseButtonSvgPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        setAttributes(avayaChatCloseButtonSvgPath, {
            d: 'M18.53 17.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.748.748 0 0 1-1.06 0 .75.75 0 0 1 0-1.06L10.94 12 5.47 6.53a.75.75 0 1 1 1.06-1.06L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47z',
            fill: 'currentColor',
        });
        avayaChatCloseButtonSvg.append(avayaChatCloseButtonSvgPath);
        avayaChatCloseButton.append(avayaChatCloseButtonSvg);

        avayaChatCloseButton.addEventListener('click', () => {
            clickCallback();
        });

        if (hide) {
            avayaChatCloseButton.style.display = 'none';
        }

        return avayaChatCloseButton;
    }
}

export default AvayaChatCloseButton;