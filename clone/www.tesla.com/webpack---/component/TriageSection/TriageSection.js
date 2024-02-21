import DOMPurify from 'dompurify';
import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';
import AvayaChatButton from '../AvayaChatButton/AvayaChatButton.js';

class TriageSection {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper) {
        this.chatPrefix = 'avaya-chat'; //TODO move constant.
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        const componentProperties = [avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper];
        this.avayaChatButton = new AvayaChatButton(...componentProperties);
    }
    /**
     * Generates the Avaya Chat Logon Form
     *
     * @returns {HTMLDivElement}
     */
    getAvayaChatTopics(id, header, buttons, subHeader = '') {
        sendDebugMessage('Running AvayaChatUserInterface:getAvayaChatTopics');
        const avayaChatTopicsWrapper = document.createElement('div');
        avayaChatTopicsWrapper.classList.add(`tw-chat--small-height-screen`);
        avayaChatTopicsWrapper.setAttribute('id', id);

        const avayaChatScreenHeaderBlock = document.createElement('div');
        avayaChatScreenHeaderBlock.classList.add(`tw-chat--${this.chatPrefix}__topic-header-container`);

        const avayaChatHeading = document.createElement('h6');
        avayaChatHeading.classList.add(`tw-chat--${this.chatPrefix}__topic-header`);
        avayaChatHeading.setAttribute('id', 'chat-topics-heading');
        avayaChatHeading.innerHTML = DOMPurify.sanitize(header);
        avayaChatScreenHeaderBlock.append(avayaChatHeading);

        if (subHeader !== '') {
            const avayaChatSubHeading = document.createElement('p');
            avayaChatSubHeading.classList.add(`tw-chat--${this.chatPrefix}__topic-sub-heading`);
            avayaChatSubHeading.setAttribute('id', 'chat-topics-subheading');
            avayaChatSubHeading.innerHTML = DOMPurify.sanitize(subHeader);
            avayaChatScreenHeaderBlock.append(avayaChatSubHeading);
        }

        avayaChatTopicsWrapper.append(avayaChatScreenHeaderBlock);

        // Create buttons for screen
        const avayaChatTopics = this.avayaChatButton.createButtonElements(
            'tesla-chat-topic',
            buttons,
            false
        );

        avayaChatTopicsWrapper.append(avayaChatTopics);

        avayaChatTopicsWrapper.style.display = 'none';

        return avayaChatTopicsWrapper;
    }
}

export default TriageSection;