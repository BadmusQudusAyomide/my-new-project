import axios from 'axios';

import {
    getLocale,
    getCountry,
    getUICountry
} from './CommonUtils';

export const getCountryData = async () => {
    const locale = getLocale();
    let additionalData = '';
    if (['zh_CN', 'ko_KR'].indexOf(locale) > -1) {
        additionalData = '&additional=true';
    }
    const response = await axios.get(`/cua-api/drive/country-data?locale=${locale}${additionalData}`);
    return response;
};

export const isCN = () =>
    getCountry() === 'CN' || getUICountry() === 'CN' || /tesla\.cn$/.test(location.hostname);