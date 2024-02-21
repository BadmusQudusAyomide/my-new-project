const debug = false;

/**
 * Clears session storage.
 */
const clearLocalStorage = () => {
    localStorage.removeItem('guid');
    localStorage.removeItem('ak');
    localStorage.removeItem('lastChatRequestTimestamp');
    localStorage.removeItem('useLatestTDS');
    localStorage.removeItem('chatAttributes');
    localStorage.removeItem('avayaContextID');
    localStorage.removeItem('isTAS');
    localStorage.removeItem('oceanaWebChatSocket');
    localStorage.removeItem('initializers');
    localStorage.removeItem('triageConfig');
    localStorage.removeItem('preEngagementConfig');
    localStorage.removeItem('tasPreEngagementConfig');
    localStorage.removeItem('submitLeadURL');
    localStorage.removeItem('callBackFormConfig');
    localStorage.removeItem('chatFormDetails');
    localStorage.removeItem('productInterest');
    localStorage.removeItem('chatFirstOpenOn');
};

/**
 * Get an object from local storage.
 * @param key
 * @returns the resulting pair
 */
const getLocalStorage = (key) => localStorage.getItem(key);

/**
 * Sets a specified key-value pair in local storage.
 * @param key
 * @param value
 */
const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

/**
 * Output a debug message to the console.
 *
 * @param message
 * @param context
 */
const sendDebugMessage = (message, context = {}) => {
    if (debug) {
        // eslint-disable-next-line no-console
        console.debug(message, context);
    }
};

function showElement(elementId, displayOption = 'block') {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.style.display = displayOption;
    }
}

function hideElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.style.display = 'none';
    }
}

function makeElementInvisible(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.classList.add('tds--is_invisible');
    }
}

function makeElementVisible(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
        elem.classList.remove('tds--is_invisible');
    }
}

/**
 * Set the attributes of a dom element.
 *
 * @param element
 * @param attributes
 */
function setAttributes(element, attributes) {
    sendDebugMessage('Running AvayaChatUserInterface:setAttributes');
    Object.entries(attributes).forEach((args) => element.setAttribute(...args));
}

/**
 * Create a generic timer.
 *
 * @param time in seconds
 * @param callback
 */
function createTimer(time, callback, _this) {
    let timeInMs = time * 1000;
    let timer = null;

    const stop = (debugMsgCaller = '') => {
        if (debugMsgCaller && debugMsgCaller.length > 0) {
            sendDebugMessage('Stopping timer for the websocket response timeout: ' + debugMsgCaller);
        }
        if (timer) clearTimeout(timer);
    };

    const start = (debugMsgCaller = '') => {
        if (debugMsgCaller && debugMsgCaller.length > 0) {
            sendDebugMessage('(Re)starting timer for the websocket response timeout: ' + debugMsgCaller);
        }
        stop();
        timer = setTimeout(() => {
            callback.call(_this);
        }, timeInMs);
    };

    return {
        start,
        stop
    };
}

function getSpinner() {
    const spinner = document.createElement('div');
    // spinner.classList.add('tw-chat--tds-loader', 'tw-chat--avaya-chat-loader');
    setAttributes(spinner, {
        'aria-busy': true,
        'aria-hidden': false,
        'aria-label': 'Loading',
        'aria-live': 'polite',
    });

    const avayaLoaderSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    avayaLoaderSvg.classList.add('tw-chat--tds-icon-loader', 'tw-chat--small-loader-icon');
    setAttributes(avayaLoaderSvg, {
        viewBox: '0 0 51 51',
        xmlns: 'http://www.w3.org/2000/svg',
    });
    spinner.append(avayaLoaderSvg);

    return spinner;
}

export {
    clearLocalStorage,
    getLocalStorage,
    setLocalStorage,
    sendDebugMessage,
    setAttributes,
    showElement,
    hideElement,
    makeElementInvisible,
    makeElementVisible,
    createTimer,
    getSpinner,
};