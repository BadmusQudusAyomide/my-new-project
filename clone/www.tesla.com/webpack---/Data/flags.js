import {
    getCountry2
} from '../utils/CommonUtils';

export const flags = {
    demoDriveCopy: ['CA', 'US', 'MX', 'PR'],
    showDeliveryOnTriage: ['US'],
    optOutNewsletter: [
        'BE',
        'CZ',
        'DK',
        'DE',
        'GR',
        'ES',
        'FR',
        'HR',
        'HU',
        'IE',
        'IS',
        'IT',
        'LU',
        'NL',
        'NO',
        'AT',
        'PL',
        'PT',
        'RO',
        'SI',
        'CH',
        'SE',
        'FI',
        'GB',
        'EU',
        'IL',
        'AE',
        'JO',
    ],
};

/**
 * Process an object like 'flags' and determine which keys render true/false.
 * Currently, we only need per-market flags, but this can be extended upon.
 *
 * @param flags
 * @param market
 * @returns {{}}
 */
// eslint-disable-next-line no-shadow
export const processFlags = (flags, market) => {
    return Object.keys(flags).reduce((processedFlags, flagKey) => {
        let flagValue = false;
        const flagContents = flags[flagKey];

        if (Array.isArray(flagContents)) {
            flagValue = flagContents.indexOf(market) >= 0;
        } else if (flagContents instanceof Object) {
            flagValue = flagContents[market] || flagContents.default || null;
        } else if (typeof flagContents === 'boolean') {
            flagValue = flagContents;
        }

        return {
            ...processedFlags,
            [flagKey]: flagValue,
        };
    }, {});
};

export const flag = {
    ...processFlags(flags, getCountry2()),
};