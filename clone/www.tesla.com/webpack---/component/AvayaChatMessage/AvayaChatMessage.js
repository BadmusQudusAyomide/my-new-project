import DOMPurify from 'dompurify';
import {
    hideElement,
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';
import GenerateChatMessageUI from './generateChatMessageUI.js';
import {
    removeSuggestionBubbles,
    updateShowFooter
} from '../../utils/MutationUtils.js';
import {
    ChatEndReasonsEnum
} from '../../helpers/UpdateContextHelper.js';

class AvayaChatMessage {
    constructor({
        avayaChatConfig,
        avayaAnalyticsHelper,
        sendMessage,
        startNewChatSessionCallback = () => {},
    }) {
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
        this.avayaChatConfig = avayaChatConfig;
        this.sendMessage = sendMessage;
        this.generateChatMessageUI = new GenerateChatMessageUI(
            avayaChatConfig,
            avayaAnalyticsHelper,
            sendMessage
        );
        this.startNewChatSessionCallback = startNewChatSessionCallback;
    }

    handleSelectSuggestion(
        chatMessageUser,
        text,
        question,
        avayaAnalyticsHelper,
        sendMessage,
        updateContext
    ) {
        chatMessageUser.addEventListener('click', () => {
            removeSuggestionBubbles();

            const selectedSuggestionForAnalytics = question.replace(' ', '-');
            avayaAnalyticsHelper.fireEvent(
                `${
          avayaAnalyticsHelper.taSuggestionInteraction
        }${selectedSuggestionForAnalytics.toLowerCase()}`
            );

            if (question === 'End chat') {
                updateContext(ChatEndReasonsEnum.END_CHAT_BUBBLE_CLICKED);
            }

            sendMessage(text, question);
        });
    }

    handleShowMore(chatMessageUser, avayaChatFrame, avayaAnalyticsHelper) {
        chatMessageUser.addEventListener('click', () => {
            avayaAnalyticsHelper.fireEvent(avayaAnalyticsHelper.taFormInitializedInteraction);

            const allSuggestions = document.querySelectorAll('.tw-chat--latest .tw-chat--tds--is_hidden');
            allSuggestions.forEach((suggestion) => {
                suggestion.classList.remove('tw-chat--tds--is_hidden');
            });

            chatMessageUser.remove();

            updateShowFooter(true);

            const dialogWindow = document.querySelector(
                '.tw-chat--tds-modal-content.tw-chat--avaya-chat__modal-content'
            );

            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight + 200,
            });

            setTimeout(() => {
                dialogWindow.scrollTo({
                    top: dialogWindow.offsetHeight,
                });
            }, 500);
        });
    }

    /**
     * Append a paragraph or other element to the chat transcript.
     * Includes an autoscroll mechanism
     *
     * @param text
     * @param className
     * @param date
     * @param user
     */
    appendMessage({
        text,
        className,
        htmlElement = 'div',
        question = null,
        hide = false,
        cta,
        responseType,
        title,
        contactInformation = null,
    }) {
        sendDebugMessage('Running AvayaChatUserInterface:appendMessage');
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);

        if (avayaChatFrame) {
            if (!responseType || responseType === 'TEXT') {
                this.generateChatMessageUI.generateTextMessageBlob(
                    avayaChatFrame,
                    className,
                    this.handleSelectSuggestion,
                    this.handleShowMore,
                    this.startNewChatSessionCallback,
                    hide,
                    htmlElement,
                    question,
                    text
                );
            } else if (responseType === 'BLOB') {
                const ctaMessage = this.generateChatMessageUI.generateCTAMessage(cta, text, title);
                avayaChatFrame.append(ctaMessage);
                avayaChatFrame.scrollTo({
                    top: avayaChatFrame.scrollHeight,
                });
            } else if (responseType === 'CONTACT_INFORMATION') {
                const contactCardMessage = this.generateChatMessageUI.generateContactCardMessage(
                    contactInformation
                );
                avayaChatFrame.append(contactCardMessage);
                avayaChatFrame.scrollTo({
                    top: avayaChatFrame.scrollHeight,
                });
            }
        }
    }

    /**
     * Clears the chatbox.
     */
    clearMessageInput() {
        sendDebugMessage('Running AvayaChatUserInterface:clearMessageInput');
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);
        if (avayaChatFrame) {
            avayaChatFrame.innerHTML = DOMPurify.sanitize('');
        }
    }

    writeChatBoxMessage(mainMessage = '', additionalMessage = '', closedByAgent = true) {
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);
        if (avayaChatFrame) {
            const chatEndMessageContainer = document.createElement('div');
            chatEndMessageContainer.classList.add('tw-chat--chat-end-message-container');

            const chatEndMessageContent = document.createElement('div');
            chatEndMessageContent.classList.add('tw-chat--chat-end-message-content');

            const chatEndMessageMainText = document.createElement('p');
            chatEndMessageMainText.classList.add('tw-chat--chat-end-message-main');
            chatEndMessageMainText.innerText = mainMessage;

            const chatEndMessageAdditionalText = document.createElement('p');
            chatEndMessageAdditionalText.classList.add('tw-chat--chat-end-message-additional');
            chatEndMessageAdditionalText.innerText = additionalMessage;

            chatEndMessageContent.append(chatEndMessageMainText);
            chatEndMessageContent.append(chatEndMessageAdditionalText);

            chatEndMessageContainer.append(chatEndMessageContent);

            hideElement('chat-end-question-message');

            if (closedByAgent) {
                this.chatWasClosedByAgent = true; //TODO Here. NEeds to persist this between components.
            }

            avayaChatFrame.append(chatEndMessageContainer);

            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight,
            });
        }
    }

    writeChatBoxResumeMessage(message = '', resumeMessage = '', callback = () => {}) {
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);
        if (avayaChatFrame) {
            const chatEndMessageContainer = document.createElement('div');
            chatEndMessageContainer.classList.add('tw-chat--chat-end-message-container');

            const chatEndMessageContent = document.createElement('div');
            chatEndMessageContent.classList.add('tw-chat--chat-end-message-content');

            const chatEndMessage = document.createElement('p');
            chatEndMessage.classList.add('tw-chat--chat-end-message-additional');
            chatEndMessage.innerText = message;

            const resumeChatLink = document.createElement('span');
            resumeChatLink.innerText = resumeMessage;
            resumeChatLink.classList.add('tds-link', 'tw-chat--chat-end-message-resume');
            resumeChatLink.addEventListener('click', callback);

            chatEndMessage.appendChild(resumeChatLink);

            chatEndMessageContent.append(chatEndMessage);

            chatEndMessageContainer.append(chatEndMessageContent);

            hideElement('chat-end-question-message');

            avayaChatFrame.append(chatEndMessageContainer);

            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight,
            });
        }
    }

    writeChatStatusMessage(message) {
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);
        if (avayaChatFrame) {
            const messageContainer = document.createElement('div');

            messageContainer.classList.add('tw-chat--chat-status-message-container');

            const messageContent = document.createElement('div');
            messageContent.classList.add('tw-chat--chat-status-message-content');

            const messageDate = document.createElement('div');
            messageDate.classList.add('tw-chat--chat-status-message-time');
            messageDate.innerText = new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true,
                minute: 'numeric',
            });

            const messageText = document.createElement('div');
            messageText.classList.add('tw-chat--chat-status-message-main');
            messageText.innerText = message;

            messageContent.append(messageDate);
            messageContent.append(messageText);

            messageContainer.append(messageContent);

            avayaChatFrame.append(messageContainer);

            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight,
            });
        }
    }
}

export default AvayaChatMessage;