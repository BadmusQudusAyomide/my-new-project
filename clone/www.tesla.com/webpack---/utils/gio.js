export const GIO_EVENTS = {
    TRACK: 'track',
};

export const GIO_EVENT_TYPES = {
    CHAT_CLICK: 'web_chat_click',
    CHAT_START_CLICK: 'web_chat_start_click',
};

export const GIO_LOCALES = ['zh-cn'];

/**
 * Add Growing IO Event
 * https://growingio.github.io/growingio-sdk-docs/docs/webjs/base/api#%E6%8E%A5%E5%8F%A3%E5%88%97%E8%A1%A8
 *
 * @param {string} locale locale
 * @param {object} event track.
 * @param {object} type event type defined in gio-admin
 * @param {object} data additional properties
 *
 * @returns {null} doesn't return anything.
 */
export const addGIOEvent = (locale, event, type, data) => {
    if (window.gdp && locale && GIO_LOCALES.includes(locale.toLowerCase())) {
        const hash = window.location.hash;
        window.gdp(event, type, hash ? {
            web_chat_hash: hash,
            ...data
        } : data);
    }
};