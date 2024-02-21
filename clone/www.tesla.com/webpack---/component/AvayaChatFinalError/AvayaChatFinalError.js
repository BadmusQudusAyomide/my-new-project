import {
    makeElementInvisible,
    makeElementVisible,
    setAttributes,
} from '../../utils/AvayaChatUtils';

class AvayaChatFinalError {
    constructor(header = '', caption = '') {
        this.header = header;
        this.caption = caption;
    }

    generate() {
        const headerWrapper = document.createElement('h2');
        headerWrapper.style.paddingTop = 'var(--tw-chat--tds-size--1x)';
        headerWrapper.style.fontSize = '24px';
        headerWrapper.style.lineHeight = '28px';
        headerWrapper.style.letterSpacing = '-0.6px';
        headerWrapper.innerText = this.header;

        const captionWrapper = document.createElement('p');
        captionWrapper.style.color = 'var(--base-tokens-grey-30, #5C5E62)';
        captionWrapper.style.fontSize = '12px';
        captionWrapper.style.lineHeight = '18px';
        captionWrapper.innerText = this.caption;

        const mainWrapper = document.createElement('div');
        mainWrapper.style.textAlign = 'center';
        mainWrapper.append(this._getIcon());
        mainWrapper.append(headerWrapper);
        mainWrapper.append(captionWrapper);

        const container = this._getContainer();
        container.append(mainWrapper);

        return container;
    }

    show() {
        makeElementVisible('avaya-chat-final-error');
    }

    hide() {
        makeElementInvisible('avaya-chat-final-error');
    }

    _getContainer() {
        const container = document.createElement('div');
        container.setAttribute('id', 'avaya-chat-final-error');
        container.classList.add('tds--is_invisible');

        // container.classList.add('tw-chat--final-error-container');
        // @TODO: styles are not being compiled thus use inline styling instead
        container.style.position = 'fixed';
        container.style.top = '0px';
        container.style.left = '0px';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'white';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.zIndex = '3';

        return container;
    }

    _getIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        setAttributes(svg, {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 24 24',
            width: '50',
            height: '50',
        });

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        setAttributes(path, {
            fill: '#ED4E3B',
            d: 'M12 3.5c4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5-8.5-3.813-8.5-8.5S7.313 3.5 12 3.5M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.75 11.25v-4.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0zM12 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
        });

        svg.append(path);

        return svg;
    }
}

export default AvayaChatFinalError;