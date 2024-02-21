import _get from 'lodash/get';
import {
    pages,
    productInterests
} from '../Data/constants';

export const getLocale = () => _get(window, 'tesla.App.locale', 'en_US');

export const getCountry = () => _get(window, 'tesla.App.country', 'US');

export const getUICountry = () => _get(window, 'tesla.App.uiCountry', 'US');

export const getCountry2 = () => {
    return _get(window, 'i18n.region', 'US').toUpperCase();
};

export function createElementWithAttributes(tag, attributes) {
    let element = document.createElement(tag);

    for (let key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            switch (key) {
                case 'style':
                    if (typeof attributes[key] === 'object') {
                        for (let styleKey in attributes[key]) {
                            if (Object.prototype.hasOwnProperty.call(attributes[key], styleKey)) {
                                element.style[styleKey] = attributes[key][styleKey];
                            }
                        }
                    }
                    break;
                case 'children':
                    attributes[key].forEach((child) => {
                        let childElement = createElementWithAttributes(child.tag, child.attributes || {});
                        element.appendChild(childElement);
                    });
                    break;
                case 'textContent':
                    element.textContent = attributes[key];
                    break;
                case 'innerHTML':
                    element.innerHTML = attributes[key];
                    break;
                case 'class':
                    if (Array.isArray(attributes[key])) {
                        element.className = attributes[key].join(' ');
                    } else {
                        element.className = attributes[key];
                    }
                    break;
                default:
                    if (key.startsWith('on')) {
                        // Convert onClick to "click", onInput to "input", etc.
                        let eventName = key.slice(2).toLowerCase();
                        element.addEventListener(eventName, attributes[key]);
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
            }
        }
    }

    return element;
}

/**
 *
 * @param pathname - URL location
 * @returns product interested based on the pathname or null
 */
export const getProductInterested = () => {
    let productInterest = null;

    if (localStorage.getItem('productInterest') !== null) {
        productInterest = localStorage.getItem('productInterest');
    }

    return productInterest;
};

/**
 * Get the chat page based on the current chat concern.
 *
 * @param {array} attributes page specific avaya attributes
 * @returns string page identifier
 */
const getPage = (attributes) => {
    let page = '';
    for (const attribute of attributes) {
        if (concernTypeToPageMapping[attribute]) {
            page = concernTypeToPageMapping[attribute];
            break;
        }
    }
    return page;
};

const concernTypeToPageMapping = {
    // DRIVE
    'Concern.Drive': pages.DRIVE,
    'Concern.Drive-stg': pages.DRIVE,

    // Inventory
    'Concern.NewMS': pages.INVENTORY_MS,
    'Concern.NewMS-stg': pages.INVENTORY_MS,
    'Concern.MSOrder': pages.INVENTORY_MS,
    'Concern.MSOrder-stg': pages.INVENTORY_MS,

    'Concern.NewM3': pages.INVENTORY_M3,
    'Concern.NewM3-stg': pages.INVENTORY_M3,
    'Concern.M3Order': pages.INVENTORY_M3,
    'Concern.M3Order-stg': pages.INVENTORY_M3,

    'Concern.NewMX': pages.INVENTORY_MX,
    'Concern.NewMX-stg': pages.INVENTORY_MX,
    'Concern.MXOrder': pages.INVENTORY_MX,
    'Concern.MXOrder-stg': pages.INVENTORY_MX,

    'Concern.NewMY': pages.INVENTORY_MY,
    'Concern.NewMY-stg': pages.INVENTORY_MY,
    'Concern.MYOrder': pages.INVENTORY_MY,
    'Concern.MYOrder-stg': pages.INVENTORY_MY,

    // Product Pages
    'Concern.ModelS': pages.PRODUCT_MS,
    'Concern.ModelS-stg': pages.PRODUCT_MS,
    'Concern.Model3': pages.PRODUCT_M3,
    'Concern.Model3-stg': pages.PRODUCT_M3,
    'Concern.ModelX': pages.PRODUCT_MX,
    'Concern.ModelX-stg': pages.PRODUCT_MX,
    'Concern.ModelY': pages.PRODUCT_MY,
    'Concern.ModelY-stg': pages.PRODUCT_MY,

    // Design Pages
    'Concern.MSdesign': pages.CONFIGURATOR_MS,
    'Concern.MSdesign-stg': pages.CONFIGURATOR_MS,
    'Concern.M3design': pages.CONFIGURATOR_M3,
    'Concern.M3design-stg': pages.CONFIGURATOR_M3,
    'Concern.MXdesign': pages.CONFIGURATOR_MX,
    'Concern.MXdesign-stg': pages.CONFIGURATOR_MX,
    'Concern.MYdesign': pages.CONFIGURATOR_MY,
    'Concern.MYdesign-stg': pages.CONFIGURATOR_MY,
};

