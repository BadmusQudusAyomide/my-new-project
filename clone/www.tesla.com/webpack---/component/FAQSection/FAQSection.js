import DOMPurify from 'dompurify';
import {
    localizeUrl
} from '@tesla/parse-locale';
import {
    sendDebugMessage
} from '../../utils/AvayaChatUtils.js';

class FAQSection {
    constructor(avayaChatConfig, userInterfaceEvents, avayaAnalyticsHelper) {
        this.avayaChatConfig = avayaChatConfig;
        this.userInterfaceEvents = userInterfaceEvents;
        this.avayaAnalyticsHelper = avayaAnalyticsHelper;
        this.chatPrefix = 'avaya-chat';
    }

    getAvayaChatVehicleDeliveryFAQ() {
        sendDebugMessage('Running AvayaChatUserInterface:getAvayaChatVehicleDeliveryFAQ');
        const avayaChatDeliveryFAQWrapper = document.createElement('div');
        avayaChatDeliveryFAQWrapper.setAttribute('id', 'vehicle-delivery-faq');
        avayaChatDeliveryFAQWrapper.classList.add(`tw-chat--small-height-screen`);
        avayaChatDeliveryFAQWrapper.style.display = 'none';

        const avayaChatScreenHeaderBlock = document.createElement('div');
        avayaChatScreenHeaderBlock.classList.add(`tw-chat--${this.chatPrefix}__topic-header-container`);

        const avayaChatHeading = document.createElement('h6');
        avayaChatHeading.classList.add(`tw-chat--${this.chatPrefix}__topic-header`);
        avayaChatHeading.innerHTML = DOMPurify.sanitize(
            this.avayaChatConfig.triageConfig.vehicleDeliveryHeading
        );

        const avayaChatHeadingDescription = document.createElement('p');
        avayaChatHeadingDescription.classList.add(`tw-chat--${this.chatPrefix}__topic-sub-heading`);
        avayaChatHeadingDescription.innerHTML = DOMPurify.sanitize(
            this.avayaChatConfig.triageConfig.vehicleDeliveryDescription
        );

        avayaChatScreenHeaderBlock.append(avayaChatHeading);
        avayaChatScreenHeaderBlock.append(avayaChatHeadingDescription);

        const avayaChatVehicleDeliveryLink = document.createElement('a');
        avayaChatVehicleDeliveryLink.classList.add(
            'tw-chat--tds-btn',
            'tw-chat--tds-btn--secondary',
            'tw-chat--vehicle-delivery-login-btn'
        );

        avayaChatVehicleDeliveryLink.href = 'https://ts.la/app';
        avayaChatVehicleDeliveryLink.innerText = this.avayaChatConfig.triageConfig.vehicleDeliveryLoginLinkText;

        avayaChatVehicleDeliveryLink.addEventListener('click', () => {
            this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.goToAccountInteraction);
        });

        const avayaChatLinksHeading = document.createElement('div');
        avayaChatLinksHeading.classList.add(`tw-chat--${this.chatPrefix}__link-heading`);
        avayaChatLinksHeading.innerHTML = this.avayaChatConfig.triageConfig.additionalDeliveryHeading;

        avayaChatDeliveryFAQWrapper.append(avayaChatScreenHeaderBlock);
        avayaChatDeliveryFAQWrapper.append(avayaChatVehicleDeliveryLink);
        avayaChatDeliveryFAQWrapper.append(avayaChatLinksHeading);
        avayaChatDeliveryFAQWrapper.append(
            this.generateFAQLinks(
                'vehicle-delivery-links',
                this.avayaChatConfig.triageConfig.additionalDeliveryResources,
                '#'
            )
        );

        return avayaChatDeliveryFAQWrapper;
    }

    generateFAQLinks(containerName, associateLinks, needHelpUrl = null) {
        const {
            locale
        } = this.avayaChatConfig;

        const divContainer = document.createElement('div');
        divContainer.setAttribute('id', `div-${containerName}`);

        const ulContainer = document.createElement('ul');
        ulContainer.classList.add('tw-chat--ul-faq-links', 'tw-chat--tds-list');

        let listElement = null;
        let anchorElement = null;

        const FAQLinks = {
            aftertakingdelivery: '/support/after-taking-delivery',
            preparefordelivery: '/support/delivery-day',
            whattoexpectondeliveryday: '/support/taking-delivery',
        };

        Object.entries(associateLinks).forEach(([key, value]) => {
            listElement = document.createElement('li');
            anchorElement = document.createElement('a');
            anchorElement.classList.add('tw-chat--tds-link');
            anchorElement.target = '_blank';

            let normalizedKey = key.replace(/\s/g, '');
            normalizedKey = normalizedKey.toLowerCase();

            if (FAQLinks[normalizedKey]) {
                anchorElement.href = localizeUrl(FAQLinks[normalizedKey], {
                    locale,
                    delimiter: '_'
                });
            } else {
                anchorElement.href = localizeUrl('/support', {
                    locale,
                    delimiter: '_'
                });
            }

            anchorElement.innerText = value;

            anchorElement.addEventListener('click', () => {
                this.avayaAnalyticsHelper.fireEvent(
                    this.avayaAnalyticsHelper.supportInteraction,
                    FAQLinks[key]
                );
            });

            listElement.append(anchorElement);
            ulContainer.append(listElement);
        });

        divContainer.append(ulContainer);

        if (needHelpUrl !== null) {
            const divLinkHeading = document.createElement('p');
            divLinkHeading.classList.add('tw-chat--need-assistance-question');
            divLinkHeading.innerText = this.avayaChatConfig.triageConfig.cantFindAnswer;
            divContainer.append(divLinkHeading);

            // Create link for Can't find answer
            anchorElement = document.createElement('a');
            anchorElement.classList.add(
                'tw-chat--tds-link',
                'tw-chat--lnk-need-assistance',
                `${containerName}--lnk-need-assistance`
            );
            anchorElement.href = needHelpUrl;
            anchorElement.innerText = this.avayaChatConfig.triageConfig.needMoreAssistance;
            divContainer.append(anchorElement);

            anchorElement.addEventListener('click', () => {
                this.avayaAnalyticsHelper.fireEvent(this.avayaAnalyticsHelper.needAssistanceInteraction);
            });
        }

        return divContainer;
    }
}

export default FAQSection;