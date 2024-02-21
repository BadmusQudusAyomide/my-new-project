import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class AvayaTypingIndicator {
    constructor() {
        this.chatPrefix = 'avaya-chat';
    }

    addIsTypingIndicator(userName) {
        sendDebugMessage('Running AvayaChatUserInterface:addIsTypingIndicator');

        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);
        if (userName && avayaChatFrame) {
            const chatMessage = document.createElement('div');
            chatMessage.classList.add(
                `tw-chat--${this.chatPrefix}__chat-message`,
                'tw-chat--chat-message',
                'tw-chat--chat-message--typing'
            );
            chatMessage.dataset.userTyping = userName;

            const chatMessageUser = document.createElement('div');
            chatMessageUser.classList.add('tw-chat--chat-message__response');

            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('tw-chat--chat-message__typing-indicator');

            const typingBullet = document.createElement('span');
            typingBullet.classList.add('tw-chat--chat-message__typing-bullet');

            for (let index = 0; index < 3; index++) {
                typingIndicator.append(typingBullet.cloneNode(true));
            }

            chatMessageUser.append(typingIndicator);
            chatMessage.append(chatMessageUser);

            avayaChatFrame.append(chatMessage);
            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight,
            });
        }
    }

    removeIsTypingIndicator(removeAll, userName = '') {
        sendDebugMessage('Running AvayaChatUserInterface:removeIsTypingIndicator');
        if (removeAll || userName) {
            const chatMessages = document.querySelectorAll(
                `.tw-chat--${this.chatPrefix}__chat-message.tw-chat--chat-message--typing`
            );
            Array.from(chatMessages).forEach((chatMessage) => {
                if (
                    removeAll ||
                    (typeof chatMessage.dataset !== 'undefined' &&
                        typeof chatMessage.dataset.userTyping !== 'undefined' &&
                        chatMessage.dataset.userTyping === userName)
                ) {
                    chatMessage.parentNode.removeChild(chatMessage);
                }
            });
        }
    }
}

export default AvayaTypingIndicator;