/**
 *
 * Set product Interest in local storage based on url path
 * Used in TAS.
 */
export const setProductInterest = (attributes) => {
    let productInterest = null;
    let page = getPage(attributes);

    if (page !== 'drive') {
        if (page.includes('modelS')) {
            productInterest = productInterests.MS;
        } else if (page.includes('model3')) {
            productInterest = productInterests.M3;
        } else if (page.includes('modelX')) {
            productInterest = productInterests.MX;
        } else if (page.includes('modelY')) {
            productInterest = productInterests.MY;
        }
    } else if (localStorage.getItem('driveProductInterest') !== null) {
        productInterest = localStorage.getItem('driveProductInterest');
        productInterest = productInterest.replace('Model', 'Model ');
    }

    if (productInterest) {
        localStorage.setItem('productInterest', productInterest);
        localStorage.setItem('chatFirstOpenOn', page);
    }
};

/**
 * Reads the traffic cookies and returns the latest traffic cookie data
 * @returns {Object|null}
 */

export function getTrafficData() {
    const trafficIds = ['_gclid', '_twclidx', '_trafficid'];
    const [GCLID_KEY, TWCLID_KEY] = ['gclid', 'twclid'];

    // check in URL for the traffic data
    const params = new URLSearchParams(window.location.search);
    const [utmSource, utmCampaign] = [params.get('utm_source'), params.get('utm_campaign')];

    if (utmSource && utmCampaign) {
        const trafficSource = {
            trafficsource: utmSource,
            campaignname: utmCampaign,
        };

        if (params.has(GCLID_KEY)) {
            trafficSource.trafficid = params.get(GCLID_KEY);
        } else if (params.has(TWCLID_KEY)) {
            trafficSource.trafficid = params.get(TWCLID_KEY);
        }
        return trafficSource;
    }

    // read cookies
    const cookies = document.cookie.split('; ');
    const trafficData = [];

    cookies.forEach((cookie) => {
        const [id, value] = cookie.split('=');

        if (trafficIds.includes(id)) {
            const data = JSON.parse(decodeURIComponent(value));

            const trafficSource = {
                trafficsource: data ? .utm_source,
                campaignname: data ? .utm_campaign,
                timestamp: data ? .timestamp,
            };

            if (id === trafficIds[0]) {
                trafficSource.trafficid = data.gclid;
            } else if (id === trafficIds[1]) {
                trafficSource.trafficid = data.twclid;
            }

            // only push if source and campaign values are present
            if (data.utm_source && data.utm_campaign) trafficData.push(trafficSource);
        }
    });

    if (trafficData.length) {
        const latestTrafficSource = trafficData.reduce((latest, current) => {
            const currentSourceTime = new Date(current.timestamp).getTime();
            const latestSourceTime = new Date(latest.timestamp).getTime();

            return currentSourceTime > latestSourceTime ? current : latest;
        }, trafficData[0]);

        return latestTrafficSource;
    }
    return null;
}