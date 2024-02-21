class AnalyticsHelper {
    constructor(isTriage, isAnalyticsOn) {
        this.isTriage = isTriage;
        this.isAnalyticsOn = isAnalyticsOn;

        this.impressionInteraction = 'impression';
        this.formInitiatedInteraction = 'form-initiated';
        this.chooseTopicInteraction = 'choose-topic';
        this.secondaryTopicInteraction = '';
        this.formShownInteraction = 'form-shown';
        this.supportInteraction = 'support';
        this.needAssistanceInteraction = 'i-still-need-assistance';
        this.goToAccountInteraction = 'go-to-account';
        this.startedInteraction = 'started';
        this.backInteraction = 'back';
        this.exitInteraction = 'exit';
        this.navigateInteraction = 'navigate';
        this.previousPurchases = 'help-with-previous-purchases';
        this.taAgentNotAvailableInteraction = 'tesla-assist-chat-live-agent-unavailable';
        this.taCallbackFormShownInteraction = 'tesla-assist-chat-callback-form-shown';
        this.taCallbackFormSubmittedInteraction = 'tesla-assist-chat-callback-form-submitted';
        this.taImpressionInteraction = 'tesla-assist-chat-impression';
        this.taFormInitializedInteraction = 'tesla-assist-chat-form-initiated';
        this.taShowMoreInteraction = 'tesla-assist-chat-show-more';
        this.taSuggestionInteraction = 'tesla-assist-chat-choose-topic-';
        this.taCtaInteraction = 'tesla-assist-chat-click-';
        this.taExitInteraction = 'tesla-assist-chat-exit';
        this.taMinimizeChatInteraction = 'tesla-assist-chat-minimize';
        this.taChatAgentFormShownInteraction = 'tesla-assist-chat-agent-form-shown';
        this.taChatAgentFormSubmitted = 'tesla-assist-chat-agent-form-submitted';
        this.taChatAgentSessionInteraction = 'tesla-assist-chat-chat-started';
        this.taChatAgentAvailableInteraction = 'tesla-assist-chat-live-agent-available';
        this.endChatPromptNoInteraction = 'tesla-assist-end-chat-no';
        this.endChatPromptYesInteraction = 'tesla-assist-end-chat-yes';

        this.chatPrefix = 'chat-';
        this.triagePrefix = 'triage-chat-';
    }

    fireEvent(interaction, dynamic) {
        if (window.dataLayer && this.isAnalyticsOn) {
            const tag = this.getGATag(interaction, dynamic);
            window.dataLayer.push(tag);
        }
    }

    // For tracking redirects
    fireEventWithCallback(interaction, dynamic, eventCallback) {
        if (window.dataLayer && this.isAnalyticsOn) {
            const tag = this.getGATag(interaction, dynamic);
            tag.eventCallback = eventCallback;
            window.dataLayer.push(tag);
        }
    }

    getGATag(interaction, dynamic = '') {
        if (dynamic !== '') {
            // eslint-disable-next-line no-param-reassign
            interaction =
                interaction && interaction !== this.secondaryTopicInteraction ?
                `${interaction}-${dynamic}` :
                dynamic;
        }

        const interactionWithPrefix = this.isTriage ?
            this.triagePrefix + interaction :
            this.chatPrefix + interaction;

        return {
            event: 'chat',
            interaction: interactionWithPrefix,
        };
    }
}

export default AnalyticsHelper;