// This file contains functions that directly mutate the dom
export function removeSuggestionBubbles() {
    const allSuggestions = document.querySelectorAll('.tw-chat--suggestions.tw-chat--latest');
    allSuggestions ? .forEach((suggestion) => {
        suggestion.remove();
    });
    document.querySelectorAll('.tw-chat--suggestions-spacer') ? .forEach((el) => el ? .remove());
}

export function removePendingConnectionIndicator() {
    document.querySelector('.tw-chat--pending-connection') ? .remove();
}

export function updateShowFooter(show) {
    const footer = document.getElementsByClassName('tw-chat--avaya-chat__footer');
    const avayaChatFrame = document.querySelector('.tw-chat--avaya-chat__frame');
    if (show) {
        footer[0].classList.remove('tw-chat--tds--is_hidden');
        avayaChatFrame.style.marginBottom = '';
        document.getElementsByClassName('tw-chat--tds-form-input-text')[0].focus();
        avayaChatFrame.scrollTo({
            top: avayaChatFrame.scrollHeight,
        });
    } else {
        footer[0].classList.add('tw-chat--tds--is_hidden');
        avayaChatFrame.style.marginBottom = '0';
    }
}