import {
    modal
} from '../tds/tds.js';
const {
    closeModal,
    initModals,
    openModal
} = modal;
import {
    setAttributes,
    sendDebugMessage,
    showElement,
    hideElement,
    makeElementInvisible,
    makeElementVisible,
} from '../utils/AvayaChatUtils.js';
import AvayaChatBubble from './AvayaChatBubble/AvayaChatBubble';
import AvayaHeader from './AvayaHeader/AvayaHeader';
import AvayaChatMessage from './AvayaChatMessage/AvayaChatMessage';
import AvayaChatButton from './AvayaChatButton/AvayaChatButton';
import AvayaChatBackdrop from './AvayaChatBackdrop/AvayaChatBackdrop';
import AvayaStatusPopUp from './AvayaStatusPopUp/AvayaStatusPopUp';
import AvayaChatForm from './AvayaChatForm/AvayaChatForm';
import AvayaChatModal from './AvayaChatModal/AvayaChatModal';
import AvayaChatFrame from './AvayaChatFrame/AvayaChatFrame';
import AvayaChatLoader from './AvayaChatLoader/AvayaChatLoader';
import TriageSection from './TriageSection/TriageSection';
import FAQSection from './FAQSection/FAQSection';
import AvayaChatMinimizeButton from './AvayaChatButton/AvayaChatMinimizeButton';
import {
    removePendingConnectionIndicator,
    updateShowFooter
} from '../utils/MutationUtils.js';
import AvayaChatCloseButton from './AvayaChatButton/AvayaChatCloseButton';
import AvayaChatFinalError from './AvayaChatFinalError/AvayaChatFinalError';
import EndChatPrompt from './EndChatPrompt/EndChatPrompt';

