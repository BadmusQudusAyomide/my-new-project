import {
    createElementWithAttributes
} from '../../utils/CommonUtils';

class AvayaHeader {
    constructor(avayaChatConfig) {
        this.avayaChatConfig = avayaChatConfig;
    }

    generateHeader() {
        const avayaChatHeaderTextContainer = createElementWithAttributes('div', {
            class: 'tw-chat--avaya-header-container',
            children: [{
                tag: 'span',
                attributes: {
                    class: 'tw-chat--avaya-header-text',
                    textContent: this.avayaChatConfig.initializers.chatHeader,
                },
            }, ],
        });

        return avayaChatHeaderTextContainer;
    }
}

export default AvayaHeader;