import {
    hideElement,
    showElement
} from '../../utils/AvayaChatUtils';

class EndChatPrompt {
    constructor(avayaChatConfig, avayaAnalyticsHelper) {
        this.containerId = 'avaya-end-chat-prompt-container-overlay';
        this.avayaChatConfig = avayaChatConfig;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.confirmedExitCallback = () => {};
        this.declinedExitCallback = () => {};
    }

    generate() {
        const chatEndMessageContainer = document.createElement('div');
        chatEndMessageContainer.classList.add('tw-chat--chat-end-message-container');
        chatEndMessageContainer.setAttribute('id', 'chat-end-question-message');

        const chatEndMessageContent = document.createElement('div');
        chatEndMessageContent.classList.add('tw-chat--chat-end-message-content');

        const chatEndMessageMainText = document.createElement('p');
        chatEndMessageMainText.classList.add('tw-chat--chat-end-message-main');
        chatEndMessageMainText.innerText = this.avayaChatConfig ? .initializers ? .endChatScreenMessage;

        const chatEndMessageButtons = document.createElement('div');
        chatEndMessageButtons.classList.add('tw-chat--chat-end-message-buttons');

        const closeScreenAnswerNo = document.createElement('button');
        closeScreenAnswerNo.classList.add(
            'tw-chat--tds-btn',
            'tw-chat--tds-btn--tertiary',
            'tw-chat--close-screen-btn'
        );
        closeScreenAnswerNo.innerText = this.avayaChatConfig ? .initializers ? .endChatScreenContinue;

        closeScreenAnswerNo.addEventListener('click', () => {
            this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.endChatPromptNoInteraction);
            this.declinedExitCallback();
            this.hide();
        });

        const closeScreenAnswerYes = document.createElement('button');
        closeScreenAnswerYes.classList.add(
            'tw-chat--tds-btn',
            'tw-chat--tds-btn--tertiary',
            'tw-chat--close-screen-btn'
        );
        closeScreenAnswerYes.innerText = this.avayaChatConfig ? .initializers ? .endChatScreenEnd;

        closeScreenAnswerYes.addEventListener('click', () => {
            this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.endChatPromptYesInteraction);
            this.confirmedExitCallback();
            this.hide();
        });

        chatEndMessageButtons.append(closeScreenAnswerYes);
        chatEndMessageButtons.append(closeScreenAnswerNo);

        chatEndMessageContent.append(chatEndMessageMainText);
        chatEndMessageContent.append(chatEndMessageButtons);

        chatEndMessageContainer.append(chatEndMessageContent);

        const container = document.createElement('div');
        container.setAttribute('id', this.containerId);

        // container.classList.add('avaya-end-chat-prompt-container-overlay');
        // @TODO: styles are not being compiled thus use inline styling instead
        container.style.display = 'none';
        container.style.position = 'fixed';
        container.style.padding = '20px';
        container.style.bottom = '0px';
        container.style.left = '0px';
        container.style.width = '100%';
        container.style.backgroundColor = 'var(--tds-color--white)';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.zIndex = '3';

        container.append(chatEndMessageContainer);

        return container;
    }

    display(confirmedExitCallback = () => {}, declinedExitCallback = () => {}) {
        this.confirmedExitCallback = confirmedExitCallback;
        this.declinedExitCallback = declinedExitCallback;
        showElement(this.containerId, 'flex');
    }

    hide() {
        hideElement(this.containerId);
    }
}

export default EndChatPrompt;