class AvayaChatUserInterface {
    constructor(
        avayaChatConfig,
        userInterfaceEvents,
        avayaAnalyticsHelper,
        onModalOpen = () => {},
        onModalClose = () => {},
        onChatFormSubmit = () => {},
        onChatFooterSubmit = () => {},
        onTyping = () => {},
        resetChat = () => {},
        onTeslaAssistOpen = () => {},
        closeConversationCallback = () => {},
        isWebsocketClosed = () => false
    ) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        const componentProperties = [avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper];
        this.avayaChatBubble = new AvayaChatBubble(...componentProperties, onTeslaAssistOpen);
        this.avayaChatFrame = new AvayaChatFrame(...componentProperties, onChatFooterSubmit, onTyping);
        this.avayaChatLoader = new AvayaChatLoader(...componentProperties, resetChat);
        this.avayaHeader = new AvayaHeader(avayaChatConfig);
        this.avayaChatButton = new AvayaChatButton(...componentProperties);
        this.avayaChatMessage = new AvayaChatMessage({
            avayaChatConfig,
            avayaAnalyticsHelper,
            sendMessage: () => {},
        }); // to do: do we need to remove this initialization and pass the existing one from AvayaChat
        this.avayaChatBackdrop = new AvayaChatBackdrop();
        this.avayaStatusPopUp = new AvayaStatusPopUp(avayaChatConfig);
        this.avayaChatForm = new AvayaChatForm(...componentProperties, onChatFormSubmit);
        this.triageSection = new TriageSection(...componentProperties);
        this.fAQSection = new FAQSection(...componentProperties);
        this.isWebsocketClosed = isWebsocketClosed;
        this.avayaChatMinimizeButton = new AvayaChatMinimizeButton(avayaChatConfig, () => {
            if (this.avayaChatConfig.isTeslaAssist) {
                this.avayaChatBubble.hideChatBubbleBadge();
            } else if (
                this.isWebsocketClosed() === true &&
                this.avayaChatConfig.sessionWasTransferred !== true
            ) {
                this.resetChat();
                this.resetChatUserInterface();
            }
        });
        this.avayaChatCloseButton = new AvayaChatCloseButton(avayaChatConfig);
        this.avayaChatModal = new AvayaChatModal();
        this.chatPrefix = 'avaya-chat';
        this.modalId = 'avaya-chat-modal';
        this.onModalOpen = onModalOpen;
        this.onModalClose = onModalClose;
        this.onChatFormSubmit = onChatFormSubmit;
        this.onChatFooterSubmit = onChatFooterSubmit;
        this.onTyping = onTyping;
        this.resetChat = resetChat;
        this.loaderTimeout = null;
        this.isInChatMode = false;
        this.avayaChatDialogWindow = null;
        this.endChatMessageVisible = false;
        this.chatWasClosedByAgent = false;
        this.cityList = null;
        this.provinceList = null;
        this.selectedCity = null;
        this.selectedProvince = null;
        this.currentPage = window.document.location.pathname.split('/')[1];
        this.pagesUpdatePosition = ['trips'];
        this.finalError = new AvayaChatFinalError(
            avayaChatConfig.initializers ? .chatError,
            avayaChatConfig.initializers ? .chatErrorOccurred
        );
        this.endChatPrompt = new EndChatPrompt(avayaChatConfig, avayaAnalyticsHelper);
        this.closeConversationCallback = closeConversationCallback;
    }

    /**
     * Chat the dialog to Chat mode.
     */
    changeToChatMode() {
        sendDebugMessage('Running AvayaChatUserInterface:changeToChatMode');
        document
            .querySelector(`.tw-chat--${this.chatPrefix}__modal`)
            .classList.remove('tw-chat--avaya-chat__modal-logon');

        this.isInChatMode = true;
        hideElement('avaya-chat__back-button');
        hideElement('chat-page');
        showElement('chat-form__minimize-button');
    }

    /**
     * Chat the dialog to Logon mode.
     */
    changeToLogonMode() {
        sendDebugMessage('Running AvayaChatUserInterface:changeToLogonMode');
        document
            .querySelector(`.tw-chat--${this.chatPrefix}__modal`)
            .classList.add('tw-chat--avaya-chat__modal-logon');

        this.isInChatMode = false;
        if (this.avayaChatConfig.isTriagePreChat) {
            showElement('avaya-chat__back-button');
        }

        if (!this.avayaChatConfig.isTeslaAssist) {
            showElement('chat-page');
            hideElement('chat-form__minimize-button');
        }
    }

    /**
     * Initializes the Avaya Chat User Interface.
     */
    init() {
        sendDebugMessage('Running AvayaChatUserInterface:init');
        const avayaChatContainer = document.createElement('div');
        avayaChatContainer.classList.add(`tw-chat--${this.chatPrefix}-container`);
        const avayaChat = document.createElement('div');
        avayaChat.classList.add(`tw-chat--${this.chatPrefix}`);
        const avayaChatButton = this.avayaChatBubble.generateAvayaChatButton();
        this.avayaChatDialogWindow = this.generateAvayaChatDialog();
        const avayaChatBackdrop = this.avayaChatBackdrop.generateAvayaChatBackdrop();
        avayaChat.append(avayaChatButton);
        avayaChat.append(this.avayaChatDialogWindow);
        avayaChat.append(avayaChatBackdrop);
        avayaChatContainer.append(avayaChat);
        document.body.append(avayaChatContainer);
        this.initEndChatPrompt();
        this.setupModalObserver();
        initModals({
            onCloseFinish: () => {
                this.hideFinalError();
            },
            onCloseStart: () => {},
        });
        this.avayaChatDialogWindow.classList.add(`tw-chat--${this.chatPrefix}__modal-logon`);
    }

    /**
     * Initializes the Avaya Chat User Interface.
     */
    initTeslaAssistUI() {
        sendDebugMessage('Running AvayaChatUserInterface:init');
        const avayaChatContainer = document.createElement('div');
        avayaChatContainer.classList.add(`tw-chat--${this.chatPrefix}-container`);
        const avayaChat = document.createElement('div');
        avayaChat.classList.add(`tw-chat--${this.chatPrefix}`);
        const avayaChatButton = this.avayaChatBubble.generateAvayaChatButton();
        this.avayaChatDialogWindow = this.generateTeslaAssistDialog();
        const avayaChatBackdrop = this.avayaChatBackdrop.generateAvayaChatBackdrop();
        avayaChat.append(avayaChatButton);
        avayaChat.append(this.avayaChatDialogWindow);
        avayaChat.append(avayaChatBackdrop);
        avayaChatContainer.append(avayaChat);
        document.body.append(avayaChatContainer);
        this.initEndChatPrompt();
        this.initFinalError();
        initModals({
            onCloseFinish: () => {},
            onCloseStart: () => {}
        });
        this.avayaChatDialogWindow.classList.add(`tw-chat--${this.chatPrefix}__modal-logon`);
    }

    /**
     * Generates the Tesla Assist Chat Dialog (Modal)
     *
     * @returns {HTMLDialogElement}
     */
    generateTeslaAssistDialog() {
        sendDebugMessage('Running AvayaChatUserInterface:generateTeslaAssistDialog');
        const {
            avayaChatButtonContainer,
            avayaChatDialog,
            avayaChatDialogHeader,
        } = this.avayaChatModal.generateChatWindow();

        const avayaChatMinimizeButton = this.avayaChatMinimizeButton.generateMinimizeButton(
            avayaChatDialog,
            false,
            this.avayaAnalyticsHelper
        );
        avayaChatButtonContainer.append(avayaChatMinimizeButton);
        const avayaChatHeaderTextContainer = this.avayaHeader.generateHeader();
        const avayaChatCloseButton = this.avayaChatCloseButton.generateCloseButton(() => {
            this.makeEndChatButtonInvisible();
            this.endChatPrompt.display(() => {
                this.avayaChatBubble.hideChatBubbleBadge();
                this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.taExitInteraction);
                this.closeConversationCallback();
            });
        });
        avayaChatDialogHeader.append(avayaChatButtonContainer);
        avayaChatDialogHeader.append(avayaChatHeaderTextContainer);
        avayaChatDialogHeader.append(avayaChatCloseButton);
        avayaChatDialog.append(avayaChatDialogHeader);

        const avayaChatDialogContent = document.createElement('section');
        avayaChatDialogContent.classList.add(
            'tw-chat--tds-modal-content',
            `tw-chat--${this.chatPrefix}__modal-content`
        );

        const avayaChatFrame = this.avayaChatFrame.generateAvayaChatFrame();

        Array.from(avayaChatFrame.childNodes).forEach((child) => {
            avayaChatDialogContent.append(child);
        });

        const loader = this.avayaChatLoader.generateLoader();
        avayaChatDialogContent.append(loader);
        avayaChatDialog.append(avayaChatDialogContent);

        const statusPopUp = this.avayaStatusPopUp.generateStatusPopUp();
        avayaChatDialog.append(statusPopUp);

        return avayaChatDialog;
    }

    /**
     * Generates the Avaya Chat Dialog (Modal)
     *
     * @returns {HTMLDialogElement}
     */
    generateAvayaChatDialog() {
        sendDebugMessage('Running AvayaChatUserInterface:generateAvayaChatDialog');
        const {
            avayaChatButtonContainer,
            avayaChatDialog,
            avayaChatDialogHeader,
        } = this.avayaChatModal.generateChatWindow();

        const avayaChatBackButton = document.createElement('button');
        avayaChatBackButton.classList.add(`tw-chat--${this.chatPrefix}__back-button`);
        avayaChatBackButton.setAttribute('id', `avaya-chat__back-button`);
        avayaChatBackButton.setAttribute(
            'aria-label',
            this.avayaChatConfig.initializers.ariaLabelBackButton
        );

        const avayaChatBackButtonArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        avayaChatBackButtonArrow.classList.add('tw-chat--tds-icon', 'tw-chat--tds-chevron--right');
        setAttributes(avayaChatBackButtonArrow, {
            viewBox: '0 0 30 30',
            xmlns: 'http://www.w3.org/2000/svg',
        });

        const avayaChatBackButtonArrowPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        );
        setAttributes(avayaChatBackButtonArrowPath, {
            stroke: 'var(--tds-icon--fill, #171a20)',
            'stroke-width': '2',
            d: 'M10.5 17.5l4.5-4 4.5 4',
            fill: 'none',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            transform: 'rotate(270 15 15)',
        });
        avayaChatBackButtonArrow.append(avayaChatBackButtonArrowPath);
        avayaChatBackButton.append(avayaChatBackButtonArrow);

        const avayaChatMinimizeButton = this.avayaChatMinimizeButton.generateMinimizeButton(
            avayaChatDialog,
            true,
            this.avayaAnalyticsHelper
        );
        avayaChatButtonContainer.append(avayaChatMinimizeButton);

        avayaChatButtonContainer.append(avayaChatBackButton);
        const avayaChatHeaderTextContainer = this.avayaHeader.generateHeader();

        const avayaChatCloseButton = this.avayaChatCloseButton.generateCloseButton(() => {
            this.makeEndChatButtonInvisible();
            this.endChatPrompt.display(
                () => {
                    this.onModalClose();
                    if (this.isInChatMode) {
                        if (this.chatWasClosedByAgent) {
                            this.resetChat();
                            this.resetChatUserInterface();
                        } else if (this.avayaChatConfig.sessionWasTransferred) {
                            closeModal(avayaChatDialog, {
                                onCloseFinish: () => {
                                    this.avayaChatBubble.hideChatBubbleBadge();
                                },
                            });
                            this.avayaChatButton.hideChatButton();
                        } else {
                            this.handleEndChat();
                        }
                    } else {
                        closeModal(avayaChatDialog, {
                            onCloseFinish: () => {
                                this.avayaChatBubble.hideChatBubbleBadge();
                            },
                        });
                    }
                    let gaTagPostfix = '';
                    if (this.avayaChatConfig.isTriagePreChat) {
                        gaTagPostfix = this.userInterfaceEvents.history[
                            this.userInterfaceEvents.history.length - 1
                        ];
                    }
                    this.avayaAnalyticsHelper.fireEvent(
                        this.avayaAnalyticsHelper.exitInteraction,
                        gaTagPostfix
                    );
                    this.makeEndChatButtonVisible();
                },
                () => {
                    this.makeEndChatButtonVisible();
                }
            );
        });

        avayaChatDialogHeader.append(avayaChatButtonContainer);
        avayaChatDialogHeader.append(avayaChatHeaderTextContainer); // header
        avayaChatDialogHeader.append(avayaChatCloseButton); // close Button

        avayaChatDialog.append(avayaChatDialogHeader);

        const avayaChatDialogContent = document.createElement('section');
        avayaChatDialogContent.classList.add(
            'tw-chat--tds-modal-content',
            `tw-chat--${this.chatPrefix}__modal-content`
        );

        if (!this.avayaChatConfig.isTeslaAssist) {
            const avayaChatForm = this.avayaChatForm.generateAvayaChatForm();
            avayaChatDialogContent.append(avayaChatForm);
        }

        if (this.avayaChatConfig.isTriagePreChat) {
            avayaChatDialogContent.append(
                this.triageSection.getAvayaChatTopics(
                    'main-topics',
                    this.avayaChatConfig.triageConfig.chooseTopic,
                    this.avayaChatConfig.triageConfig.teslaProducts,
                    this.avayaChatConfig.triageConfig.chooseTopicSubtext
                )
            );

            avayaChatDialogContent.append(this.fAQSection.getAvayaChatVehicleDeliveryFAQ());
        }

        const avayaChatFrame = this.avayaChatFrame.generateAvayaChatFrame();
        Array.from(avayaChatFrame.childNodes).forEach((child) => {
            avayaChatDialogContent.append(child);
        });

        const loader = this.avayaChatLoader.generateLoader();
        avayaChatDialogContent.append(loader);
        avayaChatDialog.append(avayaChatDialogContent);

        const statusPopUp = this.avayaStatusPopUp.generateStatusPopUp();
        avayaChatDialog.append(statusPopUp);

        return avayaChatDialog;
    }

    showChatForm(chatFrame) {
        const avayaChatForm = this.avayaChatForm.generateAvayaChatForm();
        avayaChatForm.classList.add(`tw-chat--avaya-chat__modal-logon`);
        chatFrame.append(avayaChatForm);
        this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.taChatAgentFormShownInteraction);
        chatFrame.scroll({
            top: chatFrame.scrollHeight,
        });
        updateShowFooter(false);
    }

    /**
     * Reload the chat panel after a refresh
     */
    reloadChatPanel() {
        sendDebugMessage('Running AvayaChatUserInterface:reloadChatPanel');
        console.debug('Reloading chat panel');
        openModal(this.avayaChatDialogWindow);
        this.changeToChatMode();
    }

    /**
     * Resets the chat modal.
     */
    resetChatUserInterface() {
        sendDebugMessage('Running AvayaChatUserInterface:resetChatUserInterface');

        closeModal(this.avayaChatDialogWindow, {
            onCloseStart: () => {},
            onCloseFinish: () => {
                this.avayaChatBubble.hideChatBubbleBadge();
                this.changeToLogonMode();
                this.makeEndChatButtonVisible();
                this.avayaStatusPopUp.hideStatusPopUp();

                if (!this.avayaChatConfig.bypassChatBubble) {
                    this.avayaChatButton.showChatButton();
                }

                this.avayaChatMessage.clearMessageInput();
                this.endChatMessageVisible = false;
                this.chatWasClosedByAgent = false;

                if (this.avayaChatConfig.isTriagePreChat) {
                    hideElement('vehicle-delivery-faq');
                    hideElement('account-support-faq');
                    hideElement('topics-vehicle');
                    hideElement('chat-page');

                    showElement('main-topics');
                    this.userInterfaceEvents.resetHistory();
                }
            },
        });
    }

    minimizeChatDialog() {
        if (this.avayaChatDialogWindow) {
            closeModal(this.avayaChatDialogWindow, {
                onCloseFinish: () => {
                    this.avayaChatBubble.hideChatBubbleBadge();
                },
            });
        }
    }

    /**
     * Sets up the Modal observer.
     *
     * @param avayaChatDialog
     */
    setupModalObserver() {
        sendDebugMessage('Running AvayaChatUserInterface:setupModalObserver');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
                    if (this.avayaChatDialogWindow.hasAttribute('open')) {
                        this.onModalOpen();
                    } else {
                        this.onModalClose();
                    }
                }
            });
        });

        observer.observe(this.avayaChatDialogWindow, {
            attributes: true, // configure it to listen to attribute changes
        });
    }

    /**
     * Shows the chat loader.
     */
    showLoader() {
        const avayaChatLoader = document.querySelector(`.tw-chat--tds-loader`);
        if (avayaChatLoader) {
            avayaChatLoader.classList.add('tw-chat--tds-loader--show');
        }
        this.loaderTimeout = setTimeout(() => {
            this.avayaStatusPopUp.showStatusPopUp(false, true);
            this.changeToLogonMode();
            this.hideLoader();
            this.resetChat();
        }, this.avayaChatConfig.maxWaitTime * 1000);
    }

    handleEndChat() {
        // The chat window can be minimized already
        this.avayaChatBubble.hideChatBubbleBadge();
        this.makeEndChatButtonInvisible();
        this.isInChatMode = false;

        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__frame`);
        if (avayaChatFrame) {
            avayaChatFrame.scrollTo({
                top: avayaChatFrame.scrollHeight,
            });
        }
        hideElement('chat-page');
        removePendingConnectionIndicator();
    }

    makeEndChatButtonInvisible() {
        makeElementInvisible('chat-form__end-chat-button');
    }

    makeEndChatButtonVisible() {
        makeElementVisible('chat-form__end-chat-button');
    }

    /**
     * Hides the chat loader.
     */
    hideLoader() {
        const avayaChatLoader = document.querySelector(`.tw-chat--tds-loader`);
        if (avayaChatLoader) {
            avayaChatLoader.classList.remove('tw-chat--tds-loader--show');
        }
        window.clearTimeout(this.loaderTimeout);
    }

    displayFinalError() {
        this.makeEndChatButtonInvisible();
        updateShowFooter(false);

        this.finalError.show();
    }

    hideFinalError() {
        this.finalError.hide();
    }

    initFinalError() {
        sendDebugMessage('Running AvayaChatUserInterface:initFinalError');
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__footer`);
        if (avayaChatFrame) {
            const finalErrorMessage = this.finalError.generate();
            avayaChatFrame.after(finalErrorMessage);
        }
    }

    initEndChatPrompt(confirmedExitCallback = () => this.onModalClose()) {
        sendDebugMessage('Running AvayaChatUserInterface:initEndChatPrompt');
        const avayaChatFrame = document.querySelector(`.tw-chat--${this.chatPrefix}__footer`);
        if (avayaChatFrame) {
            const endChatPrompt = this.endChatPrompt.generate(confirmedExitCallback);
            avayaChatFrame.after(endChatPrompt);
        }
    }
}

export default AvayaChatUserInterface;