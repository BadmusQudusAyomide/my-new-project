import {
    chatPrefix
} from '../../Data/constants';
import {
    modal
} from '../../tds/tds.js';
const {
    closeModal
} = modal;
import {
    setAttributes
} from '../../utils/AvayaChatUtils.js';

class AvayaChatMinimizeButton {
    constructor(avayaChatConfig, callback = () => {}) {
        this.avayaChatConfig = avayaChatConfig;
        this.callback = callback;
    }

    generateMinimizeButton(avayaChatDialog, hide = false, avayaAnalyticsHelper) {
        const avayaChatMinimizeButton = document.createElement('button');
        avayaChatMinimizeButton.classList.add(`tw-chat--${chatPrefix}__minimize-button`);
        setAttributes(avayaChatMinimizeButton, {
            'aria-label': this.avayaChatConfig.initializers.ariaLabelMinimizeModal,
            id: 'chat-form__minimize-button',
        });

        const avayaChatMinimizeButtonSvg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );
        avayaChatMinimizeButtonSvg.classList.add('tw-chat--tds-icon');
        setAttributes(avayaChatMinimizeButtonSvg, {
            fill: 'none',
            viewBox: '0 0 30 30',
            xmlns: 'http://www.w3.org/2000/svg',
        });

        const avayaChatMinimizeButtonSvgPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        setAttributes(avayaChatMinimizeButtonSvgPath, {
            d: 'm22.34119,15.21793c0,0.41406 -0.4703,0.75 -1.05,0.75l-11.9,0c-0.57969,0 -1.05,-0.33594 -1.05,-0.75c0,-0.41406 0.47031,-0.75 1.05,-0.75l11.9,0c0.5797,0 1.05,0.33594 1.05,0.75z',
            fill: '#171A20',
        });
        avayaChatMinimizeButtonSvg.append(avayaChatMinimizeButtonSvgPath);
        avayaChatMinimizeButton.append(avayaChatMinimizeButtonSvg);

        avayaChatMinimizeButton.addEventListener('click', () => {
            this.avayaChatConfig.isWindowMinimized = true;

            if (this.avayaChatConfig.isTeslaAssist) {
                avayaAnalyticsHelper.fireEvent(avayaAnalyticsHelper.taMinimizeChatInteraction);
            }

            closeModal(avayaChatDialog, {
                onCloseFinish: () => {
                    this.callback();
                },
            });
        });

        if (hide) {
            avayaChatMinimizeButton.style.display = 'none';
        }

        return avayaChatMinimizeButton;
    }
}

export default AvayaChatMinimizeButton;