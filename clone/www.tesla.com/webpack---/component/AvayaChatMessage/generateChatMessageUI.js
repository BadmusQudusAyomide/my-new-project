import anchorify from 'anchorify';
import DOMPurify from 'dompurify';
import {
    createElementWithAttributes
} from '../../utils/CommonUtils.js';
import {
    getSpinner
} from '../../utils/AvayaChatUtils.js';
import UpdateContextHelper from '../../helpers/UpdateContextHelper.js';

class generateChatMessageUI {
    constructor(avayaChatConfig, avayaAnalyticsHelper, sendMessage) {
        this.chatPrefix = 'avaya-chat';
        this.avayaChatConfig = avayaChatConfig;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.sendMessage = sendMessage;
        this.updateContextHelper = new UpdateContextHelper(avayaChatConfig);
    }

    generateContactCardMessage(ContactInformationBlurb) {
        const {
            isTeslaAssist
        } = this.avayaChatConfig;
        const {
            contactCard
        } =
        isTeslaAssist && !window.avaya.is_agent_available ?
            this.avayaChatConfig.tasCallBackFormConfig :
            this.avayaChatConfig.tasPreEngagementConfig;

        return createElementWithAttributes('div', {
            class: ['tw-chat--avaya-chat__chat-message', 'tw-chat--chat-message'],
            children: [{
                tag: 'div',
                attributes: {
                    class: ['tw-chat--chat-message__sent', 'tw-chat--contact-card-container'],
                    children: [{
                            tag: 'p',
                            attributes: {
                                class: 'tw-chat--contact-card-header',
                                textContent: ContactInformationBlurb.title,
                            },
                        },
                        {
                            tag: 'ul',
                            attributes: {
                                class: ['tw-chat--contact-card-contact-details', 'tds--no_padding'],
                                children: [
                                    ...Object.entries(ContactInformationBlurb.details).map((contactDetail) => {
                                        return {
                                            tag: 'li',
                                            attributes: {
                                                class: [
                                                    'tw-chat--contact-card-detail',
                                                    `tw-chat--contact-card-detail--${contactDetail[0]}`,
                                                ],
                                                innerHTML: `${
                            contactCard[contactDetail[0]]
                          }: <span class="tw-chat--contact-detail-value" >${
                            contactDetail[1]
                          }</span>`,
                                            },
                                        };
                                    }),
                                ],
                            },
                        },
                    ],
                },
            }, ],
        });
    }

    generateCTAMessage(cta, text, title) {
        return createElementWithAttributes('div', {
            class: ['tw-chat--avaya-chat__chat-message', 'tw-chat--chat-message'],
            children: [{
                tag: 'div',
                attributes: {
                    class: ['tw-chat--chat-message__response', 'tw-chat--cta-container'],
                    children: [{
                            tag: 'span',
                            attributes: {
                                class: ['tw-chat--cta-header', 'tds-text--body'],
                                textContent: title,
                            },
                        },
                        {
                            tag: 'p',
                            attributes: {
                                class: 'tw-chat--cta-description',
                                textContent: text,
                            },
                        },
                        ...cta.map((item) => {
                            const analyticsDisplayName = item.display_name.replace(' ', '-');
                            const fireGAEvent = () => {
                                this.avayaAnalyticsHelper.fireEvent(
                                    `${
                      this.avayaAnalyticsHelper.taCtaInteraction
                    }${analyticsDisplayName.toLowerCase()}`
                                );
                            };

                            if (item.type === 'BUTTON') {
                                return {
                                    tag: 'a',
                                    attributes: {
                                        class: ['tds-btn', 'tds-btn--tertiary', 'tw-chat--cta-white-button'],
                                        textContent: item.display_name,
                                        rel: 'noopener noreferrer',
                                        href: item.target,
                                        type: 'button',
                                        onclick: fireGAEvent,
                                    },
                                };
                            } else if (item.type === 'LINK') {
                                return {
                                    tag: 'a',
                                    attributes: {
                                        class: ['tds-link', 'tw-chat--cta-link'],
                                        textContent: item.display_name,
                                        rel: 'noopener noreferrer',
                                        href: item.target,
                                        type: 'link',
                                        onclick: fireGAEvent,
                                    },
                                };
                            }
                        }),
                    ],
                },
            }, ],
        });
    }

    generateMetaMessage(className) {
        const chatMessageMeta = document.createElement('div');
        chatMessageMeta.classList.add(
            'tw-chat--chat-message__meta',
            `tw-chat--chat-message__meta__${className}`,
            'tds-text--caption'
        );

        return chatMessageMeta;
    }

    generateParagraph(text) {
        const chatMessageParagraph = document.createElement('p');
        chatMessageParagraph.innerHTML = DOMPurify.sanitize(anchorify(text));
        const linksInParagraph = chatMessageParagraph.querySelectorAll('a');
        linksInParagraph.forEach((link) => {
            link.classList.add('tw-chat--tds-link');
        });
        return chatMessageParagraph;
    }

    generateSuggestionBubble(chatMessage) {
        chatMessage.classList.add('tw-chat--suggestions');
        chatMessage.classList.add('tw-chat--latest');
    }

    generateTextMessage(chatMessage) {
        chatMessage.classList.add(`tw-chat--${this.chatPrefix}__chat-message`, 'tw-chat--chat-message');
    }

    handleStartNewChatSessionCallback(chatMessageUser, startNewChatSessionCallback = () => {}) {
        chatMessageUser.addEventListener('click', () => {
            startNewChatSessionCallback();
        });
    }

    generateTextMessageBlob(
        avayaChatFrame,
        className,
        handleSelectSuggestion,
        handleShowMore,
        startNewChatSessionCallback = () => {},
        hide,
        htmlElement,
        question,
        text
    ) {
        const chatMessage = document.createElement('div');

        if (htmlElement === 'button') {
            this.generateSuggestionBubble(chatMessage);
        } else {
            this.generateTextMessage(chatMessage);
        }

        const chatMessageUser = document.createElement(htmlElement);

        if (htmlElement === 'button') {
            if (hide) {
                chatMessageUser.classList.add('tw-chat--tds--is_hidden');
            }

            chatMessageUser.dataset.question = question;

            if (question === 'showMore') {
                handleShowMore(chatMessageUser, avayaChatFrame, this.avayaAnalyticsHelper);
            } else if (question === 'startNewChatSession') {
                this.handleStartNewChatSessionCallback(chatMessageUser, startNewChatSessionCallback);
            } else {
                handleSelectSuggestion(
                    chatMessageUser,
                    text,
                    question,
                    this.avayaAnalyticsHelper,
                    this.sendMessage,
                    this.updateContextHelper.updateContext
                );
            }
        } else {
            chatMessageUser.classList.add(`tw-chat--chat-message__${className}`);
        }

        const chatMessageMeta = this.generateMetaMessage(className);
        const chatMessageParagraph = this.generateParagraph(text);
        if (question === 'showSpinner') {
            const loader = getSpinner();
            loader.classList.add('tw-chat--tds-loader--show', 'tw-chat--small-loader');
            chatMessageUser.append(loader);
            chatMessage.classList.add('tw-chat--pending-connection');
        }
        chatMessageUser.append(chatMessageParagraph);

        chatMessage.append(chatMessageUser);
        chatMessage.append(chatMessageMeta);

        avayaChatFrame.append(chatMessage);
        avayaChatFrame.scrollTo({
            top: avayaChatFrame.scrollHeight,
        });
    }
}

export default generateChatMessageUI;