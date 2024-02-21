/* eslint-disable */
class CustomElement extends HTMLElement {
    constructor(props) {
        super();
        if (props && props.shadow) {
            const shadow = this.attachShadow({
                mode: 'open'
            });
            const template = document.createElement('template');
            template.innerHTML = props.shadow;
            shadow.appendChild(template.content.cloneNode(true));
        }
    }
    connectedCallback() {
        this.constructor.observedAttributes &&
            this.constructor.observedAttributes.forEach((attr) => this.upgradeAttribute(attr));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue !== oldValue) {
            this[name] = newValue;
        }
    }
    upgradeAttribute(attr) {
        const attrStr = attr.toString();
        if (this.hasOwnProperty(attr)) {
            const value = this[attr];
            delete this[attr];
            this[attr] = value;
            this.setAttribute(attrStr, String(this[attr]));
        }
    }
}

var customElement = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    CustomElement: CustomElement,
});

function filterChildren(e, el) {
    const targetIsNotNull = e.target !== null;
    const slotMatchesName = e.target && el.slot === e.target.name;
    return targetIsNotNull && slotMatchesName;
}

function handleSlotChange$1(e) {
    if (
        e.target &&
        e.currentTarget &&
        e.target.name &&
        e.currentTarget.host &&
        e.target.name.length > 0
    ) {
        const host = e.currentTarget.host;
        const currentSlot = Array.from(host.children).filter((el) => filterChildren(e, el))[0];
        if (currentSlot instanceof HTMLElement) {
            switch (e.target.name) {
                case 'target':
                    host.target = currentSlot;
                    break;
                case 'contextblock':
                    host.contextblock = currentSlot;
                    break;
            }
        }
    }
}
class ContextBlock extends CustomElement {
    constructor() {
        super({
            shadow: `<slot name="target"></slot><slot name="contextblock"></slot>`,
        });
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('slotchange', handleSlotChange$1);
        }
        if (!this.hasAttribute('aria-role')) this.setAttribute('aria-role', 'dialog');
        if (!this.hasAttribute('aria-live')) this.setAttribute('aria-live', 'polite');
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
        if (!this.hasAttribute('id')) throw new Error('Context component must include an id.');
        this.contextblockId = `${this.id}_contextblock`;
        this.targetId = `${this.id}_target`;
    }
    static get observedAttributes() {
        return ['isModal'];
    }
    disconnectedCallback() {}
    get isModal() {
        var _a;
        const isModal =
            (_a = document.getElementById(this.id)) === null || _a === void 0 ?
            void 0 :
            _a.getAttribute('isModal');
        return isModal === 'true';
    }
    set isModal(isAModal) {}
    get target() {
        return document.getElementById(this.targetId);
    }
    set target(el) {}
    get contextblock() {
        return document.getElementById(this.contextblockId);
    }
    set contextblock(el) {
        var _a;
        const oldBlock = document.getElementById(this.contextblockId);
        if (oldBlock) {
            (_a = oldBlock.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(oldBlock);
        }
        if (el) {
            el.setAttribute('id', this.contextblockId);
            el.setAttribute('aria-describedby', this.targetId);
            document.body.appendChild(el);
            if (this.isHidden) {
                this.hide();
            } else {
                this.show();
            }
        }
    }
    get isHidden() {
        var _a;
        const attr =
            (_a = document.getElementById(this.contextblockId)) === null || _a === void 0 ?
            void 0 :
            _a.getAttribute('hidden');
        return attr === '' || attr === 'true';
    }
    show() {
        console.debug('show', this);
        if (this.contextblock) {
            this.contextblock.setAttribute('hidden', 'false');
            this.contextblock.style.display = 'block';
        }
    }
    hide() {
        console.debug('hide', this);
        if (this.contextblock) {
            this.contextblock.setAttribute('hidden', '');
            this.contextblock.style.display = 'none';
        }
    }
}

var contextBlock = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    filterChildren: filterChildren,
    handleSlotChange: handleSlotChange$1,
    ContextBlock: ContextBlock,
});

// TODO: use ?. when refactoring to typescript to elegantly handle null/undefined dates

/**
 * isSameYear
 * - Matches two dates based on their day/month/year
 * @param {Date} date1 Date to compare
 * @param {Date} date2 Date to compare
 */
const isSameYear = (date1, date2) =>
    !!date1 && !!date2 && date1.getFullYear() === date2.getFullYear();

/**
 * isSameMonth
 * - Matches two dates based on their day/month/year
 * @param {Date} date1 Date to compare
 * @param {Date} date2 Date to compare
 */
const isSameMonth = (date1, date2) =>
    !!date1 && !!date2 && isSameYear(date1, date2) && date1.getMonth() === date2.getMonth();

/**
 * isSameDay
 * - Matches two dates based on their day/month/year
 * @param {Date} date1 Date to compare
 * @param {Date} date2 Date to compare
 */
const isSameDay = (date1, date2) =>
    !!date1 &&
    !!date2 &&
    isSameYear(date1, date2) &&
    isSameMonth(date1, date2) &&
    date1.getDate() === date2.getDate();

/**
 * isFristDayOfMonth
 * - Returns true if this date is the first
 * @param {Date} date Date to compare
 */
const isFristDayOfMonth = (date) => {
    const firstDate = new Date(date);
    firstDate.setDate(1);

    return isSameDay(firstDate, date);
};

/**
 * isLastDayOfMonth
 * - Retuurns true if this date is the last (30th, 31st, or 28th, depending)
 * @param {Date} date Date to compare
 */
const isLastDayOfMonth = (date) => {
    const lastDate = new Date(date);
    // If we don't set the day to start with:
    // Otherwise, if we try to compare May 31st, it'll get set to June 31st (which actually sets July 1st)
    // Then it would set it back to July 1st, and the comparison would return a false negative
    lastDate.setDate(1);

    // Set to the next month
    lastDate.setMonth(date.getMonth() + 1);
    // Set date to zero (first day minus one === last day of this month)
    lastDate.setDate(0);

    return isSameDay(lastDate, date);
};

/**
 * isBetween
 * - Checks if the calendar date falls between two points
 * @param {Date} date Date to compare
 * @param {Date} start Early bound
 * @param {Date} end Late bound
 */
const isBetweenDays = (date, start, end) => {
    if (start && end) {
        date.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return date > start && date < end;
    }

    return false;
};

/**
 * isWeekend
 * - Returns true if date is a Saturday or Sunday
 * - Returns false if date is a weekday
 */
const isWeekend = (date) => !!date && [0, 6].includes(date.getDay());

/**
 * getLocalMonth
 * - Returns a localized month (Eg. "Nov")
 * @param {Date} date Date
 * @param {string} locale locale string in 'en-US' format
 */
const getLocalMonth = (date, locale) =>
    date.toLocaleDateString(locale, {
        month: 'short',
    });

/**
 * getLocalYear
 * - Returns a localized year (Eg. "2020")
 * @param {Date} date Date
 * @param {string} locale locale string in 'en-US' format
 */
const getLocalYear = (date, locale) =>
    date.toLocaleDateString(locale, {
        year: 'numeric',
    });

/**
 * getLocalMonthYear
 * - Returns a localized month and year (Eg. "November 2020")
 * @param {Date} date Date
 * @param {string} locale locale string in 'en-US' format
 */
const getLocalMonthYear = (date, locale) =>
    date.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
    });

/**
 * getLocalDayOfWeek
 * - Returns a localized day of the week (Eg. "T" for Tuesday)
 * @param {Date} date Date
 * @param {string} locale locale string in 'en-US' format
 */
const getLocalDayOfWeek = (date, locale) =>
    date.toLocaleDateString(locale, {
        weekday: 'narrow',
    });

/**
 * getLocalStandardDate
 * - Returns a localized month day and year (Eg. "May 18 2020")
 * @param {Date} date Date
 * @param {string} locale locale string in 'en-US' format
 */
const getLocalStandardDate = (date, locale) =>
    date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

/**
 * getLocalContextualDateRange
 * - Returns a localized date range, with only as much information as is necessary
 * - Eg. May 20 - 25 (if within the same month)
 * - Eg. May 20 - June 7 (if within the same year)
 * - Eg. December 20, 2020 - January 7, 2021 (if different years)
 * @param {Date} start
 * @param {Date} end
 * @param {string} locale locale string in 'en-US' format
 */
const getLocalContextualDateRange = (start, end, locale) => {
    const startString = start.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: !isSameYear(start, end) ? 'numeric' : undefined,
    });

    const endString = end.toLocaleDateString(locale, {
        day: 'numeric',
        month: !isSameMonth(start, end) ? 'long' : undefined,
        year: !isSameYear(start, end) ? 'numeric' : undefined,
    });

    return `${startString} - ${endString}`;
};

/**
 * getDaysArray
 * - Returns a 42 date array representing the 7x6 calendar grid for one month
 * @param {Date} month - The date to build the month around
 * @return {Date[]}
 */
const getDaysArray = (month) => {
    const array = [];

    if (month) {
        // Set the first day for the months-array to the earliest Sunday that would include the start (grid-cell 1)
        const day = new Date(month);
        day.setDate(1);
        day.setDate(1 - day.getDay());

        // Generate flat array for a 7x6 cell calendar grid
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const thisDay = new Date(day);

                array.push(thisDay);
                day.setDate(day.getDate() + 1);
            }
        }
    }

    return array;
};

/**
 * stepMonth
 * - Returns a new date incremented by some number of months
 * @param {Date} date Date
 * @param {Number} increment Number of months to increment +/- by
 */
const stepMonth = (date, increment) => new Date(date.setMonth(date.getMonth() + increment));

/**
 * stepDay
 * - Returns a new date incremented by some number of days
 * @param date {Date} Date
 * @param increment {Number} Number of months to increment +/- by
 */
const stepDay = (date, increment) => new Date(date.setDate(date.getDate() + increment));

/**
 * mapDatesToOptions
 * - Map a list of dates to a list of options
 * @param {Date[]} dates
 * @param {'month' | 'year'} type - Either render the month or year of the given dates
 * @param {string} locale
 * @returns dateOption[] - a list of {value, label, date} formatted options
 */
const mapDatesToOptions = (dates, type = 'year', locale = 'en-US') =>
    dates.map((date) =>
        type === 'month' ?
        {
            date,
            label: getLocalMonth(date, locale),
            value: date.getMonth().toString(),
        } :
        {
            date,
            label: getLocalYear(date, locale),
            value: date.getFullYear().toString(),
        }
    );

var datePicker = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    isSameYear: isSameYear,
    isSameMonth: isSameMonth,
    isSameDay: isSameDay,
    isFristDayOfMonth: isFristDayOfMonth,
    isLastDayOfMonth: isLastDayOfMonth,
    isBetweenDays: isBetweenDays,
    isWeekend: isWeekend,
    getLocalMonth: getLocalMonth,
    getLocalYear: getLocalYear,
    getLocalMonthYear: getLocalMonthYear,
    getLocalDayOfWeek: getLocalDayOfWeek,
    getLocalStandardDate: getLocalStandardDate,
    getLocalContextualDateRange: getLocalContextualDateRange,
    getDaysArray: getDaysArray,
    stepMonth: stepMonth,
    stepDay: stepDay,
    mapDatesToOptions: mapDatesToOptions,
});

const handleSearchListeners = ({
    clearBtn,
    clearInput,
    focusOnHotkey,
    input,
    onValueChange
}) => {
    if (!input || !clearBtn) {
        return () => null;
    }
    const handleWindowKeyDown = (e) => {
        if (focusOnHotkey && (e.key === 'k' || e.key === '/') && e.metaKey) {
            input === null || input === void 0 ? void 0 : input.focus();
        }
    };
    window.addEventListener('keydown', handleWindowKeyDown);
    input.addEventListener('input', onValueChange);
    clearBtn.addEventListener('click', clearInput);
    return () => {
        window.removeEventListener('keydown', handleWindowKeyDown);
        input.removeEventListener('keyup', onValueChange);
        clearBtn.removeEventListener('click', clearInput);
    };
};
const handleSearchExpansion = ({
    collapse,
    collapsible,
    container,
    expand,
    input
}) => {
    if (!input) {
        return () => null;
    }
    const handleExpand = (e) => {
        if (e.type === 'keydown') {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                if (expand) expand();
            }
        } else {
            if (expand) expand();
        }
    };
    const handleCollapse = (e) => {
        if (!input.value) {
            if (!(container === null || container === void 0 ? void 0 : container.contains(e.relatedTarget))) {
                if (collapse) collapse();
            }
        }
    };
    if (collapsible) {
        container === null || container === void 0 ?
            void 0 :
            container.addEventListener('click', handleExpand);
        container === null || container === void 0 ?
            void 0 :
            container.addEventListener('keydown', handleExpand);
        container === null || container === void 0 ?
            void 0 :
            container.addEventListener('focusout', handleCollapse);
    }
    return () => {
        container === null || container === void 0 ?
            void 0 :
            container.removeEventListener('click', handleExpand);
        container === null || container === void 0 ?
            void 0 :
            container.removeEventListener('keydown', handleExpand);
        container === null || container === void 0 ?
            void 0 :
            container.removeEventListener('focusout', handleCollapse);
    };
};
const initSearchInput = (component, props = {}) => {
    const input = component.querySelector('.tds-form-input-search');
    const clearBtn = component.querySelector('.tds-form-input-search-clear');
    const {
        onValueChange: externalOnValueChange
    } = props;
    if (!input || !clearBtn) {
        console.warn(
            'TDS Search Input malformed, requires an input element with .tds-form-input-search'
        );
        return () => null;
    }
    const onValueChange = () => {
        if (input.value) {
            component.dataset.tdsValue = input.value;
        } else {
            delete component.dataset.tdsValue;
        }
        if (externalOnValueChange) externalOnValueChange(input.value);
    };
    const clearInput = () => {
        input.value = '';
        onValueChange();
        input.focus();
    };
    const collapsible =
        component === null || component === void 0 ?
        void 0 :
        component.classList.contains('tds-form-input--collapsed');
    const expand = () => {
        component.classList.remove('tds-form-input--collapsed');
    };
    const collapse = () => {
        component.classList.add('tds-form-input--collapsed');
    };
    const cleanup = handleSearchListeners({
        clearBtn,
        clearInput,
        container: component,
        focusOnHotkey: props.focusOnHotkey || Boolean(component.dataset.focusOnHotkey),
        input,
        onValueChange,
    });
    const expansionCleanup = handleSearchExpansion({
        collapse,
        collapsible,
        container: component,
        expand,
        input,
    });
    return () => {
        cleanup();
        expansionCleanup();
    };
};
const init$c = initSearchInput;
const initSearchInputs = (props = {}) => {
    const {
        parent = document
    } = props;
    const inputs = Array.from(parent.querySelectorAll('.tds-form-input-search'));
    inputs.forEach((input) => {
        const component = input.closest('.tds-form-input');
        if (component) {
            init$c(component, Object.assign({}, props));
        }
    });
};

var formInputSearch = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    handleSearchListeners: handleSearchListeners,
    handleSearchExpansion: handleSearchExpansion,
    initSearchInput: initSearchInput,
    init: init$c,
    initSearchInputs: initSearchInputs,
});

const getValue = (element) =>
    String(
        (element === null || element === void 0 ? void 0 : element.getAttribute('data-tds-value')) ||
        (element === null || element === void 0 ? void 0 : element.getAttribute('data-tds-label'))
    );
const handleListBoxListeners = ({
    container,
    input,
    listbox,
    onActiveDescendantChange,
    onClear,
    onOptionSelect,
}) => {
    var _a;
    if (!listbox) {
        return () => null;
    }
    const handleKeyDown = (e) => {
        var _a, _b, _c, _d, _e, _f;
        const id = String((input || listbox).getAttribute('aria-activedescendant'));
        const activeDescendant = document.getElementById(id);
        let targetId = undefined;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeDescendant) {
                targetId =
                    (_a = activeDescendant.nextElementSibling || listbox.firstElementChild) === null ||
                    _a === void 0 ?
                    void 0 :
                    _a.id;
            } else {
                targetId = (_b = listbox.firstElementChild) === null || _b === void 0 ? void 0 : _b.id;
            }
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (activeDescendant) {
                targetId =
                    (_c = activeDescendant.previousElementSibling || listbox.lastElementChild) === null ||
                    _c === void 0 ?
                    void 0 :
                    _c.id;
            } else {
                targetId = (_d = listbox.lastElementChild) === null || _d === void 0 ? void 0 : _d.id;
            }
        }
        if (e.key === 'Home' || (e.metaKey && e.key === 'ArrowLeft')) {
            targetId = (_e = listbox.firstElementChild) === null || _e === void 0 ? void 0 : _e.id;
        }
        if (e.key === 'End' || (e.metaKey && e.key === 'ArrowRight')) {
            targetId = (_f = listbox.lastElementChild) === null || _f === void 0 ? void 0 : _f.id;
        }
        if ((e.key === 'Enter' || e.key === ' ') && activeDescendant) {
            e.preventDefault();
            onOptionSelect({
                id: activeDescendant.id,
                value: getValue(activeDescendant),
            });
        }
        if (
            ((input === null || input === void 0 ? void 0 : input.type) !== 'search' ||
                (input.type === 'search' && input.value === '')) &&
            e.key === 'Backspace'
        ) {
            if (onClear) onClear();
        }
        if (
            (e.key === 'Tab' && activeDescendant) ||
            (!e.metaKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight'))
        ) {
            targetId = '';
        }
        if (targetId !== undefined) onActiveDescendantChange(targetId);
    };
    (input || listbox).addEventListener('keydown', handleKeyDown);
    const handleBlur = () => {
        onActiveDescendantChange('');
    };
    (input || listbox).addEventListener('blur', handleBlur);
    const handleClick = (e) => {
        var _a;
        const targetOption =
            (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('[role="option"]');
        if (targetOption) {
            const targetValue = getValue(targetOption);
            onOptionSelect({
                e,
                value: targetValue
            });
        }
    };
    listbox.addEventListener('click', handleClick);
    const clearBtn =
        (_a = container || (input === null || input === void 0 ? void 0 : input.parentElement)) ===
        null || _a === void 0 ?
        void 0 :
        _a.querySelector('.tds-dropdown-clear-btn');
    const handleClearClick = () => {
        if (onClear) onClear();
    };
    clearBtn === null || clearBtn === void 0 ?
        void 0 :
        clearBtn.addEventListener('click', handleClearClick);
    return () => {
        (input || listbox).removeEventListener('keydown', handleKeyDown);
        (input || listbox).removeEventListener('blur', handleBlur);
        listbox.removeEventListener('click', handleClick);
        clearBtn === null || clearBtn === void 0 ?
            void 0 :
            clearBtn.removeEventListener('click', handleClearClick);
    };
};
const initListBox = (listbox, props = {}) => {
    var _a;
    const {
        container,
        input,
        onOptionSelect: externalOnOptionSelect,
        searchInput
    } = props;
    const options = Array.from(listbox.querySelectorAll('.tds-listbox-option'));
    const clearBtn =
        (_a = searchInput === null || searchInput === void 0 ? void 0 : searchInput.parentElement) ===
        null || _a === void 0 ?
        void 0 :
        _a.querySelector('.tds-form-input-search-clear');
    const onActiveDescendantChange = (id) => {
        var _a, _b;
        const activeDescendant = document.getElementById(String(id));
        options.forEach((option) => {
            option.classList.remove('tds--focus');
        });
        if (id) {
            activeDescendant === null || activeDescendant === void 0 ?
                void 0 :
                activeDescendant.classList.add('tds--focus');
            activeDescendant === null || activeDescendant === void 0 ?
                void 0 :
                activeDescendant.scrollIntoView({
                    block: 'nearest'
                });
            (_a = searchInput || input || listbox) === null || _a === void 0 ?
                void 0 :
                _a.setAttribute('aria-activedescendant', id);
        } else {
            (_b = searchInput || input || listbox) === null || _b === void 0 ?
                void 0 :
                _b.removeAttribute('aria-activedescendant');
        }
    };
    const onOptionSelect = ({
        e,
        id,
        value
    }) => {
        var _a;
        const activeDescendant =
            listbox.querySelector(`[data-tds-value="${value}"]`) || document.getElementById(String(id));
        const targetOption =
            (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ?
            void 0 :
            _a.closest('[role="option"]');
        const target =
            (e === null || e === void 0 ? void 0 : e.type) === 'click' ? targetOption : activeDescendant;
        const multiple =
            (input === null || input === void 0 ? void 0 : input.multiple) ||
            Boolean(listbox.getAttribute('aria-multiselectable'));
        if (!target || target.getAttribute('role') !== 'option') {
            return;
        }
        const alreadySelected =
            target === null || target === void 0 ? void 0 : target.hasAttribute('aria-selected');
        if (!multiple) {
            clearOptions();
        }
        if (multiple && alreadySelected) {
            target === null || target === void 0 ? void 0 : target.classList.remove('tds--selected');
            target === null || target === void 0 ? void 0 : target.removeAttribute('aria-selected');
        } else {
            target === null || target === void 0 ? void 0 : target.classList.add('tds--selected');
            target === null || target === void 0 ? void 0 : target.setAttribute('aria-selected', 'true');
        }
        if (externalOnOptionSelect) {
            externalOnOptionSelect({
                id,
                value
            });
        }
    };
    const clearOptions = () => {
        options.forEach((option) => {
            option.classList.remove('tds--selected');
            option.removeAttribute('aria-selected');
        });
    };
    const onValueChange = (e) => {
        var _a;
        const value = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.value) || '';
        for (const option of options) {
            if (listbox.contains(option)) {
                listbox.removeChild(option);
            }
        }
        for (const option of options) {
            if (!value || getValue(option).toLowerCase().includes(value.toLowerCase())) {
                listbox.appendChild(option);
            }
        }
        searchInput === null || searchInput === void 0 ?
            void 0 :
            searchInput.removeAttribute('aria-activedescendant');
    };
    const searchCleanup = searchInput ?
        handleSearchListeners({
            clearBtn,
            clearInput: onValueChange,
            input: searchInput,
            onValueChange,
        }) :
        () => null;
    const cleanup = handleListBoxListeners({
        container,
        input: searchInput || input,
        listbox,
        onActiveDescendantChange,
        onClear: clearOptions,
        onOptionSelect,
    });
    return () => {
        searchCleanup();
        cleanup();
    };
};
const init$b = initListBox;
const initListBoxes = (props = {}) => {
    const {
        parent = document
    } = props;
    const components = Array.from(parent.querySelectorAll('.tds-listbox'));
    components.forEach((listbox) => {
        const searchInput = parent.querySelector(`[aria-controls="${listbox.id}"]`);
        init$b(listbox, Object.assign(Object.assign({}, props), {
            searchInput
        }));
    });
};

var listbox = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getValue: getValue,
    handleListBoxListeners: handleListBoxListeners,
    initListBox: initListBox,
    init: init$b,
    initListBoxes: initListBoxes,
});

const handleDropdownInputListeners = ({
    clearInput,
    container,
    input,
    listbox,
    onClick,
    onKeyDown,
    searchInput,
    setExpanded,
    toggleExpanded,
    tooltip,
}) => {
    var _a;
    if (!input || !listbox || !tooltip) {
        return () => null;
    }
    const clearBtn =
        (_a = input.parentElement) === null || _a === void 0 ?
        void 0 :
        _a.querySelector('.tds-form-input-leading .tds-chip .tds-icon-btn');
    if (!container) {
        container = input.closest('.tds-form-input');
    }
    const handleInputKeyDown = (e) => {
        switch (e.key) {
            case ' ':
            case 'ArrowDown':
            case 'ArrowUp':
            case 'Enter':
            case 'Return':
                e.preventDefault();
                setExpanded(true);
                break;
        }
        handleKeyDown(e);
    };
    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'Backspace':
                if (!(searchInput === null || searchInput === void 0 ? void 0 : searchInput.value)) {
                    clearInput();
                }
                break;
            case 'Escape':
                if (!(searchInput === null || searchInput === void 0 ? void 0 : searchInput.value)) {
                    setExpanded(false);
                }
                break;
            case 'Tab':
                setExpanded(false, {
                    autoFocus: false
                });
                break;
        }
        if (onKeyDown) {
            onKeyDown(e);
        }
    };
    input.addEventListener('keydown', handleInputKeyDown);
    searchInput === null || searchInput === void 0 ?
        void 0 :
        searchInput.addEventListener('keydown', handleKeyDown);
    const handleContainerClick = (e) => {
        if (!e.target.closest('button, .tds-tooltip')) {
            toggleExpanded();
        }
        if (onClick) {
            onClick(e);
        }
    };
    container === null || container === void 0 ?
        void 0 :
        container.addEventListener('click', handleContainerClick);
    const handleClearClick = () => {
        clearInput();
    };
    clearBtn === null || clearBtn === void 0 ?
        void 0 :
        clearBtn.addEventListener('click', handleClearClick);
    const handleWindowClick = (e) => {
        if (!(container === null || container === void 0 ? void 0 : container.contains(e.target))) {
            setExpanded(false);
        }
    };
    if (tooltip.classList.contains('tds-tooltip--open')) {
        window.addEventListener('click', handleWindowClick);
    }
    const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.attributeName === 'class' && tooltip.classList.contains('tds-tooltip--open')) {
                window.addEventListener('click', handleWindowClick);
            } else {
                window.removeEventListener('click', handleWindowClick);
            }
        }
    });
    observer.observe(tooltip, {
        attributes: true
    });
    return () => {
        input.removeEventListener('keydown', handleInputKeyDown);
        container === null || container === void 0 ?
            void 0 :
            container.removeEventListener('click', handleContainerClick);
        clearBtn === null || clearBtn === void 0 ?
            void 0 :
            clearBtn.removeEventListener('click', handleClearClick);
        window.removeEventListener('click', handleWindowClick);
        observer.disconnect();
    };
};
const initDropdownInput = (component) => {
    const input = component.querySelector('.tds-form-input-dropdown');
    const searchInput = component.querySelector('.tds-form-input-search');
    const listbox = component.querySelector('.tds-listbox');
    const tooltip = component.querySelector('.tds-tooltip');
    const leadingChip = component.querySelector('.tds-form-input-leading .tds-chip');
    const trailingIcon = component.querySelector('.tds-form-input-trailing .tds-icon');
    if (!input || !listbox || !tooltip || !leadingChip) {
        console.warn(
            'TDS Dropdown Input malformed, requires at minimum, an input, a tooltip, and a listbox'
        );
        return;
    }
    const {
        multiple
    } = input;
    const setExpanded = (expand, options = {}) => {
        const {
            autoFocus = true
        } = options;
        if (expand) {
            tooltip.classList.remove('tds-tooltip--closed');
            tooltip.classList.add('tds-tooltip--open');
            trailingIcon === null || trailingIcon === void 0 ?
                void 0 :
                trailingIcon.classList.add('tds-icon--flip-x');
            if (autoFocus) searchInput === null || searchInput === void 0 ? void 0 : searchInput.focus();
        } else {
            tooltip.classList.remove('tds-tooltip--open');
            tooltip.classList.add('tds-tooltip--closed');
            trailingIcon === null || trailingIcon === void 0 ?
                void 0 :
                trailingIcon.classList.remove('tds-icon--flip-x');
            if (autoFocus) input === null || input === void 0 ? void 0 : input.focus();
        }
    };
    const toggleExpanded = (options = {}) => {
        if (tooltip.classList.contains('tds-tooltip--open')) {
            setExpanded(false, options);
        } else {
            setExpanded(true, options);
        }
    };
    const clearInput = () => {
        input.value = '';
        renderLeading();
        if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    };
    const onOptionSelect = ({
        value
    }) => {
        if (multiple || Array.isArray(value)) {
            const prevSelected = input.value !== '' ? input.value.split(',') : [];
            input.value = prevSelected.find((name) => name === value) ?
                prevSelected.filter((name) => name !== value).toString() :
                [...prevSelected, value].toString();
        } else {
            input.value = (value === input.value ? '' : value) || '';
            setExpanded(false);
        }
        renderLeading();
    };
    const renderLeading = () => {
        const close = leadingChip.querySelector('.tds-icon-btn');
        let text = leadingChip.querySelector('.tds-chip-text');
        if (!text) {
            text = document.createElement('span');
            text.classList.add('tds-chip-text');
            leadingChip.prepend(text);
        }
        if (input.value === '') {
            text.innerText = input.placeholder;
            leadingChip.classList.add('tds-placeholder');
            close === null || close === void 0 ? void 0 : close.style.setProperty('display', 'none');
        } else {
            const selected = input.value.split(',');
            if (selected.length === 1) {
                text.innerText = input.value;
                leadingChip.classList.remove('tds-placeholder');
                close === null || close === void 0 ? void 0 : close.style.setProperty('display', 'none');
            }
            if (selected.length > 1) {
                text.innerText = `${selected.length} Selected`;
                leadingChip.classList.remove('tds-placeholder');
                close === null || close === void 0 ? void 0 : close.style.removeProperty('display');
            }
        }
    };
    const cleanup = handleDropdownInputListeners({
        clearInput,
        container: component,
        input,
        listbox,
        searchInput,
        setExpanded,
        toggleExpanded,
        tooltip,
    });
    const searchCleanup = initSearchInput(component);
    const listBoxCleanup = initListBox(listbox, {
        container: component,
        input,
        multiple,
        onOptionSelect,
        searchInput,
    });
    return () => {
        cleanup();
        searchCleanup();
        listBoxCleanup();
    };
};
const init$a = initDropdownInput;
const initDropdownInputs = (props = {}) => {
    const {
        parent = document
    } = props;
    const inputs = Array.from(parent.querySelectorAll('.tds-form-input-dropdown'));
    inputs.forEach((input) => {
        const component = input.closest('.tds-form-input');
        if (component) {
            initDropdownInput(component);
        }
    });
};

var formInputDropdown = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    handleDropdownInputListeners: handleDropdownInputListeners,
    initDropdownInput: initDropdownInput,
    init: init$a,
    initDropdownInputs: initDropdownInputs,
});

/** Shared Utility functions */
/**
 * This prevents the file input onChange from firing twice when we set the files
 * When changing the input.files attribute, safari fires the event again. Chrome does not.
 * Here we temporarily stop listening to the change event while we set the files.
 *
 * @param {*} dataTransfer data transfer object
 * @param {*} input html input element
 */
const setInputFiles = (dataTransfer, input) => {
    if (!dataTransfer) {
        return;
    }
    input.onchange = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
    };
    input.files = dataTransfer.files;
    input.onchange = null;
};

/**
 * Check if the browser supports calling a new Datatransfer object with a constructor
 * @returns boolean
 */
const isDataTransferSupported = () => {
    try {
        new DataTransfer();
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Used to change a file input's value. File input uses a FileList, which is immuatable. However
 * the file input also supports setting the value to a dataTransfer object. Here we provide a dataTransfer
 * object, the option to exclude a file given a list of files, as well as limiting the number of files a
 * user can select, and a limit to an file size (bytes)
 *
 * @param {*} files file list object
 * @param {*} fileNameToExclude optional name of a file to remove from the list
 * @param {*} options Object, {maxFileSize: Number of bytes, maxFiles: integer}
 * @returns DataTransfer, array of errors: {type: MAX_FILES|MAX_SIZE, string[]}, fileNames: string[]
 */
const setDataTransfer = (files, options = {}, fileNameToExclude) => {
    const dataTransfer = isDataTransferSupported() ? new DataTransfer() : null;
    const selectedFiles = Array.from(files);
    let fileNames = [];
    let errors = null;

    if (options.maxFiles && selectedFiles.length > options.maxFiles) {
        // Add an error with the remaining files noting them as rejected;
        if (!errors) {
            errors = {};
            errors.maxFilesExceeded = selectedFiles.slice(options.maxFiles).map((file) => file.name);
        }

        // modify the files so we only check the sizes on the ones we're accepting
        selectedFiles.splice(options.maxFiles);
    }

    // Input.files is not an array, so we need to do extra magic
    // if fileNameToExclude is set, that file will not be included in the data transfer object
    // which is how we handle the "remove" action from a file list.
    selectedFiles.forEach((file) => {
        if (options.maxFileSize && file.size > options.maxFileSize) {
            if (!errors) {
                errors = {};
            }

            if (!errors.maxFileSizeExceeded) {
                errors.maxFileSizeExceeded = [file.name];
                return;
            }

            errors.maxFileSizeExceeded.push(file.name);
            return;
        }

        if (file.name !== fileNameToExclude) {
            dataTransfer && dataTransfer.items.add(file);
            dataTransfer && fileNames.push(file.name);
        }
    });

    if (!dataTransfer) {
        fileNames = Array.from(files).map((f) => f.name);
    }

    return {
        dataTransfer,
        errors,
        fileNames,
    };
};

/**
 * Returns a default message when an error occurs
 * @param {*} required
 * @returns default message: `An error occurred attaching a file`
 */
const renderDefaultError = () => `An error occurred attaching a file`;

/** Utility Functions */
/**
 * Removes children of an element
 *
 * @param {*} el parent HTML element
 * @returns element with empty contents
 */
const clearContents = (el) => {
    [...el.children].map((node) => {
        el.removeChild(node);
    });
    return el;
};

/**
 * Renders an SVG with the corresponding use element
 *
 * @param {*} icon icon classname
 * @param {*} options {small: boolean}
 * @returns
 */
const renderIconSvg = (icon, options, path = '') => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.classList.add(...['tds-icon', options.small && 'tds-icon--small', icon]);
    svg.setAttribute('aria-hidden', true);
    use.setAttribute('href', `${path}#${icon}`);
    svg.appendChild(use);
    return svg;
};

/**
 * Dispatches a custom event from a target element
 *
 * @param {*} element element to dispatch the event from
 * @param {*} event name of the event
 * @param {*} detail value of event detail
 */
const dispatchCustomEvent = (element, event, detail) => {
    const customEvent = new CustomEvent(event, {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail,
    });

    element.dispatchEvent(customEvent);
};

/** File Upload Component Functions */
/**
 *
 * @param {*} fileInput the html file input
 * @param {*} error the kind of error
 * @param {*} defaultError a default error message
 * @returns a string error message
 */
const handleErrorMessage = (fileInput, error, defaultError) => {
    if (error.maxFileSizeExceeded) {
        return fileInput.dataset.onMaxFileSizeExceeded || defaultError;
    }
    if (error.maxFilesExceeded) {
        return fileInput.dataset.onMaxFilesExceeded || defaultError;
    }
    return defaultError;
};

/**
 * render associated file errors
 * @param {*} fileInput HTML File input element
 * @param {*} error error object containing {maxFileSizeExceeded, maxFilesExceeded}
 * @returns null
 */
const renderFileErrors = (fileInput, error, iconRenderer) => {
    const formItem = fileInput.closest('.tw-chat--tds-form-item');
    const formInput = fileInput.closest('.tw-chat--tds-form-input');

    let formFeedbackWrap = formItem.querySelector('.tw-chat--tds-form-feedback');
    if (!formFeedbackWrap) {
        formFeedbackWrap = document.createElement('div');
        formFeedbackWrap.classList.add('tw-chat--tds-form-feedback', 'tw-chat--tds-form-feedback-file');
        formItem.insertBefore(formFeedbackWrap, formInput);
    }

    let formFeedback = formItem.querySelector('.tw-chat--tds-form-feedback-text');
    if (!formFeedback) {
        formFeedback = document.createElement('div');
        formFeedback.classList.add('tw-chat--tds-form-feedback-text');
        formFeedbackWrap.appendChild(formFeedback);
    }
    // Clear existing errors
    clearContents(formFeedback);

    // If we don't have errors, remove the outer item error class
    if (!error) {
        formItem.classList.remove('tw-chat--tds-form--error');
        if (formFeedbackWrap) formItem.removeChild(formFeedbackWrap);
        return;
    }
    // Now that we know we have errors, add the outer error class
    formItem.classList.add('tw-chat--tds-form--error');

    // Make a fragment to contain the error, figure out what kind of error it is,
    // find the appropriate message from the input's data attributes
    // store that text in the error text span
    const fragment = document.createDocumentFragment();
    const statusIcon = iconRenderer('tds-icon-error-small-filled', {
        small: true
    });
    const errorText = document.createElement('span');
    errorText.textContent = handleErrorMessage(fileInput, error, renderDefaultError());

    fragment.appendChild(statusIcon);
    fragment.appendChild(errorText);
    formFeedback.appendChild(fragment);
};

/**
 * Generates a file list item with a remove button
 *
 * @param {*} fileInput HTML File input
 * @param {*} name name of the file to render
 * @returns a List element with the correct markup and close button
 */
const fileListItem = (fileInput, name, iconRenderer) => {
    const li = document.createElement('li');
    li.classList.add('tds-list-item--file');

    const fileNameText = document.createElement('span');
    fileNameText.textContent = name;
    li.appendChild(fileNameText);

    // DataTransfer is required to be able to remove a file from the file input
    if (fileInput.dataset.dtSupported) {
        const closeIcon = iconRenderer('tds-icon-close-small', {
            small: true
        });
        const removeFileButton = document.createElement('button');
        removeFileButton.appendChild(closeIcon);

        removeFileButton.addEventListener('click', () => {
            dispatchCustomEvent(fileInput, 'file-item-removed', {
                name
            });
            setFileList(fileInput, fileInput.files, name, iconRenderer);
        });

        li.appendChild(removeFileButton);
    }

    return li;
};

/**
 * renderFileList checks for the file list markup first and creates it if needed
 * @param {*} fileInput the HTML File input element
 * @param {*} fileNames file names to render
 */
const renderFileList = (fileInput, fileNames, iconRenderer) => {
    const formItem = fileInput.closest('.tw-chat--tds-form-item');
    const formInput = fileInput.closest('.tw-chat--tds-form-input');

    // check if the file upload has a tds list. if not create it
    let formLabelFiles = formItem.querySelector('.tds-form-label-files');
    if (!formLabelFiles) {
        formLabelFiles = document.createElement('div');
        formLabelFiles.classList.add('tw-chat--tds-form-label');
        formLabelFiles.classList.add('tw-chat--tds-form-label-files');
        formItem.insertBefore(formLabelFiles, formInput);
    }

    // check if the file upload has a tds list. if not create it
    let filesList = formItem.querySelector('.tw-chat--tds-form-label-files > .tds-list');
    if (!filesList) {
        filesList = document.createElement('ul');
        filesList.classList.add('tds-list');
        formLabelFiles.appendChild(filesList);
    }

    // clear the current list
    clearContents(filesList);

    // create a new list fragment with the file list items
    const itemsFragment = fileNames.reduce((fragment, name) => {
        fragment.appendChild(fileListItem(fileInput, name, iconRenderer));
        return fragment;
    }, document.createDocumentFragment());

    // append the items
    filesList.appendChild(itemsFragment);
};

/**
 * setFileList handles setting the actual input.files data on the file input element
 * @param {*} fileInput HTML File input element
 * @param {*} files an array of File objects
 * @param {*} fileNameToExclude optional name to exclude list updates (removes the item)
 */
const setFileList = (fileInput, files, fileNameToExclude, iconRenderer) => {
    const maxFileSize = parseInt(fileInput.dataset.maxFileSize) || undefined;
    const maxFiles = parseInt(fileInput.dataset.maxFiles) || undefined;

    const {
        dataTransfer,
        errors,
        fileNames
    } = setDataTransfer(
        files, {
            maxFileSize,
            maxFiles
        },
        fileNameToExclude
    );

    // sets the files on the input to the dataTransfer object
    setInputFiles(dataTransfer, fileInput);

    // renders the actual items
    renderFileList(fileInput, fileNames, iconRenderer);

    // renders any feedback errors (maxFileSize or maxFiles exceeded)
    renderFileErrors(fileInput, errors, iconRenderer);

    // dispatches a custom event when the list changes.
    if (dataTransfer) {
        dispatchCustomEvent(fileInput, 'file-list-changed', {
            errors,
            files: dataTransfer.files,
        });
    }
};

/**
 * Inits a file upload component with a classname of tds-file-input
 * @param {*} component a tds-form-item--file-upload that includes a file input
 *
 * Wraps the HTML File input with a listener to manage updating the file list
 * listens for custom event to keep the associated file list in sync with the input's file list
 */
const initFileUploadInput = (input, props) => {
    if (!input) {
        console.warn('TDS Form Input malformed, requires an input element within each .tw-chat--tds-form-input');
        return;
    }

    if (isDataTransferSupported()) {
        input.setAttribute('data-dt-supported', true);
    }
    // we use this to track files that are appended in multi-file upload
    // by default, even with multiple file selection, it will clear it
    // but instead we want to be able to append files
    let files = [];

    // here we can set the full path of the icons if we are not inlining the icon spritemap.svg
    const iconRenderer = (icon, options) => renderIconSvg(icon, options, props.iconPath);

    const onInputChange = (e) => {
        const newFiles = Array.from(e.target.files || []);

        // If this is a single file upload only take one file
        if (!e.target.hasAttribute('multiple')) {
            setFileList(e.target, newFiles, null, iconRenderer);
            return;
        }

        // This ensures we are not adding two files with the same name
        const updatedFiles = [...files, ...newFiles].filter(
            (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        );

        setFileList(e.target, updatedFiles, null, iconRenderer);
    };

    const onFileItemRemoved = (e) => {
        const index = files.findIndex((f) => f.name === e.detail.name);
        files.splice(index, 1);
    };

    // sync the components' files list with the custom event
    const onFileListChanged = (e) => {
        files = [...e.detail.files];
    };

    input.addEventListener('change', onInputChange);
    input.addEventListener('file-list-changed', onFileListChanged);
    input.addEventListener('file-item-removed', onFileItemRemoved);
};

const init$9 = initFileUploadInput;

/**
 * init (File Upload)
 * - initialize js functionality for all instances of component within a space
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onChange - callback, called when files are added or removed from the files list
 * @param {function} props.iconPath - supply the full path to the icon spritemap.svg if you are single-origin hosting the icon spritemap
 */
const initFileUploadInputs = (props = {}) => {
    const {
        parent = document
    } = props;
    const inputs = [...parent.querySelectorAll('.tds-form-input-file-upload')];

    inputs.forEach((input) => {
        init$9(input, props);
    });
};

var formInputFileUpload = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    setInputFiles: setInputFiles,
    isDataTransferSupported: isDataTransferSupported,
    setDataTransfer: setDataTransfer,
    renderDefaultError: renderDefaultError,
    clearContents: clearContents,
    renderIconSvg: renderIconSvg,
    dispatchCustomEvent: dispatchCustomEvent,
    handleErrorMessage: handleErrorMessage,
    renderFileErrors: renderFileErrors,
    fileListItem: fileListItem,
    renderFileList: renderFileList,
    setFileList: setFileList,
    initFileUploadInput: initFileUploadInput,
    init: init$9,
    initFileUploadInputs: initFileUploadInputs,
});

/**
 * init (Form Input Password)
 * - initialize js functionality for component
 * @param {HTMLElement} component - Component to init
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {function} props.onToggle - callback, called when the input is toggled between types
 */
const initPasswordInput = (component, props = {}) => {
    const {
        onToggle
    } = props;
    const input = component.querySelector('.tw-chat--tds-form-input-password');
    const toggle = component.parentElement.querySelector('.tw-chat--tds-form-input-trailing button');
    const icon = component.parentElement.querySelector('.tds-icon-eye');
    const use = icon.querySelector('use');

    if (!toggle || !icon || !use) {
        console.warn(
            'TDS Password input does not have the proper vanilla html structure. See the docs for example usage'
        );
    }

    toggle.addEventListener('click', () => {
        const visible = input.getAttribute('type') === 'text';
        // used to keep the base of the use link incase the consumer doesn't embed the spritesheet svg
        const useHref = use.getAttribute('href');

        // If visible, convert to password mode, otherwise, make visible
        if (visible) {
            input.setAttribute('type', 'password');
            icon.classList.add('tds-icon-eye--off');
            use.setAttribute('href', useHref.replace(/#.*$/, '#tds-icon-eye-off'));
        } else {
            input.setAttribute('type', 'text');
            icon.classList.remove('tds-icon-eye--off');
            use.setAttribute('href', useHref.replace(/#.*$/, '#tds-icon-eye'));
        }

        if (onToggle) onToggle(!visible);
    });
};

const init$8 = initPasswordInput;

/**
 * init (Form Input Password)
 * - initialize js functionality for all instances of component within a space
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onToggle - callback, called when the input is toggled between types
 */
const initPasswordInputs = (props = {}) => {
    const {
        parent = document
    } = props;
    const inputs = [...parent.querySelectorAll('.tw-chat--tds-form-input-password')];

    inputs.forEach((component) => {
        init$8(component.closest('.tw-chat--tds-form-input'), props);
    });
};

var formInputPassword = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initPasswordInput: initPasswordInput,
    init: init$8,
    initPasswordInputs: initPasswordInputs,
});

/**
 * getFormLabelRangeCaption
 * - based on data attributes provided, generate the caption element and necessary calculations
 * @param prefix {String} string to prepend the calculated value to
 * @param suffix {String} string to append to the calculated value
 * @param percentage {Boolean} Should percentage value be shown or not
 * @param input {Object} input object providing values for calculations
 * @returns {string} - Formatted caption string
 */
const getFormLabelRangeCaption = (prefix = '', suffix = '', percentage = false, input) => {
    let {
        value = ''
    } = input;

    const valueString = `${prefix}${value}${suffix}`;
    const percentageString = percentage ? ` (${getPercentage(input)})` : '';

    return `${valueString}${percentageString}`;
};

/**
 * getPercentage
 * - Given an input, provide a calculation
 * - Math calculations from CSS Tricks (because of course):
 * - https://css-tricks.com/value-bubbles-for-range-inputs/
 * @param input {HTMLInputElement | {min, max, value}} the input used to derive values from, or an arbitrary min/max/value as an object
 * @returns {string} - Formatted percentage as a string
 */
const getPercentage = (input, places) => {
    // HTMLInputElement defaults these values to empty strings, so match for passed in data
    let {
        max = '', min = '', value = ''
    } = input;

    // Convert values to integers to work with
    min = min === '' ? 0 : parseFloat(min);
    max = max === '' ? 100 : parseFloat(max);
    value = value === '' ? 50 : parseFloat(value);
    places = places ? places : 2;

    // Get percentage
    const number = (((value - min) * 100) / (max - min)).toFixed(places);

    return isNaN(number) ? '0%' : `${number}%`;
};

/**
 * getRangeValues
 * @param {HTMLInputElement} input - the element to retrieve values from
 * @param {number} toFixed - the number of decimal places allowed in the returned decimal
 * @returns {{min: number, max:number, value: number, dec: number}}
 */
function getRangeValues(input) {
    let min = input.min || input.getAttribute('aria-valuemin') || input.getAttribute('min');
    let max = input.max || input.getAttribute('aria-valuemax') || input.getAttribute('max');
    let value = input.value || input.getAttribute('aria-valuenow') || input.getAttribute('value');
    // Convert values to integers to work with
    if (!min || min === '') min = '0';
    if (!max || max === '') max = '100';
    if (!value || value === '') value = '50';

    min = parseFloat(min);
    max = parseFloat(max);
    value = parseFloat(value);
    let dec = (value - min) / (max - min);
    if (isNaN(dec)) dec = 0;

    return {
        dec,
        max,
        min,
        value,
    };
}

/**
 * init (Form Input Range)
 * - initialize js functionality for component
 * @param {HTMLInputElement} component - Component to update
 * @param {number} value - new value to update the
 */
function updateRangeSliderHTMLState(input) {
    const parent = input.closest('.tds-form-item');
    const caption = parent && parent.querySelector('.tw-chat--tds-form-caption');
    const {
        dec,
        max,
        min,
        value
    } = getRangeValues(input);
    const percent = (100 * dec).toFixed(2);

    /* Webkit fix for range slider */
    input.style.setProperty('--tds-form-input-range--progress-width', `${percent}%`);
    // parent.style.setProperty('--tds-range-progress-fill', `${percent}%`);

    if (caption) {
        const {
            tdsPercentage,
            tdsPrefix,
            tdsSuffix
        } = caption.dataset || {};
        caption.innerHTML = getFormLabelRangeCaption(tdsPrefix, tdsSuffix, tdsPercentage, input);
    }

    input.value = `${value}`;
    input.min = `${min}`;
    input.max = `${max}`;
    input.setAttribute('value', `${value}`);
    input.setAttribute('aria-valuenow', `${value}`);
    input.setAttribute('aria-valuemin', `${min}`);
    input.setAttribute('aria-valuemax', `${max}`);
}

/**
 * init (Form Input Range)
 * - initialize js functionality for component
 * @param {HTMLInputElement} component - Component to init
 * @param {Object} [props] - Props to pass directly to the initialized component
 * @param {function} [props.onChange] - callback, called when an input's value changes
 * @param {boolean} [props.beta] - callback, called when an input's value changes
 */
const initRangeInput = (component, props = {}) => {
    const {
        beta,
        onChange
    } = props;
    if (beta) {
        updateRangeSliderHTMLState(component);

        component.addEventListener('change', (e) => {
            updateRangeSliderHTMLState(e.currentTarget);
        });
        component.addEventListener('input', (e) => {
            updateRangeSliderHTMLState(e.currentTarget);
        });
    } else {
        const parent = component.closest('.tw-chat--tds-form-item');
        const caption =
            (parent && parent.querySelector('.tw-chat--tds-form-label .tw-chat--tds-form-caption')) || undefined;
        // TODO: make more flexible
        const {
            tdsPercentage,
            tdsPrefix,
            tdsSuffix
        } = (caption || {}).dataset || {};
        // Update fill & caption values
        const updateProgressState = (value) => {
            let newPercent = getPercentage(component);

            if (value && typeof value === 'number') {
                component.setAttribute('value', parseFloat(value));
            }

            /* ARIA */
            if (value !== component.value) {
                component.setAttribute('aria-valuenow', component.value);
                value = component.value;
            }
            if (component.getAttribute('min') !== component.min) {
                component.setAttribute('aria-valuemin', component.min);
            }
            if (component.getAttribute('max') !== component.max) {
                component.setAttribute('aria-valuemax', component.max);
            }

            /* Webkit fix for range slider */
            component.style.setProperty('--tds-form-input-range--progress-width', newPercent);
            // parent.style.setProperty('--tds-form-input-range--progress-width', newPercent);

            if (caption)
                caption.innerHTML = getFormLabelRangeCaption(
                    tdsPrefix,
                    tdsSuffix,
                    tdsPercentage,
                    component
                );
        };

        updateProgressState();

        component.addEventListener('change', (e) => {
            updateProgressState();
            if (onChange) onChange(e);
        });
        component.addEventListener('input', (e) => {
            updateProgressState();
            if (onChange) onChange(e);
        });
    }

    return component;
};

const init$7 = initRangeInput;

/**
 * init (Form Input Range)
 * - initialize js functionality for all instances of component within a space
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onChange - callback, called when an input's value changes
 */
const initRangeInputs = (props = {}) => {
    const {
        parent = document
    } = props;
    const inputs = [...parent.querySelectorAll('.tw-chat--tds-form-input-range')];

    inputs.forEach((component) => {
        init$7(component, props);
    });
};

var formInputRange = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getFormLabelRangeCaption: getFormLabelRangeCaption,
    getPercentage: getPercentage,
    getRangeValues: getRangeValues,
    updateRangeSliderHTMLState: updateRangeSliderHTMLState,
    initRangeInput: initRangeInput,
    init: init$7,
    initRangeInputs: initRangeInputs,
});

const initFormInput = (component) => {
    const input = component.querySelector('input, select, textarea');
    const selectOnFocus = component.hasAttribute('data-select-on-focus');
    if (!input) {
        console.warn('TDS Form Input malformed, requires an input element within each .tw-chat--tds-form-input');
        return;
    }
    const handleClick = (e) => {
        var _a;
        if (!e.target.closest('button, .tds-tooltip')) {
            input.focus();
            if (
                document &&
                selectOnFocus &&
                input instanceof HTMLInputElement &&
                !((_a = document.getSelection()) === null || _a === void 0 ? void 0 : _a.toString().length)
            ) {
                input.select();
            }
        }
    };
    component.addEventListener('click', handleClick);
    return () => {
        component.addEventListener('click', handleClick);
    };
};
const init$6 = initFormInput;
const initFormInputs = (props = {}) => {
    const {
        parent = document
    } = props;
    const components = Array.from(parent.querySelectorAll('.tw-chat--tds-form-input.tw-chat--tds-form-input--default'));
    components.forEach((component) => {
        init$6(component);
    });
};

var formInput = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initFormInput: initFormInput,
    init: init$6,
    initFormInputs: initFormInputs,
});

/**
 * positionIconBadge calculates the position of the text and badge
 *
 * @param {*} options object passed through through initBadge
 * @returns an object with all of the positioning details to position
 * the badge and badge text
 */
const positionIconBadge = (options) => {
    const {
        blockSize,
        dir,
        fontSize,
        iconWidth,
        label,
        positionOverride = {
            x: 0,
            y: 0
        }
    } = options;

    // This works like negative margin-block-end, margin-block-start to position
    // The badge outside of the icon boundary, up/left or up/right depending on dir
    // There is also the ability for the consumer to nudge via positionOverride.
    const offset = {
        x: -1 - positionOverride.x,
        y: 0 - positionOverride.y
    };
    const centerX = iconWidth / 2;
    const fontSizeCenter = fontSize / 2;

    // Everything we need to position the badge relative to the icon
    const position = {
        height: 0,
        mode: null,
        textX: 0,
        textY: 0,
        width: 0,
        x: 0,
        y: 0,
    };

    // This will cause the text not to render, and the icon mask to be fully open
    if (!label || label === 'false') {
        return position;
    }

    if (label.toString() === 'true') {
        // If we pass "true" in the data attribute, it will render the dot
        position.mode = 'dot';
        position.width = fontSize;
        position.height = fontSize;
        position.x =
            dir === 'rtl' ?
            centerX - fontSize - fontSizeCenter - positionOverride.x :
            centerX + fontSizeCenter + positionOverride.x;
    } else {
        // Otherwise, it will render numerically. Rendering zero is supported.
        position.mode = 'numeric';
        offset.x = 3 - label.length;
        offset.y = 3;
        position.width = Math.max(blockSize, label.length * fontSize);
        position.height = blockSize;
        position.x =
            dir === 'rtl' ?
            centerX - position.width - offset.x - positionOverride.x :
            centerX + offset.x + positionOverride.x;
    }

    position.y = -offset.y - positionOverride.y;

    // Assumes the text element uses `dominant-baseline:auto` (default),
    position.textY = position.y + position.height / 2 + fontSizeCenter - 1;

    // Assumes use of text-anchor:middle to center the text horizontally
    position.textX = position.x + position.width / 2;

    return position;
};

/**
 * applyIconBadge
 *
 * @param {*} icon an SVG with a tds-icon-badge class
 * @param {*} options options object with fontSize, Id, label, blockSize, dir
 */
const applyIconBadge = (icon, options) => {
    const {
        fontSize,
        iconHeight,
        iconWidth,
        id,
        label
    } = options;

    // get the positioning stuff we need for the badge shape and the text
    const {
        height,
        mode,
        textX,
        textY,
        width,
        x,
        y
    } = positionIconBadge(options);

    const xmlns = 'http://www.w3.org/2000/svg';
    const maskId = `${id}-mask`;
    icon.setAttribute('overflow', 'visible');
    icon.setAttribute('viewBox', '0 0 24 24');

    // This performs a check to see if we're initializing the icon, or if the init
    // function is called again. When initializing, we grab the icon's contents and
    // plug them into the masked group. If the masked group exists, we grab the contents
    // of the group, and store it. That was were not putting a group in a group.
    const maskedIcon = icon.querySelector(`g[mask='url(#${maskId})']`);
    const childIconNodes = maskedIcon ? maskedIcon.childNodes : icon.childNodes;
    const iconChildren = [...childIconNodes].map((c) => c.cloneNode(true));

    // Clears the contents
    icon.replaceChildren();

    // We use this as the shape for the badge
    const badgeRect = document.createElementNS(xmlns, 'rect');
    badgeRect.setAttribute('x', x);
    badgeRect.setAttribute('rx', height / 2);
    badgeRect.setAttribute('y', y);
    badgeRect.setAttribute('width', width);
    badgeRect.setAttribute('height', height);
    badgeRect.setAttribute('fill', 'var(--tds-badge--color, #3e6ae1)');

    // Clone it, and draw a border around it to get the notch
    const notchRect = badgeRect.cloneNode(true);
    notchRect.setAttribute('stroke', '#000');
    notchRect.setAttribute('stroke-width', '3');
    notchRect.setAttribute('fill', '#000');

    // Keep everything in the icon by using a big white rectangle
    // The notch is set to black which creates the hidden segment
    const maskRect = document.createElementNS(xmlns, 'rect');
    maskRect.setAttribute('x', 0);
    maskRect.setAttribute('y', 0);
    maskRect.setAttribute('width', iconWidth);
    maskRect.setAttribute('height', iconHeight);
    maskRect.setAttribute('fill', '#fff');

    // Put the mask stuff in defs
    const defs = document.createElementNS(xmlns, 'defs');
    const mask = document.createElementNS(xmlns, 'mask');
    mask.setAttribute('id', maskId);
    mask.appendChild(maskRect);
    mask.appendChild(notchRect);
    defs.appendChild(mask);

    // Create a group for the icon and text
    const badgeGroup = document.createElementNS(xmlns, 'g');
    badgeGroup.appendChild(badgeRect);

    // Copy the icon into the icon group, mask it,
    const iconGroup = document.createElementNS(xmlns, 'g');
    iconGroup.setAttribute('mask', `url(#${maskId})`);
    iconGroup.append(...iconChildren);

    // If we're in numerical mode, drop the text on top of the
    // badge shape in the badge group
    if (mode === 'numeric') {
        const text = document.createElementNS(xmlns, 'text');
        text.textContent = label;
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', `${fontSize}px`);
        text.setAttribute('fill', `var(--tds-badge--text-color, #fff)`);
        badgeGroup.appendChild(text);
    }

    // Append the defs, icon, and badge in order (SVG bottom-to-top)
    icon.appendChild(defs);
    icon.appendChild(iconGroup);
    icon.appendChild(badgeGroup);
};

const initIconBadge = (icon, props) => {
    const label = icon.getAttribute('data-badge-label');
    const offsetOverrideX = icon.getAttribute('data-offset-x') || 0;
    const offsetOverrideY = icon.getAttribute('data-offset-y') || 0;
    const iconWidth = icon.getBoundingClientRect().width;
    const iconHeight = icon.getBoundingClientRect().height;
    const id = icon.getAttribute('id');
    const dir = icon.getAttribute('dir') || 'ltr';

    if (!id) {
        console.warn('No id found in', icon);
    }

    const options = Object.assign({}, props, {
        blockSize: 12,
        dir,
        fontSize: 8,
        iconHeight,
        iconWidth,
        id,
        label,
        positionOverride: {
            x: parseInt(offsetOverrideX),
            y: parseInt(offsetOverrideY),
        },
    });

    // Grab the svg inside of the badge, copy it, and pass it to applyIconBadge
    // to wrap, mask, and apply the badge shape
    applyIconBadge(icon, options);
};

const init$5 = initIconBadge;

/**
 * initIconBadges
 *
 * Applies a badge around an icon and creates a masked notch around the badge
 */
const initIconBadges = (props = {}) => {
    const {
        parent = document
    } = props;

    const iconBadges = [...parent.querySelectorAll('.tds-icon-badge')];

    // Handle automatic positioning of any badges on the page.
    iconBadges.forEach((icon) => {
        init$5(icon, props);
    });
};

var iconBadge = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    positionIconBadge: positionIconBadge,
    applyIconBadge: applyIconBadge,
    initIconBadge: initIconBadge,
    init: init$5,
    initIconBadges: initIconBadges,
});

/**
 * initIconTrigger
 * - initialize js functionality for component
 * @param {HTMLElement} component - Component to init
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onChange - callback, called when a tooltip is opened
 */
const initIconTrigger = (component, props = {}) => {
    const {
        onChange
    } = props;

    component.addEventListener('click', () => {
        const pressed = component.ariaPressed;
        component.ariaPressed = pressed === 'true' ? 'false' : 'true';

        if (onChange) onChange();
    });
};

const init$4 = initIconTrigger;

/**
 * initIconTriggers
 * - initialize js functionality for all instances of component within a space
 * @param {HTMLElement} component - Component to init
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onChange - callback, called when a tooltip is opened
 */
const initIconTriggers = (props = {}) => {
    const {
        parent = document
    } = props;
    const iconTriggers = [...parent.querySelectorAll('.tds-icon-trigger')];

    iconTriggers.forEach((iconTrigger) => {
        init$4(iconTrigger, props);
    });
};

var iconTrigger = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initIconTrigger: initIconTrigger,
    init: init$4,
    initIconTriggers: initIconTriggers,
});

const changeEvent$1 = new Event('change');
const media_properties = [
    'autoplay',
    'buffered',
    'controls',
    'controlslist',
    'crossOrigin',
    'currentSrc',
    'currentTime',
    'defaultMuted',
    'defaultPlaybackRate',
    'duration',
    'ended',
    'error',
    'height',
    'lang',
    'loop',
    'muted',
    'networkState',
    'paused',
    'playbackRate',
    'played',
    'playsInline',
    'poster',
    'preload',
    'readyState',
    'seekable',
    'src',
    'srcObject',
    'textTracks',
    'translation',
    'videoHeight',
    'videoTracks',
    'videoWidth',
    'volume',
    'width',
];
const media_events = [
    'abort',
    'canplay',
    'canplaythrough',
    'click',
    'contextmenu',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'resize',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
];

function getTime(base, duration) {
    const h = 0.01 * Math.floor(base / 3600);
    const m = 0.01 * Math.floor((base % 3600) / 60);
    const s = 0.01 * Math.floor((base % 3600) % 60);
    const dh = 0.01 * Math.floor(duration / 3600);
    const dm = 0.01 * Math.floor((duration % 3600) / 60);
    const hDisplay = dh > 0 ? h.toFixed(2).replace('0.', '') : '';
    const mDisplay = dm > 0 ? m.toFixed(2).replace('0.', '') : '';
    const sDisplay = s.toFixed(2).replace('0.', '');
    return `${hDisplay !== '' ? hDisplay + ':' : ''}${
    mDisplay !== '' ? mDisplay + ':' : '00:'
  }${sDisplay}`;
}

function moveCues(move, cues) {
    for (let j = 0; j < cues.length; j++) {
        const cue = cues[j];
        if (cue instanceof VTTCue) {
            if (typeof cue.line === 'number') {
                if (move === 'up') {
                    cue.line -= 1;
                } else {
                    cue.line += 1;
                }
            } else {
                if (move === 'up') {
                    cue.line = 12;
                } else {
                    cue.line = 14;
                }
            }
        }
    }
}

function moveTracks(move, mediaPlayer) {
    var _a, _b;
    const trackArray = Array.from(
        ((_a = mediaPlayer.media) === null || _a === void 0 ? void 0 : _a.textTracks) || []
    );
    if (trackArray && trackArray.length > 0) {
        for (let i = 0; i < trackArray.length; i++) {
            const track = trackArray[i];
            if (track) {
                if (
                    track.activeCues &&
                    ((_b = track.activeCues) === null || _b === void 0 ? void 0 : _b.length) > 0
                ) {
                    moveCues(move, track.activeCues);
                }
                if (track.cues) {
                    moveCues(move, track.cues);
                }
            }
        }
    }
}

function handleKeypress_Enter(e) {
    var _a;
    e.preventDefault();
    togglePlayPause(
        ((_a = e.currentTarget.media) === null || _a === void 0 ? void 0 : _a.paused) || true,
        e.currentTarget
    );
}

function handleKeypress_Num(e, key) {
    const num = parseFloat(key);
    if (e.currentTarget.media) {
        e.currentTarget.media.currentTime = 0.1 * (Math.floor(e.currentTarget.media.duration) * num);
    }
}

function handleKeypress_ArrowDown(e, volStep) {
    if (e.currentTarget.media) {
        const volDown = parseFloat(e.currentTarget.media.volume.toFixed(2)) - volStep;
        e.currentTarget.volume = volDown > 0 ? volDown : 0;
    }
}

function handleKeypress_ArrowUp(e, volStep) {
    var _a, _b;
    if (e.currentTarget.media) {
        const volUp =
            parseFloat(
                (_b = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.media) === null ||
                _b === void 0 ?
                void 0 :
                _b.volume.toFixed(2)
            ) + volStep;
        e.currentTarget.volume = volUp < 1 ? volUp : 1;
    }
}

function handleKeypress_ArrowLeft(e, seekStep) {
    if (e.currentTarget.media) {
        e.currentTarget.media.currentTime = Math.floor(e.currentTarget.media.currentTime) - seekStep;
    }
}

function handleKeypress_ArrowRight(e, seekStep) {
    if (e.currentTarget.media) {
        e.currentTarget.media.currentTime = Math.floor(e.currentTarget.media.currentTime) + seekStep;
    }
}

function handleKeypress_Fullscreen(e, key) {
    const isFullscreen =
        document.fullscreenElement === e.currentTarget ||
        (document.webkitCurrentFullScreenElement &&
            document.webkitCurrentFullScreenElement === e.currentTarget);
    if (key === 'esc' && !isFullscreen) requestFullscreen(!isFullscreen, e.currentTarget);
}

function handleKeydown$1(e) {
    const mediaPlayerEvent = e;
    const volStep = 0.05;
    const seekStep = 5;
    const {
        altKey,
        ctrlKey,
        key,
        metaKey,
        shiftKey
    } = mediaPlayerEvent;
    let showControls = false;
    if (shiftKey || altKey || ctrlKey || metaKey) return;
    if (e.currentTarget) {
        switch (key) {
            case ' ':
            case 'Enter':
                handleKeypress_Enter(mediaPlayerEvent);
                showControls = true;
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                handleKeypress_Num(mediaPlayerEvent, key);
                showControls = true;
                break;
            case 'ArrowDown':
                e.preventDefault();
                handleKeypress_ArrowDown(mediaPlayerEvent, volStep);
                showControls = true;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                handleKeypress_ArrowLeft(mediaPlayerEvent, seekStep);
                break;
            case 'ArrowRight':
                e.preventDefault();
                handleKeypress_ArrowRight(mediaPlayerEvent, seekStep);
                showControls = true;
                break;
            case 'ArrowUp':
                e.preventDefault();
                handleKeypress_ArrowUp(mediaPlayerEvent, volStep);
                showControls = true;
                break;
            case 'c':
                toggleCaptions(!hasCaptions(mediaPlayerEvent.currentTarget),
                    mediaPlayerEvent.currentTarget
                );
                showControls = true;
                break;
            case 'esc':
            case 'f':
                handleKeypress_Fullscreen(mediaPlayerEvent, key);
                showControls = true;
                break;
            case 'm':
                if (mediaPlayerEvent.currentTarget.media) {
                    toggleMute(!mediaPlayerEvent.currentTarget.media.muted, mediaPlayerEvent.currentTarget);
                    showControls = true;
                }
                break;
        }
        if (showControls) {
            const host = mediaPlayerEvent.currentTarget;
            toggleControls(true, host);
            host._timeout = assignTimeout(
                host._timeout,
                () => {
                    host.setAttribute('controls', 'false');
                },
                800
            );
        }
    }
}

function showThumb(e) {
    if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.setProperty('--tds-range-slider--thumb-opacity', '1');
    }
}

function hideThumb(e) {
    if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.setProperty('--tds-range-slider--thumb-opacity', '0');
    }
}

function initMediaRangeInput(el) {
    el.addEventListener('mousedown', showThumb);
    el.addEventListener('mouseover', showThumb);
    el.addEventListener('mouseup', hideThumb);
    el.addEventListener('mouseleave', hideThumb);
    el.addEventListener('touchstart', showThumb, false);
    el.addEventListener('touchend', hideThumb, false);
    el.addEventListener('touchcancel', hideThumb, false);
    hideThumb({
        currentTarget: el
    });
}

function updateSeekBar(video, host) {
    var _a, _b, _c;
    const duration = video.duration;
    const currentTime = video.currentTime > 0 ? video.currentTime : duration;
    if (duration && currentTime) {
        if ((_a = host.control.seek) === null || _a === void 0 ? void 0 : _a.label) {
            setSeekTimeLabel(host.control.seek.label, getTime(currentTime, duration));
        }
        if (
            (_c = (_b = host.control) === null || _b === void 0 ? void 0 : _b.seek) === null ||
            _c === void 0 ?
            void 0 :
            _c.range
        ) {
            setSeekTimeRangeInput(host.control.seek.range, currentTime);
        }
    }
}

function setSeekBar(video, host) {
    var _a, _b, _c;
    const currentTime = video.currentTime > 0 ? video.currentTime : video.duration || 0;
    if ((_a = host.control.seek) === null || _a === void 0 ? void 0 : _a.label) {
        const timeLabel = getTime(currentTime, video.duration);
        setSeekTimeLabel(host.control.seek.label, timeLabel);
    }
    if ((_b = host.control.seek) === null || _b === void 0 ? void 0 : _b.range) {
        const rangeValue = parseInt(
            (_c = host.control.seek) === null || _c === void 0 ? void 0 : _c.range.value
        );
        if (currentTime !== rangeValue) {
            setSeekTimeRangeInput(host.control.seek.range, currentTime, video.duration);
        }
    }
}

function setSeekTimeLabel(label, time) {
    let span = label.querySelector('.tw-chat--tds-form-label-text');
    if (!(span instanceof HTMLSpanElement)) {
        span = document.createElement('span');
        while (label.children.length > 0) {
            label.removeChild(label.children[0]);
        }
        span.classList.add('tw-chat--tds-form-label-text');
        label.appendChild(span);
    }
    span.textContent = time;
}

function setSeekTimeRangeInput(range, currentTime, duration) {
    if (duration) {
        range.max = `${duration}`;
        range.setAttribute('aria-valuemax', `${duration}`);
    }
    if (currentTime) {
        range.value = `${currentTime}`;
        range.setAttribute('value', `${currentTime}`);
        range.setAttribute('aria-valuenow', `${currentTime}`);
    }
    range.dispatchEvent(changeEvent$1);
}

function addVideo(video, host) {
    var _a, _b;
    const id =
        video.id ||
        `${host.id}-media` ||
        `tds-media-${Date.now().toString(36) + Math.random().toString(36).substr(2)}`;
    if (!video.id) video.setAttribute('id', id);
    (_b =
        (_a = host.shadowRoot) === null || _a === void 0 ?
        void 0 :
        _a.getElementById('media-controls')) === null || _b === void 0 ?
        void 0 :
        _b.setAttribute('aria-controls', id);
    video.setAttribute('disabled', '');
    video.addEventListener('contextmenu', (event) => event.preventDefault());
    video.addEventListener('canplaythrough', () => {
        host.loading = false;
    });
    video.addEventListener('durationchange', (e) => {
        if (e.currentTarget instanceof HTMLMediaElement) {
            setSeekBar(e.currentTarget, host);
        }
    });
    video.addEventListener('timeupdate', (e) => {
        if (e.currentTarget instanceof HTMLMediaElement) {
            updateSeekBar(e.currentTarget, host);
        }
    });
    video.addEventListener('play', () => {
        var _a;
        (_a = host.control.playpause) === null || _a === void 0 ?
            void 0 :
            _a.setAttribute('aria-pressed', 'true');
    });
    video.addEventListener('pause', () => {
        var _a;
        (_a = host.control.playpause) === null || _a === void 0 ?
            void 0 :
            _a.setAttribute('aria-pressed', 'false');
    });
    video.addEventListener('volumechange', (e) => {
        if (e.currentTarget instanceof HTMLMediaElement) {
            if (e.currentTarget.muted) {
                toggleMute(e.currentTarget.muted, host);
            } else {
                host.volume = e.currentTarget.volume;
            }
        }
    });
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    video.textTracks.addEventListener('change', (e) => {
        const textTrackList = e.currentTarget;
        if (textTrackList instanceof TextTrackList) {
            const lang = getLang(host);
            for (let i = 0; i < textTrackList.length; i++) {
                const textTrack = textTrackList[i];
                if (textTrack.kind === 'captions' && textTrack.language === lang) {
                    const controls = host.getAttribute('controls') === 'true';
                    moveTracks(controls ? 'up' : 'down', host);
                    break;
                }
            }
        }
    });
    return video;
}

function addVolumeBar(input, host) {
    const connectedInput = initRangeInput(input, {
        beta: true,
    });
    initMediaRangeInput(connectedInput);
    connectedInput.addEventListener('input', (e) => {
        var _a;
        if (host.media && e.currentTarget instanceof HTMLInputElement) {
            const val = parseFloat(
                ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.value) || '0'
            );
            host.volume = val;
        }
    });
    return connectedInput;
}

function addSeekBar(input, host) {
    const connectedInput = initRangeInput(input, {
        beta: true,
    });
    let isPlaying = false;
    let seekTimeout;
    initMediaRangeInput(connectedInput);
    connectedInput.addEventListener('input', (e) => {
        var _a;
        if (host.media && e.currentTarget instanceof HTMLInputElement) {
            host.media.currentTime = parseFloat(
                ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.value) || '0'
            );
        }
    });
    connectedInput.addEventListener('mouseup', () => {
        if (seekTimeout) {
            clearTimeout(seekTimeout);
        }
        if (host.media && isPlaying) {
            host.media.play();
        }
    });
    connectedInput.addEventListener('mousedown', (e) => {
        seekTimeout = assignTimeout(
            seekTimeout,
            () => {
                console.log(seekTimeout);
                if (host.media && e.target instanceof HTMLInputElement) {
                    if (!host.media.paused) {
                        isPlaying = true;
                        host.media.pause();
                    }
                }
            },
            500
        );
    });
    connectedInput.addEventListener('mousedrag', (e) => {
        seekTimeout = assignTimeout(
            seekTimeout,
            () => {
                var _a;
                if (host.media && e.target instanceof HTMLInputElement) {
                    host.media.currentTime = parseFloat(
                        ((_a = e.target) === null || _a === void 0 ? void 0 : _a.value) || '0'
                    );
                }
            },
            100
        );
    });
    return connectedInput;
}

function handleSlotChange(e) {
    var _a, _b;
    if (
        e.target &&
        e.currentTarget &&
        e.target.name &&
        e.currentTarget.host &&
        e.target.name.length > 0
    ) {
        const host = e.currentTarget.host;
        const currentSlot = Array.from(host.children).find(
            (el) => el && e.target && el.slot === e.target.name
        );
        if (currentSlot instanceof HTMLButtonElement) {
            currentSlot.addEventListener('click', (e) => {
                if (e.currentTarget instanceof HTMLButtonElement) {
                    const name = e.currentTarget.getAttribute('slot');
                    const pressed = e.currentTarget.getAttribute('aria-pressed') === 'true';
                    switch (name) {
                        case 'captions':
                            toggleCaptions(!pressed, host);
                            break;
                        case 'fullscreen':
                            requestFullscreen(!pressed, host);
                            break;
                        case 'playpause':
                            togglePlayPause(!pressed, host);
                            break;
                    }
                    e.currentTarget.setAttribute('aria-pressed', `${!pressed}`);
                }
            });
            host.control[e.target.name] = currentSlot;
            if (currentSlot.getAttribute('aria-pressed') === 'true') {
                const name = currentSlot.getAttribute('slot');
                switch (name) {
                    case 'captions':
                        toggleCaptions(true, host);
                        break;
                    case 'fullscreen':
                        requestFullscreen(true, host);
                        break;
                    case 'playpause':
                        togglePlayPause(true, host);
                        break;
                }
            }
        } else if (currentSlot instanceof HTMLVideoElement) {
            host.media = addVideo(currentSlot, host);
            host.media.load();
        } else {
            if (currentSlot) {
                const input = currentSlot.querySelector('input');
                switch (e.target.name) {
                    case 'loader':
                        if (currentSlot instanceof HTMLElement) {
                            host.loader = currentSlot;
                        }
                        break;
                    case 'seek':
                        if (input) {
                            const seekbar = addSeekBar(input, host);
                            host.control.seek = {
                                base: currentSlot,
                                label: currentSlot.querySelector('label'),
                                range: seekbar instanceof HTMLInputElement ? seekbar : null,
                            };
                        }
                        break;
                    case 'volume':
                        if (input) {
                            const volumeBar = addVolumeBar(input, host);
                            const speaker = currentSlot.querySelector('button');
                            if (speaker) {
                                speaker.addEventListener('click', (e) => {
                                    const pressed = speaker.getAttribute('aria-pressed') === 'true';
                                    if (e.currentTarget instanceof HTMLButtonElement) {
                                        toggleMute(pressed, host);
                                    }
                                });
                            }
                            host.control.volume = {
                                base: currentSlot,
                                range: volumeBar instanceof HTMLInputElement ? volumeBar : null,
                                speaker: speaker,
                            };
                            if ((_a = host.control.volume) === null || _a === void 0 ? void 0 : _a.speaker) {
                                toggleMute(!(
                                        ((_b = host.control.volume) === null || _b === void 0 ?
                                            void 0 :
                                            _b.speaker.getAttribute('aria-pressed')) === 'true'
                                    ),
                                    host
                                );
                            }
                        }
                        break;
                }
            }
        }
    }
}

function assignTimeout(timeout, func, milliseconds) {
    if (timeout) {
        clearTimeout(timeout);
    }
    return setTimeout(func, milliseconds);
}

function requestFullscreen(goFullscreen, host) {
    if (
        goFullscreen &&
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
    ) {
        if (host.requestFullscreen) {
            host.requestFullscreen();
        } else if (host.mozRequestFullScreen) {
            host.mozRequestFullScreen();
        } else if (host.webkitRequestFullscreen) {
            host.webkitRequestFullscreen(host.ALLOW_KEYBOARD_INPUT);
        }
    } else if (
        document.fullscreenElement === host ||
        document.webkitCurrentFullScreenElement === host
    ) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

function getLang(host) {
    return host ? host.getAttribute('lang') || document.documentElement.lang || 'en' : '';
}

function hasCaptions(mediaPlayer) {
    let hasVisibleCaptions = false;
    if (mediaPlayer.media) {
        for (let i = 0; i < mediaPlayer.media.textTracks.length; i++) {
            const track = mediaPlayer.media.textTracks[i];
            const lang = getLang(mediaPlayer);
            if (track.kind === 'captions' && track.language === lang) {
                if (track.mode === 'showing') {
                    hasVisibleCaptions = true;
                    break;
                }
            }
        }
    }
    return hasVisibleCaptions;
}

function toggleMute(mute, host) {
    var _a, _b, _c, _d, _e, _f;
    if (host.media) {
        host.media.muted = mute;
    }
    if (
        (_b =
            (_a = host === null || host === void 0 ? void 0 : host.control) === null || _a === void 0 ?
            void 0 :
            _a.volume) === null || _b === void 0 ?
        void 0 :
        _b.speaker
    ) {
        const svg = host.control.volume.speaker.querySelector('svg');
        host.control.volume.speaker.setAttribute('aria-pressed', `${!mute}`);
        svg === null || svg === void 0 ? void 0 : svg.classList.remove('tds-icon-speaker--mute');
        svg === null || svg === void 0 ? void 0 : svg.classList.remove('tds-icon-speaker--low');
        svg === null || svg === void 0 ? void 0 : svg.classList.remove('tds-icon-speaker--high');
        if (mute) {
            svg === null || svg === void 0 ? void 0 : svg.classList.add('tds-icon-speaker--mute');
        } else {
            const vol = (_c = host.media) === null || _c === void 0 ? void 0 : _c.volume;
            if (vol) {
                if (vol <= 0.5) {
                    svg === null || svg === void 0 ? void 0 : svg.classList.add('tds-icon-speaker--low');
                } else {
                    svg === null || svg === void 0 ? void 0 : svg.classList.add('tds-icon-speaker--high');
                }
            }
        }
    }
    if (
        (_e =
            (_d = host === null || host === void 0 ? void 0 : host.control) === null || _d === void 0 ?
            void 0 :
            _d.volume) === null || _e === void 0 ?
        void 0 :
        _e.range
    ) {
        if (mute) {
            host.control.volume.range.value = '0';
        } else {
            host.control.volume.range.value = `${
        ((_f = host.media) === null || _f === void 0 ? void 0 : _f.volume) || 0
      }`;
        }
        host.control.volume.range.dispatchEvent(changeEvent$1);
    }
}

function toggleControls(toggleOn, mediaPlayer) {
    var _a;
    const controls =
        (_a = mediaPlayer.shadowRoot) === null || _a === void 0 ?
        void 0 :
        _a.getElementById('media-controls');
    if (toggleOn) {
        controls === null || controls === void 0 ? void 0 : controls.classList.add('animate-up');
        controls === null || controls === void 0 ? void 0 : controls.classList.remove('animate-down');
        controls === null || controls === void 0 ? void 0 : controls.classList.remove('hide');
        controls === null || controls === void 0 ? void 0 : controls.classList.add('show');
    } else {
        controls === null || controls === void 0 ? void 0 : controls.classList.add('animate-down');
        controls === null || controls === void 0 ? void 0 : controls.classList.remove('animate-up');
        controls === null || controls === void 0 ? void 0 : controls.classList.remove('show');
        controls === null || controls === void 0 ? void 0 : controls.classList.add('hide');
    }
}

function toggleCaptions(toggleOn, host) {
    var _a;
    (_a = host.control.captions) === null || _a === void 0 ?
        void 0 :
        _a.setAttribute('aria-pressed', `${toggleOn}`);
    if (host.media) {
        for (let i = 0; i < host.media.textTracks.length; i++) {
            const track = host.media.textTracks[i];
            const lang = getLang(host);
            if (track.kind === 'captions' && track.language === lang) {
                track.mode = toggleOn ? 'showing' : 'hidden';
            }
        }
    }
}

function toggleFullscreenBtn(e) {
    var _a, _b;
    if (
        document.fullscreenElement === e.currentTarget ||
        document.webkitCurrentFullScreenElement === e.currentTarget
    ) {
        (_a = e.currentTarget.control.fullscreen) === null || _a === void 0 ?
            void 0 :
            _a.setAttribute('aria-pressed', 'true');
    } else {
        (_b = e.currentTarget.control.fullscreen) === null || _b === void 0 ?
            void 0 :
            _b.setAttribute('aria-pressed', 'false');
    }
}

function togglePlayPause(shouldPlay, mediaPlayer) {
    var _a, _b, _c, _d;
    (_a = mediaPlayer.control.playpause) === null || _a === void 0 ?
        void 0 :
        _a.setAttribute('aria-pressed', `${shouldPlay}`);
    if (shouldPlay && ((_b = mediaPlayer.media) === null || _b === void 0 ? void 0 : _b.paused)) {
        (_c = mediaPlayer.media) === null || _c === void 0 ? void 0 : _c.play();
    } else {
        (_d = mediaPlayer.media) === null || _d === void 0 ? void 0 : _d.pause();
    }
}

const tmpl = `
<style>
:host {
  --tds-media-player--color: var(--tds-color-white);
  --media-seek-position: 50%;
  --volume-position: 100%;
  --thumbSize: 18px;
  --trackSize: 8px;
  --thumbBg: var(--tds-color-white);
  --trackBg: rgba(0,0,0, 0.5);
  --progressBg:  var(--tds-color-white);
  --controlbar-height--default: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--tds-media-player--color, var(--tds-color-white));
  position: relative;
  font-family: var(--tds-font-combined--medium);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  max-width: 100vw;
  overflow: hidden;
  max-height: 100vh;
  min-width: 433px;
  min-height: 244px;
  width: 100%;
  height: 100%;
  background: var(--tds-color-white, #fff);
  background-image: linear-gradient(0, rgba(0,0,0,0.75) 0%, rgba(0,0,0, 1) 48px, rgba(0,0,0, 1) 96%);
}

:host(:focus) {
  outline: none;
}

:host(.tds-media-player--lite) #media-controls {
  background: none;
}

:host(.tds-media-player--lite) #media-controls *:not([name="playpause"]) {
  display: none;
}

:host(.tds-media-player--small) {
  block-size: 244px;
  inline-size: 433px;
}

:host(.tds-media-player--small) #media-controls *:is([name="volume"]) {
  display: none;
}

:host(.tds-media-player--small) #media-controls {
  height: 100%;
  grid-template-areas: ". . ." "playpause playpause playpause" "seek captions fullscreen";
  grid-template-columns: 1fr 24px 24px;
  grid-template-rows: 48px 1fr 48px;
  background-color: transparent;
}

:host(.tds-media-player--small) ::slotted([slot="playpause"]) {
  align-items: center;
  align-self: center;
  background: rgba(0, 0, 0, 0.5) !important;
  border-radius: 100%;
  display: flex;
  grid-column-end: 4;
  grid-column-start: 1;
  justify-content: center;
  justify-self: center;
  min-height: 64px;
  min-width: 64px;
  position: relative;
  width: 40px;
  backdrop-filter: blur(4px);
}

:host(.tds-media-player--small) ::slotted([slot="playpause"]):hover { background-color: rgba(0,0,0,0.65); }
:host(.tds-media-player--small) ::slotted([slot="playpause"]):active { background-color: rgba(0,0,0,0.85); }

:host(.tds-media-player--full) {
  position: absolute;
}

:host(.tds-media-player--full) ::slotted(video) {
  width: 100%;
  height: 100%;
}

:host(.tds-media-player--lite) ::slotted([slot="playpause"]) {
  filter: drop-shadow(0 0 1mm rgba(0,0,0,0.2));
}

#media-controls {
  position: absolute;
  width: 100%;
  display: grid;
  grid-template-columns: 24px 8fr 2fr 24px 24px;
  grid-template-areas: "playpause seek volume captions fullscreen";
  height: var(--controlbar-height--default);
  bottom: 0;
  box-sizing: border-box;
  align-items: center;
  justify-content: stretch;
  padding-inline-start: 24px;
  padding-inline-end: 24px;
  grid-gap: 24px;
  background-image: linear-gradient(0,  rgba(0,0,0,0.75) 0, rgba(0, 0, 0, 0) 100%);
  background-size: 100% 48px;
  background-repeat: no-repeat;
  background-position: bottom;
}

#media-control-seekwrapper {

  display: grid;
  grid-template-columns: 24px 1fr;
  grid-gap: 16px;
  box-sizing: border-box;
  align-items: center;
}

::slotted(video) {
  max-width: 100%;
  max-height: 100%;
}
::slotted(button) {
  max-width: 24px;
  max-height: 24px;
}
::slotted([slot="playpause"]) {
  grid-area: playpause;
}
::slotted([slot="seek"]) {
  grid-area: seek;
}
::slotted([slot="volume"]) {
  grid-area: volume;
}
::slotted([slot="fullscreen"]) {
  grid-area: fullscreen;
}
::slotted([slot="captions"]) {
  grid-area: captions;
}
.show {
  opacity: 1;
  transform: translate3d(0, 0%, 0);
}
.hide {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}

.animate-up {
  animation: tds--fade_in_up 801ms ease;
}

.animate-down {
  animation: tds--fade_out_down 801ms ease-out;
}

@keyframes tds--fade_in_up {
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0%, 0);
  }
}

@keyframes tds--fade_out_down {
  0% {
    opacity: 1;
    transform: translate3d(0, 0%, 0);
  }

  100% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
<slot name="loader"></slot>
<slot></slot>
<slot name="media"></slot>
<div id="media-controls">
<slot name="playpause"></slot>
<slot name="seek"></slot>
<slot name="volume"></slot>
<slot name="captions"></slot>
<slot name="fullscreen"></slot>
</div>
`;

const changeEvent = new Event('change');
class MediaPlayer extends HTMLElement {
    constructor() {
        super();
        this.control = {};
        const shadow = this.attachShadow({
            mode: 'open'
        });
        const template = document.createElement('template');
        template.id = 'tds-media-player';
        template.innerHTML = tmpl;
        shadow.appendChild(template.content.cloneNode(true));
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('slotchange', handleSlotChange);
        }
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
        this.addEventListener('mousemove', (e) => {
            const mediaPlayer = e.currentTarget;
            if (mediaPlayer instanceof MediaPlayer) {
                mediaPlayer._timeout = assignTimeout(
                    mediaPlayer._timeout,
                    () => {
                        const bottomHover = mediaPlayer.getAttribute('data-controls') === 'bottom-hover';
                        if (bottomHover) {
                            const {
                                bottom
                            } = mediaPlayer.getBoundingClientRect();
                            const hoverRange = bottom - 100;
                            if (e.clientY >= hoverRange) {
                                mediaPlayer.setAttribute('controls', 'true');
                            } else {
                                mediaPlayer.setAttribute('controls', 'false');
                            }
                        } else {
                            mediaPlayer.setAttribute('controls', 'true');
                        }
                        mediaPlayer._timeout = assignTimeout(
                            mediaPlayer._timeout,
                            () => {
                                mediaPlayer.setAttribute('controls', 'false');
                            },
                            3000
                        );
                    },
                    500
                );
            }
        });
        this.addEventListener('mouseleave', (e) => {
            const mediaPlayer = e.currentTarget;
            if (mediaPlayer instanceof MediaPlayer) {
                mediaPlayer._timeout = assignTimeout(
                    mediaPlayer._timeout,
                    () => {
                        mediaPlayer.setAttribute('controls', 'false');
                    },
                    800
                );
            }
        });
        this.addEventListener('keydown', handleKeydown$1);
        if (this.requestFullscreen) {
            this.addEventListener('fullscreenchange', toggleFullscreenBtn);
        } else if (this.mozRequestFullScreen) {
            this.addEventListener('mozfullscreenchange', toggleFullscreenBtn);
        } else if (this.webkitRequestFullscreen) {
            this.addEventListener('webkitfullscreenchange', toggleFullscreenBtn);
        }
    }
    static get observedAttributes() {
        return ['class', 'controls'];
    }
    connectedCallback() {
        this.constructor.observedAttributes &&
            this.constructor.observedAttributes.forEach((attr) => this.upgradeAttribute(attr));
        this.classList.add('ready');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && newValue !== oldValue) {
            switch (name) {
                case 'controls':
                    moveTracks(newValue === 'true' ? 'up' : 'down', this);
                    toggleControls(newValue === 'true', this);
                    break;
                default:
                    console.debug('not captured', name);
                    break;
            }
        }
    }
    upgradeAttribute(attr) {
        if (this.hasOwnProperty(attr)) {
            const value = this[attr];
            delete this[attr];
            this[attr] = value;
            this.setAttribute(attr, this[attr]);
        }
        Object.defineProperty(this, attr, {
            enumerable: true,
            get: () => {
                let returnAttr;
                switch (attr) {
                    default: returnAttr = this.hasAttribute(attr);
                    break;
                }
                return returnAttr;
            },
            set: (val = '') => {
                switch (attr) {
                    default: return val ? this.setAttribute(attr, val) : this.removeAttribute(attr);
                }
            },
        });
    }
    get loading() {
        if (this.loader) {
            return this.loader.getAttribute('aria-busy') === 'true';
        }
        return false;
    }
    set loading(isLoading) {
        if (this.media && this.loader) {
            if (isLoading) {
                this.loader.classList.add('tds-loader--show');
                this.loader.classList.remove('tds-loader--hide');
                this.loader.setAttribute('aria-hidden', 'false');
                this.loader.setAttribute('aria-busy', 'true');
                this.media.setAttribute('disabled', '');
            } else {
                this.loader.classList.remove('tds-loader--show');
                this.loader.classList.add('tds-loader--hide');
                this.loader.setAttribute('aria-hidden', 'true');
                this.loader.setAttribute('aria-busy', 'false');
                this.media.removeAttribute('disabled');
            }
        }
    }
    get volume() {
        var _a;
        return ((_a = this.media) === null || _a === void 0 ? void 0 : _a.volume) || 0;
    }
    set volume(vol) {
        var _a, _b;
        if (this.media) {
            if (vol <= 0.01) {
                this.media.muted = true;
            } else {
                this.media.muted = false;
                this.media.volume = vol;
            }
        }
        if ((_a = this.control.volume) === null || _a === void 0 ? void 0 : _a.range) {
            const rangeValue = parseFloat(
                this.control.volume.range.value ||
                this.control.volume.range.getAttribute('aria-valuenow') ||
                '0'
            );
            if (rangeValue !== vol) {
                this.control.volume.range.value = `${vol}`;
                this.control.volume.range.setAttribute('aria-valuenow', `${vol}`);
                this.control.volume.range.dispatchEvent(changeEvent);
            }
        }
        if ((_b = this.control.volume) === null || _b === void 0 ? void 0 : _b.speaker) {
            const pressed = this.control.volume.speaker.getAttribute('aria-pressed');
            if (vol <= 0.01) {
                if (pressed) {
                    this.control.volume.speaker.setAttribute('aria-pressed', 'false');
                    this.control.volume.speaker.children[0].classList.remove('tds-icon-speaker--low');
                    this.control.volume.speaker.children[0].classList.remove('tds-icon-speaker--high');
                    this.control.volume.speaker.children[0].classList.add('tds-icon-speaker--mute');
                }
            } else if (vol > 0.01 && vol <= 0.5) {
                this.control.volume.speaker.setAttribute('aria-pressed', 'true');
                this.control.volume.speaker.children[0].classList.remove('tds-icon-speaker--mute');
                this.control.volume.speaker.children[0].classList.add('tds-icon-speaker--low');
                this.control.volume.speaker.children[0].classList.remove('tds-icon-speaker--high');
            } else {
                this.control.volume.speaker.setAttribute('aria-pressed', 'true');
                this.control.volume.speaker.children[0].classList.remove('tds-icon-speaker--mute');
                this.control.volume.speaker.children[0].classList.remove('tds-icon-speaker--low');
                this.control.volume.speaker.children[0].classList.add('tds-icon-speaker--high');
            }
        }
    }
}

var mediaPlayer = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    MediaPlayer: MediaPlayer,
    media_events: media_events,
    media_properties: media_properties,
});

/**
 * animateBackdrop
 * - takes in a parent and queries for a set of targets
 * - sets the appropriate backdrop properties to position it in the exact place of the targets
 */

/**
 * moveBackdrop
 * - if not already visible, just show the backdrop at the correct location
 * - if already visible, slide the backdrop to the new location
 */
const moveBackdrop$1 = (parent, target, isAlreadyVisible) => {
    // first, set the appropriate transition (fade on first mouseover, move on subsequent)
    const transition = isAlreadyVisible ?
        '.5s cubic-bezier(.75,0,0,1)' :
        'opacity .5s ease, visibility 0s 0s';
    parent.style.setProperty('--tds-animate-backdrop-transition', transition);
    parent.style.setProperty('--tds-animate-backdrop-opacity', '1');
    parent.style.setProperty('--tds-animate-backdrop-visibility', 'inherit');

    // Set positional properties
    if (target) {
        const {
            offsetHeight,
            offsetLeft,
            offsetTop,
            offsetWidth
        } = target;
        parent.style.setProperty('--tds-animate-backdrop-top', `${offsetTop}px`);
        parent.style.setProperty('--tds-animate-backdrop-left', `${offsetLeft}px`);
        parent.style.setProperty('--tds-animate-backdrop-height', `${offsetHeight}px`);
        parent.style.setProperty('--tds-animate-backdrop-width', `${offsetWidth}px`);
    }
};

/**
 * hideBackdrop
 * - hide the backdrop via customCSS props
 */
const hideBackdrop = (parent) => {
    // set transition back to just static properties
    parent.style.setProperty(
        '--tds-animate-backdrop-transition',
        'opacity .5s ease, visibility 0s .5s'
    );

    // set visibility properties
    parent.style.setProperty('--tds-animate-backdrop-opacity', '0');
    parent.style.setProperty('--tds-animate-backdrop-visibility', 'hidden');
};

/**
 * animateBackdrop
 * - automatically shows/hides the backdrop as a user hovers around
 * @param {HTMLElement} parent defines the container in which the backdrop lives
 * @returns {() => void} cleanup/teardown function that removes the attached event listeners
 */
const animateBackdrop = (parent) => {
    const targetElements = [...parent.querySelectorAll('.tds-animate--backdrop')];
    let isDesktopUp = window.matchMedia('(min-width: 1200px)');
    let isVisible;

    const handleMouseEnter = (e) => {
        moveBackdrop$1(parent, e.target, isVisible);
        isVisible = true;
    };

    const reset = () => {
        const highlightedElement = parent.querySelector('.tds--highlighted');

        if (highlightedElement && isDesktopUp.matches) {
            moveBackdrop$1(parent, highlightedElement, isVisible);
            isVisible = true;
        } else {
            hideBackdrop(parent);
            isVisible = false;
        }
    };

    // Make sure to start from a clean state
    reset();

    targetElements.forEach((element) => {
        element.addEventListener('mouseenter', handleMouseEnter);
    });

    window.addEventListener('resize', reset);
    parent.addEventListener('mouseleave', reset);

    return () => {
        targetElements.forEach((element) => {
            element.removeEventListener('mouseenter', handleMouseEnter);
        });

        window.removeEventListener('resize', reset);
        parent.removeEventListener('mouseleave', reset);
    };
};

var animateBackdrop$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    moveBackdrop: moveBackdrop$1,
    hideBackdrop: hideBackdrop,
    animateBackdrop: animateBackdrop,
});

const COLOR_SCHEME_KEY = 'tdsParentColorScheme';
const getColorScheme = (defaultColorScheme = 'system') => {
    return localStorage.getItem(COLOR_SCHEME_KEY) || defaultColorScheme;
};
const setColorScheme = (colorScheme) => {
    localStorage.setItem(COLOR_SCHEME_KEY, String(colorScheme));
};
const handleAppColorScheme = (parent = document.body, props = {}) => {
    const {
        defaultColorScheme,
        onAppColorSchemeChange,
        onChange,
        onInit,
        onSystemColorSchemeChange,
    } = props;
    const prefQuery = window.matchMedia('(prefers-color-scheme: light)');
    let systemColorScheme = prefQuery.matches ? 'light' : 'dark';
    const handleSystemColorSchemeChange = () => {
        systemColorScheme = prefQuery.matches ? 'light' : 'dark';
        if (onSystemColorSchemeChange) onSystemColorSchemeChange(appColorScheme, systemColorScheme);
        if (onChange) onChange(appColorScheme, systemColorScheme);
    };
    prefQuery.addEventListener('change', handleSystemColorSchemeChange);
    let appColorScheme = getColorScheme(defaultColorScheme);
    const handleColorSchemeChange = () => {
        appColorScheme = getColorScheme(defaultColorScheme);
        if (onAppColorSchemeChange) onAppColorSchemeChange(appColorScheme, systemColorScheme);
        if (onChange) onChange(appColorScheme, systemColorScheme);
    };
    window.addEventListener('storage', handleColorSchemeChange);
    const setters = Array.from(parent.querySelectorAll('[data-tds-set-color-scheme]'));
    const handleClick = (e) => {
        var _a, _b;
        appColorScheme =
            (_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a.dataset) === null ||
            _b === void 0 ?
            void 0 :
            _b.tdsSetColorScheme;
        setColorScheme(appColorScheme);
        if (onAppColorSchemeChange) onAppColorSchemeChange(appColorScheme, systemColorScheme);
        if (onChange) onChange(appColorScheme, systemColorScheme);
    };
    setters.forEach((setter) => {
        setter.addEventListener('click', handleClick);
    });
    if (onInit) onInit(appColorScheme, systemColorScheme);
    return () => {
        window.removeEventListener('storage', handleColorSchemeChange);
        prefQuery.removeEventListener('change', handleSystemColorSchemeChange);
        setters.forEach((setter) => {
            setter.removeEventListener('click', handleClick);
        });
    };
};

var colorScheme = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    COLOR_SCHEME_KEY: COLOR_SCHEME_KEY,
    getColorScheme: getColorScheme,
    setColorScheme: setColorScheme,
    handleAppColorScheme: handleAppColorScheme,
});

const getCustomProp = (element, prop) => window.getComputedStyle(element).getPropertyValue(prop);

const setCustomProp = (element, prop, newValue) => element.style.setProperty(prop, newValue);

const getValuesFromCSS = (cssProp, regex, callback) => {
    const propMatch = cssProp.match(regex);
    const propArray = [];

    if (propMatch !== null) {
        for (let i = 0; i < propMatch.length; i++) {
            const propHandler = callback(propMatch[i], i);
            propArray.push(propHandler);
        }
    }

    return propArray;
};

var cssValues = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getCustomProp: getCustomProp,
    setCustomProp: setCustomProp,
    getValuesFromCSS: getValuesFromCSS,
});

/**
 * getLangDir
 * @param node {HTML DOMNode} - a reference to a DOM Node
 * - for which we need to get the appropriate language direction
 *
 * @returns dir {string} - either 'ltr' or 'rtl'
 */
const getLangDir$1 = (node) => getComputedStyle(node).direction;

var getDir = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getLangDir: getLangDir$1,
});

/**
 * Focus Indication Utils
 * - adds a class, focus indication is handled on a component-by-component basis,
 * - this just indicates to each component how much it should indicate focus
 *
 * TODO: Flesh out a more nuanced way of handling focus indication with Design
 * Opt 1. Design focus-indication into components (eg. text-inputs, checkboxes, radios)
 * Opt 2. Utilize :focus-visible once browser support becomes more wide-spread
 *
 * Current Strat:
 * 1. Always
 * - For elements like form-items and inputs, we should always display focus
 *
 * 2. Sometimes: .tds--indicate-focus
 * - For elements like nav-items, close-icon in modal, and breadcrumb, we should only display a visible focus indication under certain circumstances.
 * - For now, we're only handling this in the site header component
 *
 * 3. Never
 * - For elements like backdrops, we should never display focus
 */

/**
 * startIndicatingFocus
 * - Add a class to tell elements in the "Sometimes" list to indicate their focus
 * @param parent - A parent element to add the util class to. Should match the parent for stop
 */
const startIndicatingFocus = (parent = document.body) => {
    parent.classList.add('tds--indicate-focus');
};

/**
 * stopIndicatingFocus
 * - Remove the focus-indication class
 * * @param parent - A parent element to add the util class to. Should match the parent for start
 */
const stopIndicatingFocus = (parent = document.body) => {
    parent.classList.remove('tds--indicate-focus');
};

/**
 * handleFocusIndication
 * - Dynamically toggles the focus-indication class based on whether it's useful or not
 * * @param parent - A parent element to add the util class to. Should match the parent for start
 * - NOTE: Defaults to document.body instead of document because we need to set classes on it.
 */
const handleFocusIndication = (parent = document.body) => {
    // Start indicating whenever the user is interacting with the keyboard
    parent.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
            startIndicatingFocus(parent);
        }
    });

    // Stop if the user clicks with the mouse instead
    parent.addEventListener('mouseup', () => stopIndicatingFocus(parent));
};

var indicateFocus = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    startIndicatingFocus: startIndicatingFocus,
    stopIndicatingFocus: stopIndicatingFocus,
    handleFocusIndication: handleFocusIndication,
});

var mediaQueries = {
    'phone-only': '(max-width: 599px)',
    'tablet-portrait-only': '(min-width: 600px) and (max-width: 899px)',
    'tablet-portrait-up': '(min-width: 600px)',
    'tablet-landscape-only': '(min-width: 900px) and (max-width: 1199px)',
    'tablet-landscape-up': '(min-width: 900px)',
    'desktop-only': '(min-width: 1200px) and (max-width: 1799px)',
    'desktop-up': '(min-width: 1200px)',
    'desktop-large-up': '(min-width: 1800px)',
    'density--2x': 'only screen and (-o-min-device-pixel-ratio: 5/4), only screen and (-webkit-min-device-pixel-ratio: 1.25), only screen and (min-device-pixel-ratio: 1.25), only screen and (min-resolution: 1.25dppx)',
    'density--3x': 'only screen and (-o-min-device-pixel-ratio: 9/4), only screen and (-webkit-min-device-pixel-ratio: 2.25), only screen and (min-device-pixel-ratio: 2.25), only screen and (min-resolution: 2.25dppx)',
    'density--4x': 'only screen and (-o-min-device-pixel-ratio: 13/4), only screen and (-webkit-min-device-pixel-ratio: 3.25), only screen and (min-device-pixel-ratio: 3.25), only screen and (min-resolution: 3.25dppx)',
};

// TODO: When refactoring to typescript, use the mediaQueries values as the allowed strings
// for the interface declaration
// TODO: Create tests for utilities

/**
 * matchMediaQuery
 *
 * @param {*} query 'phone-only' | 'desktop-up', etc. See tokens/media.json for a complete list
 * @returns a MediaQueryList for the matching query
 */
const matchMediaQuery = (query) => window.matchMedia(mediaQueries[query]);

/**
 * isMedia
 * - Util function for matching the current window's media query
 * @param query 'phone-only' | 'desktop-up', etc. See tokens/media.json for a complete list
 * @returns true | false if the window is of the query's dimensions
 */
const isMedia = (query) => matchMediaQuery(query).matches;

/**
 * Query-specific utils
 * @returns true if query is matched
 */
const isPhoneOnly = () => isMedia('phone-only');
const isTabletPortraitOnly = () => isMedia('tablet-portrait-only');
const isTabletPortraitUp = () => isMedia('tablet-portrait-up');
const isTabletLandscapeOnly = () => isMedia('tablet-landscape-only');
const isTabletLandscapeUp = () => isMedia('tablet-landscape-up');
const isDesktopOnly = () => isMedia('desktop-only');
const isDesktopUp = () => isMedia('desktop-up');
const isDesktopLargeUp = () => isMedia('desktop-large-up');

/**
 * Density-specific utils
 */
const isDensity2x = () => isMedia('density--2x');
const isDensity3x = () => isMedia('density--3x');
const isDensity4x = () => isMedia('density--4x');

var isMedia$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    matchMediaQuery: matchMediaQuery,
    isMedia: isMedia,
    isPhoneOnly: isPhoneOnly,
    isTabletPortraitOnly: isTabletPortraitOnly,
    isTabletPortraitUp: isTabletPortraitUp,
    isTabletLandscapeOnly: isTabletLandscapeOnly,
    isTabletLandscapeUp: isTabletLandscapeUp,
    isDesktopOnly: isDesktopOnly,
    isDesktopUp: isDesktopUp,
    isDesktopLargeUp: isDesktopLargeUp,
    isDensity2x: isDensity2x,
    isDensity3x: isDensity3x,
    isDensity4x: isDensity4x,
});

/*!
 * tabbable 5.3.3
 * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
 */
var candidateSelectors = [
    'input',
    'select',
    'textarea',
    'a[href]',
    'button',
    '[tabindex]:not(slot)',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
    'details>summary:first-of-type',
    'details',
];
var candidateSelector = /* #__PURE__ */ candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ?
    function() {} :
    Element.prototype.matches ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ?
    function(element) {
        return element.getRootNode();
    } :
    function(element) {
        return element.ownerDocument;
    };
/**
 * @param {Element} el container to check in
 * @param {boolean} includeContainer add container to check
 * @param {(node: Element) => boolean} filter filter candidates
 * @returns {Element[]}
 */

var getCandidates = function getCandidates(el, includeContainer, filter) {
    var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));

    if (includeContainer && matches.call(el, candidateSelector)) {
        candidates.unshift(el);
    }

    candidates = candidates.filter(filter);
    return candidates;
};
/**
 * @callback GetShadowRoot
 * @param {Element} element to check for shadow root
 * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
 */

/**
 * @callback ShadowRootFilter
 * @param {Element} shadowHostNode the element which contains shadow content
 * @returns {boolean} true if a shadow root could potentially contain valid candidates.
 */

/**
 * @typedef {Object} CandidatesScope
 * @property {Element} scope contains inner candidates
 * @property {Element[]} candidates
 */

/**
 * @typedef {Object} IterativeOptions
 * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
 *  if a function, implies shadow support is enabled and either returns the shadow root of an element
 *  or a boolean stating if it has an undisclosed shadow root
 * @property {(node: Element) => boolean} filter filter candidates
 * @property {boolean} flatten if true then result will flatten any CandidatesScope into the returned list
 * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
 */

/**
 * @param {Element[]} elements list of element containers to match candidates from
 * @param {boolean} includeContainer add container list to check
 * @param {IterativeOptions} options
 * @returns {Array.<Element|CandidatesScope>}
 */

var getCandidatesIteratively = function getCandidatesIteratively(
    elements,
    includeContainer,
    options
) {
    var candidates = [];
    var elementsToCheck = Array.from(elements);

    while (elementsToCheck.length) {
        var element = elementsToCheck.shift();

        if (element.tagName === 'SLOT') {
            // add shadow dom slot scope (slot itself cannot be focusable)
            var assigned = element.assignedElements();
            var content = assigned.length ? assigned : element.children;
            var nestedCandidates = getCandidatesIteratively(content, true, options);

            if (options.flatten) {
                candidates.push.apply(candidates, nestedCandidates);
            } else {
                candidates.push({
                    scope: element,
                    candidates: nestedCandidates,
                });
            }
        } else {
            // check candidate element
            var validCandidate = matches.call(element, candidateSelector);

            if (
                validCandidate &&
                options.filter(element) &&
                (includeContainer || !elements.includes(element))
            ) {
                candidates.push(element);
            } // iterate over shadow content if possible

            var shadowRoot =
                element.shadowRoot || // check for an undisclosed shadow
                (typeof options.getShadowRoot === 'function' && options.getShadowRoot(element));
            var validShadowRoot = !options.shadowRootFilter || options.shadowRootFilter(element);

            if (shadowRoot && validShadowRoot) {
                // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
                //  shadow exists, so look at light dom children as fallback BUT create a scope for any
                //  child candidates found because they're likely slotted elements (elements that are
                //  children of the web component element (which has the shadow), in the light dom, but
                //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
                //  _after_ we return from this recursive call
                var _nestedCandidates = getCandidatesIteratively(
                    shadowRoot === true ? element.children : shadowRoot.children,
                    true,
                    options
                );

                if (options.flatten) {
                    candidates.push.apply(candidates, _nestedCandidates);
                } else {
                    candidates.push({
                        scope: element,
                        candidates: _nestedCandidates,
                    });
                }
            } else {
                // there's not shadow so just dig into the element's (light dom) children
                //  __without__ giving the element special scope treatment
                elementsToCheck.unshift.apply(elementsToCheck, element.children);
            }
        }
    }

    return candidates;
};

var getTabindex = function getTabindex(node, isScope) {
    if (node.tabIndex < 0) {
        // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
        // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
        // yet they are still part of the regular tab order; in FF, they get a default
        // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
        // order, consider their tab index to be 0.
        // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
        // so if they don't have a tabindex attribute specifically set, assume it's 0.
        //
        // isScope is positive for custom element with shadow root or slot that by default
        // have tabIndex -1, but need to be sorted by document order in order for their
        // content to be inserted in the correct position
        if (
            (isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || node.isContentEditable) &&
            isNaN(parseInt(node.getAttribute('tabindex'), 10))
        ) {
            return 0;
        }
    }

    return node.tabIndex;
};

var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
    return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};

var isInput = function isInput(node) {
    return node.tagName === 'INPUT';
};

var isHiddenInput = function isHiddenInput(node) {
    return isInput(node) && node.type === 'hidden';
};

var isDetailsWithSummary = function isDetailsWithSummary(node) {
    var r =
        node.tagName === 'DETAILS' &&
        Array.prototype.slice.apply(node.children).some(function(child) {
            return child.tagName === 'SUMMARY';
        });
    return r;
};

var getCheckedRadio = function getCheckedRadio(nodes, form) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && nodes[i].form === form) {
            return nodes[i];
        }
    }
};

var isTabbableRadio = function isTabbableRadio(node) {
    if (!node.name) {
        return true;
    }

    var radioScope = node.form || getRootNode(node);

    var queryRadios = function queryRadios(name) {
        return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
    };

    var radioSet;

    if (
        typeof window !== 'undefined' &&
        typeof window.CSS !== 'undefined' &&
        typeof window.CSS.escape === 'function'
    ) {
        radioSet = queryRadios(window.CSS.escape(node.name));
    } else {
        try {
            radioSet = queryRadios(node.name);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(
                'Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s',
                err.message
            );
            return false;
        }
    }

    var checked = getCheckedRadio(radioSet, node.form);
    return !checked || checked === node;
};

var isRadio = function isRadio(node) {
    return isInput(node) && node.type === 'radio';
};

var isNonTabbableRadio = function isNonTabbableRadio(node) {
    return isRadio(node) && !isTabbableRadio(node);
};

var isZeroArea = function isZeroArea(node) {
    var _node$getBoundingClie = node.getBoundingClientRect(),
        width = _node$getBoundingClie.width,
        height = _node$getBoundingClie.height;

    return width === 0 && height === 0;
};

var isHidden = function isHidden(node, _ref) {
    var displayCheck = _ref.displayCheck,
        getShadowRoot = _ref.getShadowRoot;

    // NOTE: visibility will be `undefined` if node is detached from the document
    //  (see notes about this further down), which means we will consider it visible
    //  (this is legacy behavior from a very long way back)
    // NOTE: we check this regardless of `displayCheck="none"` because this is a
    //  _visibility_ check, not a _display_ check
    if (getComputedStyle(node).visibility === 'hidden') {
        return true;
    }

    var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
    var nodeUnderDetails = isDirectSummary ? node.parentElement : node;

    if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
        return true;
    } // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
    //  (but NOT _the_ document; see second 'If' comment below for more).
    // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
    //  is attached, and the one we need to check if it's in the document or not (because the
    //  shadow, and all nodes it contains, is never considered in the document since shadows
    //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
    //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
    //  visibility, including all the nodes it contains). The host could be any normal node,
    //  or a custom element (i.e. web component). Either way, that's the one that is considered
    //  part of the document, not the shadow root, nor any of its children (i.e. the node being
    //  tested).
    // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
    //  document (per the docs) and while it's a Document-type object, that document does not
    //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
    //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
    //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
    //  node is actually detached.

    var nodeRootHost = getRootNode(node).host;
    var nodeIsAttached =
        (nodeRootHost === null || nodeRootHost === void 0 ?
            void 0 :
            nodeRootHost.ownerDocument.contains(nodeRootHost)) || node.ownerDocument.contains(node);

    if (!displayCheck || displayCheck === 'full') {
        if (typeof getShadowRoot === 'function') {
            // figure out if we should consider the node to be in an undisclosed shadow and use the
            //  'non-zero-area' fallback
            var originalNode = node;

            while (node) {
                var parentElement = node.parentElement;
                var rootNode = getRootNode(node);

                if (
                    parentElement &&
                    !parentElement.shadowRoot &&
                    getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
                ) {
                    // node has an undisclosed shadow which means we can only treat it as a black box, so we
                    //  fall back to a non-zero-area test
                    return isZeroArea(node);
                } else if (node.assignedSlot) {
                    // iterate up slot
                    node = node.assignedSlot;
                } else if (!parentElement && rootNode !== node.ownerDocument) {
                    // cross shadow boundary
                    node = rootNode.host;
                } else {
                    // iterate up normal dom
                    node = parentElement;
                }
            }

            node = originalNode;
        } // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
        //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
        //  it might be a falsy value, which means shadow DOM support is disabled
        // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
        //  now we can just test to see if it would normally be visible or not, provided it's
        //  attached to the main document.
        // NOTE: We must consider case where node is inside a shadow DOM and given directly to
        //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

        if (nodeIsAttached) {
            // this works wherever the node is: if there's at least one client rect, it's
            //  somehow displayed; it also covers the CSS 'display: contents' case where the
            //  node itself is hidden in place of its contents; and there's no need to search
            //  up the hierarchy either
            return !node.getClientRects().length;
        } // Else, the node isn't attached to the document, which means the `getClientRects()`
        //  API will __always__ return zero rects (this can happen, for example, if React
        //  is used to render nodes onto a detached tree, as confirmed in this thread:
        //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
        //
        // It also means that even window.getComputedStyle(node).display will return `undefined`
        //  because styles are only computed for nodes that are in the document.
        //
        // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
        //  somehow. Though it was never stated officially, anyone who has ever used tabbable
        //  APIs on nodes in detached containers has actually implicitly used tabbable in what
        //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
        //  considering __everything__ to be visible because of the innability to determine styles.
    } else if (displayCheck === 'non-zero-area') {
        // NOTE: Even though this tests that the node's client rect is non-zero to determine
        //  whether it's displayed, and that a detached node will __always__ have a zero-area
        //  client rect, we don't special-case for whether the node is attached or not. In
        //  this mode, we do want to consider nodes that have a zero area to be hidden at all
        //  times, and that includes attached or not.
        return isZeroArea(node);
    } // visible, as far as we can tell, or per current `displayCheck` mode

    return false;
}; // form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset

var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
    if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
        var parentNode = node.parentElement; // check if `node` is contained in a disabled <fieldset>

        while (parentNode) {
            if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
                // look for the first <legend> among the children of the disabled <fieldset>
                for (var i = 0; i < parentNode.children.length; i++) {
                    var child = parentNode.children.item(i); // when the first <legend> (in document order) is found

                    if (child.tagName === 'LEGEND') {
                        // if its parent <fieldset> is not nested in another disabled <fieldset>,
                        // return whether `node` is a descendant of its first <legend>
                        return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
                    }
                } // the disabled <fieldset> containing `node` has no <legend>

                return true;
            }

            parentNode = parentNode.parentElement;
        }
    } // else, node's tabbable/focusable state should not be affected by a fieldset's
    //  enabled/disabled state

    return false;
};

var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
    if (
        node.disabled ||
        isHiddenInput(node) ||
        isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
        isDetailsWithSummary(node) ||
        isDisabledFromFieldset(node)
    ) {
        return false;
    }

    return true;
};

var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
    if (
        isNonTabbableRadio(node) ||
        getTabindex(node) < 0 ||
        !isNodeMatchingSelectorFocusable(options, node)
    ) {
        return false;
    }

    return true;
};

var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
    var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);

    if (isNaN(tabIndex) || tabIndex >= 0) {
        return true;
    } // If a custom element has an explicit negative tabindex,
    // browsers will not allow tab targeting said element's children.

    return false;
};
/**
 * @param {Array.<Element|CandidatesScope>} candidates
 * @returns Element[]
 */

var sortByOrder = function sortByOrder(candidates) {
    var regularTabbables = [];
    var orderedTabbables = [];
    candidates.forEach(function(item, i) {
        var isScope = !!item.scope;
        var element = isScope ? item.scope : item;
        var candidateTabindex = getTabindex(element, isScope);
        var elements = isScope ? sortByOrder(item.candidates) : element;

        if (candidateTabindex === 0) {
            isScope
                ?
                regularTabbables.push.apply(regularTabbables, elements) :
                regularTabbables.push(element);
        } else {
            orderedTabbables.push({
                documentOrder: i,
                tabIndex: candidateTabindex,
                item: item,
                isScope: isScope,
                content: elements,
            });
        }
    });
    return orderedTabbables
        .sort(sortOrderedTabbables)
        .reduce(function(acc, sortable) {
            sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
            return acc;
        }, [])
        .concat(regularTabbables);
};

var tabbable = function tabbable(el, options) {
    options = options || {};
    var candidates;

    if (options.getShadowRoot) {
        candidates = getCandidatesIteratively([el], options.includeContainer, {
            filter: isNodeMatchingSelectorTabbable.bind(null, options),
            flatten: false,
            getShadowRoot: options.getShadowRoot,
            shadowRootFilter: isValidShadowRootTabbable,
        });
    } else {
        candidates = getCandidates(
            el,
            options.includeContainer,
            isNodeMatchingSelectorTabbable.bind(null, options)
        );
    }

    return sortByOrder(candidates);
};

function trapFocus(parent) {
    return (e) => {
        if (e.key === 'Tab' && !parent.contains(e.target)) {
            const tabbableElements = tabbable(parent) || [];
            if (tabbableElements.length) {
                if (e.shiftKey) {
                    tabbableElements[tabbableElements.length - 1].focus();
                } else {
                    tabbableElements[0].focus();
                }
            }
        }
    };
}

function trapFocusIfRepeat(parent) {
    return (e) => {
        if (e.key === 'Tab' && e.repeat) {
            trapFocus(parent)(e);
        }
    };
}

function startTrappingFocus$1(parent) {
    document.addEventListener('keyup', trapFocus(parent));
    document.addEventListener('keydown', trapFocusIfRepeat(parent));
}

function stopTrappingFocus$1(parent) {
    document.removeEventListener('keyup', trapFocus(parent));
    document.removeEventListener('keydown', trapFocusIfRepeat(parent));
}

var trapFocus$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    startTrappingFocus: startTrappingFocus$1,
    stopTrappingFocus: stopTrappingFocus$1,
});

const {
    startTrappingFocus,
    stopTrappingFocus
} = trapFocus$1;

/**
 * closeModal
 * @param {HTML Element} modal - the modal to open
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {function} props.onCloseStart - callback, called at the start of the modal close animation
 * @param {function} props.onCloseFinish - callback, called at the end of the modal close animation
 */
const closeModal = (modal, props = {}) => {
    const {
        onCloseFinish,
        onCloseStart
    } = props;

    modal.removeAttribute('open');
    modal.removeAttribute('aria-hidden', 'true');
    stopTrappingFocus(modal);
    document.body.classList.remove('tw-chat--tds-modal--is-open');
    modal.classList.remove('tw-chat--tds-modal--scrolling');

    if (onCloseStart) onCloseStart();
    if (onCloseFinish) {
        setTimeout(onCloseFinish, 500);
    }
};

/**
 * openModal
 * @param {HTML Element} modal - the modal to open
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {function} props.onOpen - callback, called when a modal is opened
 */
const openModal = (modal, props = {}) => {
    const {
        onOpen
    } = props;

    modal.setAttribute('open', '');
    modal.setAttribute('aria-hidden', 'false');

    // If the body is blocked from interaction, block it from scrolling as well
    if (
        modal.nextElementSibling &&
        modal.nextElementSibling.classList.contains('tw-chat--tds-modal-backdrop')
    ) {
        document.body.classList.add('tw-chat--tds-modal--is-open');
    }

    startTrappingFocus(modal);
    window.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'Esc':
            case 'Escape':
                closeModal(modal);
                break;
        }
    });

    if (modal) {
        modal.scrollTop = 0;

        modal.addEventListener('scroll', () => {
            if (modal.getAttribute('open') !== undefined && modal.scrollTop > 0) {
                modal.classList.add('tw-chat--tds-modal--scrolling');
            } else {
                modal.classList.remove('tw-chat--tds-modal--scrolling');
            }
        });
    }

    if (onOpen) onOpen();
};

/**
 * initModalCloser
 * - Connect a closer element to a specific modal
 * @param {HTMLElement} opener - Element that should trigger the modal to open
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onOpen - callback, called when a modal is opened
 */
const initModalOpener = (opener, props = {}) => {
    const {
        parent = document
    } = props;
    const id = opener.getAttribute('data-tds-open-modal');
    const targetModal = parent.querySelector(`#${id}`) || document.getElementById(id);

    if (!targetModal) {
        console.warn(
            'TDS Modal does not have the proper vanilla html structure. See the docs for example usage'
        );
    }

    opener.addEventListener('click', () => openModal(targetModal, props));
};

/**
 * initModalCloser
 * - Connect a closer element to a specific modal
 * @param {HTMLElement} closer - Element that should trigger the modal to close
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onCloseStart - callback, called at the start of the modal close animation
 * @param {function} props.onCloseFinish - callback, called at the end of the modal close animation
 */
const initModalCloser = (closer, props = {}) => {
    const {
        parent = document
    } = props;
    const id = closer.getAttribute('data-tds-close-modal');
    const targetModal = parent.querySelector(`#${id}`) || document.getElementById(id);

    if (!targetModal) {
        console.warn(
            'TDS Modal does not have the proper vanilla html structure. See the docs for example usage'
        );
    }

    closer.addEventListener('click', () => {
        closeModal(targetModal, props);
    });
};

/**
 * init (Modal)
 * - initialize js functionality for all instances of component within a space
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onOpen - callback, called when a modal is opened
 * @param {function} props.onCloseStart - callback, called at the start of the modal close animation
 * @param {function} props.onCloseFinish - callback, called at the end of the modal close animation
 */
const initModals = (props = {}) => {
    const {
        parent = document
    } = props;
    const openers = [...parent.querySelectorAll('[data-tds-open-modal]')];
    const closers = [...parent.querySelectorAll('[data-tds-close-modal]')];

    openers.forEach((opener) => {
        initModalOpener(opener, props);
    });

    closers.forEach((closer) => {
        initModalCloser(closer, props);
    });
};

var modal = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    closeModal: closeModal,
    openModal: openModal,
    initModalOpener: initModalOpener,
    initModalCloser: initModalCloser,
    initModals: initModals,
});

/**
 * handleSelectorKeyDown
 * - Provide keyboard nav for columns
 *
 * Note: Assumes the following html structure
 *
 * <div class="tds-selector">
 *   <div>
 *    <input class="tds-selector-input" />
 *    <label class="tds-selector-label" />
 *   </div>
 *   ...
 * </div>
 */
const handleSelectorKeyDown = (e) => {
    // '.tds-selector > div' containing a label + input
    const target = e.target.parentNode;
    // `.tds-selector` containing a list of targets
    const selector = target.parentNode;

    const colCount = parseInt(getComputedStyle(target).getPropertyValue('--tds-column-count'), 10);
    const dir = getLangDir$1(target);

    // Left/Right Arrows - language-sensitive
    let newTarget = null;
    if (e.key === 'ArrowLeft') {
        newTarget = target[`${dir === 'ltr' ? 'previous' : 'next'}ElementSibling`];
    }

    if (e.key === 'ArrowRight') {
        newTarget = target[`${dir === 'ltr' ? 'next' : 'previous'}ElementSibling`];
    }

    // Up/Down Arrows - column-sensitive
    let newIndex = null;
    if (e.key === 'ArrowUp') {
        if (colCount) {
            newIndex = [...selector.children].indexOf(target) - colCount;

            if (newIndex > 0 && newIndex < selector.children.length) {
                newTarget = selector.children[newIndex];
            }
        }

        if (!newTarget) {
            newTarget = selector.firstElementChild;
        }
    }

    if (e.key === 'ArrowDown') {
        if (colCount) {
            newIndex = [...selector.children].indexOf(target) + colCount;

            if (newIndex > 0 && newIndex < selector.children.length) {
                newTarget = selector.children[newIndex];
            }
        }

        if (!newTarget) {
            newTarget = selector.lastElementChild;
        }
    }

    const newTargetInput = newTarget ? newTarget.querySelector('input.tds-selector-input') : null;

    if (newTargetInput) {
        e.preventDefault();
        newTargetInput.focus();
    }
};

/**
 * init (Selector)
 * - initialize js functionality for component
 * @param {HTMLElement} selector - Component to init
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {function} props.onChange - callback, called when an option is selected
 */
const initSelector = (selector, props = {}) => {
    const {
        onChange
    } = props;
    selector.addEventListener('keydown', (e) => handleSelectorKeyDown(e));

    const inputs = [...selector.querySelectorAll('.tds-selector-input')];

    inputs.forEach((input) => {
        input.addEventListener('change', () => {
            if (onChange) onChange();
        });
    });
};

const init$3 = initSelector;

/**
 * initSelectors
 * - creates event listeners for each selector component on the page
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onChange - callback, called when an option is selected
 */
const initSelectors = (props = {}) => {
    const {
        parent = document
    } = props;
    const selectors = [...parent.getElementsByClassName('tds-selector')];

    selectors.forEach((selector) => {
        init$3(selector, props);
    });
};

var selector = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    handleSelectorKeyDown: handleSelectorKeyDown,
    initSelector: initSelector,
    init: init$3,
    initSelectors: initSelectors,
});

const initSidenav = (wrapper, props) => {
    const navItems = wrapper.querySelectorAll('.tds-site-nav-item');
    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            var _a;
            const activeItem =
                (_a = item.closest('.tds-site-nav-items')) === null || _a === void 0 ?
                void 0 :
                _a.querySelector('.tds-site-nav-item.active');
            activeItem === null || activeItem === void 0 ? void 0 : activeItem.classList.remove('active');
            if (item !== activeItem) {
                item.classList.add('active');
            }
        });
    });
};
const init$2 = initSidenav;
const initSidenavs = (props = {}) => {
    const {
        parent = document
    } = props;
    const components = Array.from(parent.querySelectorAll('.tds-sidenav'));
    components.forEach((sidenav) => {
        init$2(sidenav);
    });
};

var sidenav = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initSidenav: initSidenav,
    init: init$2,
    initSidenavs: initSidenavs,
});

// Check if the current viewport matches TDS's phone breakpoint
// TODO: For MVP Site Header skips tablet layout
const isMobile = () => window.matchMedia('(max-width: 1199px)').matches;

/**
 * show
 * - aria-expanded attribute is used to trigger TDS styling
 */
const show = (element) => {
    if (element) element.setAttribute('aria-expanded', true);
};

/**
 * hide
 * - aria-expanded attribute is used to trigger TDS styling
 */
const hide = (element) => {
    if (element) element.setAttribute('aria-expanded', false);
};

/**
 * isSecondaryOpener
 * - Test whether the given opener is NOT in the top-tier
 */
const isSecondaryOpener = (opener) =>
    opener.closest('[data-tds-tier]').getAttribute('data-tds-tier') === '2' ||
    opener.getAttribute('[data-tds-breadcrumb]');

/**
 * getBlock
 * - finds a particular block based on it's opener
 */
const getBlock = (opener, blocks) => {
    const targetID = opener ? opener.getAttribute('data-tds-open-block') : null;

    return blocks.find((block) => block.id === targetID);
};

/**
 * resetBlocks
 * - set the active tier back to 1
 */
const resetBlocks = (blocks) => {
    blocks.forEach((block) => {
        hide(block);
    });
};

/**
 * getTier
 * - return the tier of a given block
 */
const getTier = (element) => (element ? element.closest('[data-tds-tier]') : null);

/**
 * getTierNumber
 * - get the depth of a given tier
 * NOTE: The value in html is stored as a string
 */
const getTierNumber = (tier) => (tier ? tier.getAttribute('data-tds-tier') : null);

/**
 * resetTiers
 * - set the active tier back to 1
 */
const resetTiers = (tiers) => {
    tiers.forEach((tier) => {
        hide(tier);
    });

    show(tiers[0]);
};

/**
 * setFlyoutHeight
 * - if provided a block, set the flyout to that height via css
 * - otherwise, set it to zero
 */
const setFlyoutHeight = (activeBlock, header) => {
    header.style.setProperty(
        '--tds-site-nav--flyout-height',
        `${activeBlock ? activeBlock.clientHeight : '0'}px`
    );
};

/**
 * openFlyout
 * - opens the flyout menu on mobile
 * - focuses a given item
 */
const openFlyout = (flyout) => {
    document.body.classList.add('tds--prevent-scroll');
    show(flyout);

    startTrappingFocus$1(flyout);
};

/**
 * closeFlyout
 * - closes the flyout menu on mobile
 */
const closeFlyout = (flyout) => {
    document.body.classList.remove('tds--prevent-scroll');
    hide(flyout);

    stopTrappingFocus$1(flyout);
};

/**
 * focusNext
 * - if passed an index, focus the next item in the list
 * - othewise, just focus the start
 */
const focusNext = (i, nodes) => {
    const newIndex = i >= nodes.length - 1 ? 0 : i + 1;
    const newItem = nodes[newIndex];

    // tabindex alone should be ignored, use visibility to hide sections frrom being focusable
    if (newItem.getAttribute('tabindex') === '-1') {
        nodes[i].setAttribute('tabindex', '-1');
        newItem.setAttribute('tabindex', '0');
    }

    // If there's a hidden element in the list, it would cause the focus
    if (tabbable.isTabbable(newItem)) {
        newItem.focus();
    } else {
        focusNext(newIndex, nodes);
    }
};

/**
 * focusPrevious
 * - if passed an index, focus the next item in the list
 * - othewise, just focus the start
 */
const focusPrevious = (i, nodes) => {
    const newIndex = i <= 0 ? nodes.length - 1 : i - 1;
    const newItem = nodes[newIndex];

    // tabindex alone should be ignored, use visibility to hide sections frrom being focusable
    if (newItem.getAttribute('tabindex') === '-1') {
        nodes[i].setAttribute('tabindex', '-1');
        newItem.setAttribute('tabindex', '0');
    }

    // If there's a hidden element in the list, it would cause the focus
    if (tabbable.isTabbable(newItem)) {
        newItem.focus();
    } else {
        focusPrevious(newIndex, nodes);
    }
};

/**
 * focusIntoBlock
 * - for a given block, look for the first tabbable element inside it
 * - If there is one, focus it
 */
const focusIntoBlock = (element) => {
    const items = tabbable(element);
    items[0].focus();
};

var siteHeader = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    isMobile: isMobile,
    show: show,
    hide: hide,
    isSecondaryOpener: isSecondaryOpener,
    getBlock: getBlock,
    resetBlocks: resetBlocks,
    getTier: getTier,
    getTierNumber: getTierNumber,
    resetTiers: resetTiers,
    setFlyoutHeight: setFlyoutHeight,
    openFlyout: openFlyout,
    closeFlyout: closeFlyout,
    focusNext: focusNext,
    focusPrevious: focusPrevious,
    focusIntoBlock: focusIntoBlock,
});

const {
    getLangDir
} = getDir;
const {
    moveBackdrop
} = animateBackdrop$1;
/**
 * selectTab
 * 1. get the currently selected tab
 * 2. move the backdrop to match that tab's dimensions/position
 * @param enableTransitions {boolean} - (optional) remove the sliding animation on animated tabs
 * @param onChange {function} - callback function for after the selection happens
 * @param tabList {HTML Node} - the parent tabs-list element
 * @param target {HTML Node} - the tab element to select
 */
const selectTab = ({
    enableTransitions,
    onChange,
    tabList,
    target
}) => {
    // Unset the previously active tab
    const oldSelectedTab = tabList.querySelector('.tds-tab[aria-selected="true"]');
    if (oldSelectedTab) {
        oldSelectedTab.setAttribute('aria-selected', false);
        oldSelectedTab.setAttribute('tabindex', '-1');
    }

    // Set the new active tab
    target.setAttribute('aria-selected', true);
    target.setAttribute('tabindex', '0');

    moveBackdrop(tabList, target, enableTransitions);
    if (onChange) onChange();

    return target;
};

/**
 * selectTabSibling
 * - Focus the tab immediately before or after the provided tab.
 */
const selectTabSibling = (tab, siblingKey) => {
    const target = tab[siblingKey];

    if (target) {
        target.focus();
    }
};

// Select the next or previous tab
const handleKeyPress = (e) => {
    const dir = getLangDir(e.target);

    if (
        (dir === 'rtl' && e.key === 'ArrowLeft') ||
        (dir === 'ltr' && e.key === 'ArrowRight') ||
        e.key === 'ArrowDown'
    ) {
        e.preventDefault();
        selectTabSibling(e.target, 'nextElementSibling');
    }

    if (
        (dir === 'rtl' && e.key === 'ArrowRight') ||
        (dir === 'ltr' && e.key === 'ArrowLeft') ||
        e.key === 'ArrowUp'
    ) {
        e.preventDefault();
        selectTabSibling(e.target, 'previousElementSibling');
    }
};

/**
 * selectPanel
 * Given a target tab, make the panel that it links to active
 * @param target {HTML Node} - the tab element to get the panel id from
 */
const selectPanel = ({
    target
}) => {
    const targetPanel = document.getElementById(target.getAttribute('aria-controls'));

    // Do nothing if no panels
    if (!targetPanel) {
        return;
    }

    const panels = [...targetPanel.parentElement.getElementsByClassName('tds-tab-panel')];

    panels.forEach((panel) => {
        panel.classList.remove('tds-tab-panel--active');
        panel.removeAttribute('tabindex');
    });

    targetPanel.classList.add('tds-tab-panel--active');
    targetPanel.setAttribute('tabindex', '0');
};

/**
 * init (Tab List)
 * - initialize js functionality for component
 * @param {HTMLElement} tabList - Component to init
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {function} props.onTabChange - callback, called when a new tab is selected
 */
const initTabList = (tabList, props = {}) => {
    const {
        onTabChange
    } = props;
    const tabs = [...tabList.getElementsByClassName('tds-tab')];
    let selectedTab = tabs[0];

    // Wait for repaint to occur so moveBackdrop can measure the selected
    // tab element correctly.
    window.requestAnimationFrame(() => {
        selectedTab = selectTab({
            enableTransitions: false,
            onChange: onTabChange,
            tabList,
            target: selectedTab,
        });
    });

    // Update the position on window resize
    window.addEventListener('resize', () => {
        selectedTab = selectTab({
            enableTransitions: true,
            onChange: onTabChange,
            tabList,
            target: selectedTab,
        });
    });

    /**
     * Individual-tab listeners for this tab-list
     */
    tabs.forEach((tab) => {
        // Update the selected tab when one is clicked/focused

        const handleSelect = (e) => {
            selectedTab = selectTab({
                enableTransitions: true,
                onChange: onTabChange,
                tabList,
                target: e.target,
            });

            selectPanel({
                tabList,
                target: selectedTab
            });
        };

        tab.addEventListener('click', handleSelect);
        tab.addEventListener('focus', handleSelect);

        tab.addEventListener('keydown', handleKeyPress);
    });
};

const init$1 = initTabList;

/**
 * init (Tab Lists)
 * - initialize js functionality for component
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onTabChange - callback, called when a new tab is selected
 */
const initTabLists = (props = {}) => {
    const {
        parent = document
    } = props;
    const tabLists = [...parent.querySelectorAll('.tds-tab-list')];

    tabLists.forEach((component) => {
        init$1(component, props);
    });
};

var tabs = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    selectTab: selectTab,
    selectPanel: selectPanel,
    initTabList: initTabList,
    init: init$1,
    initTabLists: initTabLists,
});

/**
 * positionTooltipX
 * - detect whether the tooltip's content is off the screen horizontally
 * - If so, adjust it's position to bring it back into the viewport
 */
const positionTooltipX = (tooltip) => {
    if (tooltip && tooltip.offsetParent) {
        const content = tooltip.getBoundingClientRect();
        const parent = tooltip.offsetParent.getBoundingClientRect();
        const {
            innerWidth
        } = window;

        // Determine which direction the tooltip is overflowing based on the midpoint of it's parent
        const overflowLeft = -(parent.left + parent.width / 2 - content.width / 2 - 24);
        const overflowRight = -(parent.left + parent.width / 2 + content.width / 2 + 24 - innerWidth);

        if (overflowLeft > 0) {
            tooltip.style.setProperty('--tds-tooltip--x-offset', `${overflowLeft}px`);
        }

        if (overflowRight < 0) {
            tooltip.style.setProperty('--tds-tooltip--x-offset', `${overflowRight}px`);
        }
    }
};

/**
 * positionTooltipY
 * - detect whether the tooltip's content is off the screen vertically
 * - If so, scroll the page up so that the content is in view
 * - Or if that's not possible, position the tooltip underneath the icon
 */
const positionTooltipY = (tooltip) => {
    if (tooltip && tooltip.offsetParent) {
        const content = tooltip.getBoundingClientRect();
        const parent = tooltip.offsetParent.getBoundingClientRect();
        const {
            innerHeight
        } = window;
        const safeSpace = getComputedStyle(tooltip).getPropertyValue('--tds-tooltip--safe-space');

        // Remove any prior adjustments
        tooltip.style.removeProperty('top');
        tooltip.style.removeProperty('bottom');

        // If tooltip is positioned off the bottom of the body, flip it upward
        if (parent.bottom + content.height + 24 > innerHeight) {
            tooltip.style.setProperty('top', 'auto');
            tooltip.style.setProperty('bottom', `calc(100% + ${safeSpace})`);
        }

        // If tooltip is positioned off the top of the body, flip it downward
        if (parent.top - content.height - 24 < 0) {
            tooltip.style.setProperty('top', `calc(100% + ${safeSpace})`);
            tooltip.style.setProperty('bottom', 'auto');
        }
    }
};

/**
 * Positions the tooltip vertically with relation to the tooltip target element and the viewport
 *
 * @param {*} tooltip the ".tds-tooltip" element
 * @param {*} orientation default orientation is up. Pass "down" if you want to orient down when available
 */
const setTooltipOverlayY = (tooltip, orientation) => {
    if (tooltip) {
        const parent = tooltip.parentNode.getBoundingClientRect();
        const content = tooltip.getBoundingClientRect();

        // Tooltip safe space
        const offsetPadding = 8;

        // Position the tooltip so that it is up or down based on the available space
        const aboveParent = parent.y - content.height - offsetPadding;
        const belowParent = parent.y + parent.height + offsetPadding;
        const overflowTop = -(parent.y - content.height - offsetPadding);
        const overflowBottom =
            window.innerHeight - (parent.y + parent.height) - content.height + offsetPadding;

        if (orientation === 'down') {
            tooltip.style.top = `${overflowBottom < 0 ? aboveParent : belowParent}px`;
        } else {
            tooltip.style.top = `${overflowTop > 0 ? belowParent : aboveParent}px`;
        }
    }
};

/**
 * Positions the tooltip horizontally with relation to the tooltip target element and the viewport
 *
 * @param {*} tooltip the ".tds-tooltip" element
 * @param {*} align either "start" or "end" to align the tooltip to the start or end of the trigger
 * though the positioning function will detect if the tooltip is cut-off and compensate for the overflow
 */
const setTooltipOverlayX = (tooltip, align) => {
    if (tooltip && tooltip.parentNode) {
        const parent = tooltip.parentNode.getBoundingClientRect();
        const content = tooltip.getBoundingClientRect();

        // horizontal tooltip safe space if the tooltip exceeds the window boundary
        const offsetPadding = 24;

        // horizontal alignment offset start/end with the tooltip trigger
        const offsetAlign = 8;

        let startX = -content.width / 2 + parent.width / 2 + offsetAlign / 2;
        if (align === 'end') startX = -content.width + offsetAlign + parent.width;
        if (align === 'start') startX = -offsetAlign;

        // This checks the overflow and adjusts the position
        const overflowLeft = -(parent.x + startX - offsetPadding);
        const overflowRight = window.innerWidth - (parent.x + startX) - content.width - offsetPadding;

        const positionX = parent.x + startX + Math.min(0, overflowRight) + Math.max(0, overflowLeft);

        tooltip.style.left = `${positionX}px`;
    }
};

/**
 * Positions the tooltip in the window
 *
 * @param {*} tooltip tooltip element
 * @param {*} align pass alignment if using overlay mode: 'end', 'start', null or undefined
 * @param {*} orientation pass orientation: "down", null or undefined
 */
const positionTooltipOverlay = (tooltip, align, orientation) => {
    setTooltipOverlayX(tooltip, align);
    setTooltipOverlayY(tooltip, orientation);
};

/**
 * Positions the tooltip on the x and y axis
 * @param {*} tooltip tooltip element
 */
const positionTooltip = (tooltip) => {
    positionTooltipX(tooltip);
    positionTooltipY(tooltip);
};

/**
 * Get the tooltip is in fixed position overlay mode, align, and orientation
 * @param {*} tooltip tooltip element
 * @returns object with overlay, align, and orientation properties
 */
function getTooltipModifiers(tooltip) {
    const overlay = tooltip.classList.contains('tds-tooltip--overlay');

    const modifiers = {
        align: null,
        orientation: null,
        overlay
    };

    if (tooltip.classList.contains('tds-tooltip--align-start')) {
        modifiers.align = 'start';
    }

    if (tooltip.classList.contains('tds-tooltip--align-end')) {
        modifiers.align = 'end';
    }

    if (tooltip.classList.contains('tds-tooltip--orientation-down')) {
        modifiers.orientation = 'down';
    }
    return modifiers;
}

/**
 * Sets the tooltip position based on if it's in regular mode or fixed position overlay mode
 */
function setTooltipPosition(tooltip, overlay, align, orientation) {
    if (overlay) {
        positionTooltipOverlay(tooltip, align, orientation);
    } else {
        positionTooltipY(tooltip);
    }
}

function handleKeydown(e, tooltip, callback) {
    const {
        key
    } = e;
    if (key === 'escape' || key === 'Escape' || key === 'Esc' || key === 'esc') {
        handleClose(tooltip, callback);
    }
}

function handleClose(tooltip, callback) {
    tooltip.classList.remove('tds-tooltip--open');
    tooltip.classList.add('tds-tooltip--closed');
    if (callback) return callback();
    return;
}

function handleOpen(tooltip, overlay, align, orientation, callback) {
    tooltip.classList.add('tds-tooltip--open');
    tooltip.classList.remove('tds-tooltip--closed');
    setTooltipPosition(tooltip, overlay, align, orientation);
    if (callback) return callback();
    return;
}

/**
 * init (Tooltip)
 * - initialize js functionality for component
 * @param {HTMLElement} tooltip - Component to init
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {function} props.onOpen - callback, called when a tooltip is opened
 */
const initTooltip = (tooltip, props) => {
    const {
        onClose,
        onOpen
    } = props;

    // Get horizontal alignment, vertical alignment, and overlay (if using fixed positioning)
    const {
        align,
        orientation,
        overlay
    } = getTooltipModifiers(tooltip);

    const opener = tooltip.parentElement.querySelector('[data-tds-tooltip-trigger]');

    // this is to track if we're in overlay mode and scroll away.
    // we need to give it time to finish the 500ms animation,
    // otherwise the tooltip sort of trails off weirdly
    let scrollTimeout;

    // Initialize the x and y positions
    positionTooltipX(tooltip);
    positionTooltipY(tooltip);

    // Positions the tooltip in response to resize and (if in fixed overlay mode) scrolling
    const handleScrollAndResize = () => {
        setTooltipPosition(tooltip, overlay, align, orientation);
    };

    // Dismiss on escape. Adding here instead of in the handleClose function
    // allows us to remove when the tooltip is closed
    const onEscapeKeyDown = (e) => handleKeydown(e, tooltip, onClose);

    // Listen for resize, keydown, and if overlay, scrolling
    const addTooltipListeners = () => {
        clearTimeout(scrollTimeout);
        if (overlay) window.addEventListener('scroll', handleScrollAndResize);
        window.addEventListener('resize', handleScrollAndResize);
        document.addEventListener('keydown', onEscapeKeyDown);
    };

    // Unbinds all of these on tooltip close
    const removeTooltipListeners = () => {
        if (overlay) {
            scrollTimeout = setTimeout(
                () => window.removeEventListener('scroll', handleScrollAndResize),
                500
            );
        }
        window.removeEventListener('resize', handleScrollAndResize);
        document.removeEventListener('keydown', onEscapeKeyDown);
    };

    // This passes the properties of the tooltip to the open/close and on to the position tooltip fn
    // which decides on how to position the tooltip if we're overlaying in position fixed
    const openTooltip = () => {
        handleOpen(tooltip, overlay, align, orientation, onOpen);
        addTooltipListeners();
    };

    const closeTooltip = () => {
        handleClose(tooltip, onClose);
        removeTooltipListeners();
    };

    // Bind up all of the interaction listeners we need
    opener.addEventListener('click', openTooltip);

    opener.addEventListener('mouseenter', openTooltip);

    tooltip.parentElement.addEventListener('mouseleave', closeTooltip);

    tooltip.parentElement.addEventListener('focus', openTooltip);

    tooltip.parentElement.addEventListener('focusin', openTooltip);

    opener.addEventListener('blur', closeTooltip);
};

const init = initTooltip;

/**
 * initTooltips
 * - initialize js functionality for all instances of component within a space
 * @param {Object} props - Props to pass directly to the initialized component
 * @param {document | HTMLElement} props.parent - Parent space to init component within
 * @param {function} props.onOpen - callback, called when a tooltip is opened
 */
const initTooltips = (props = {}) => {
    const {
        parent = document
    } = props;
    const tooltips = [...parent.querySelectorAll('.tds-tooltip')];

    // Handle automatic positioning of any tooltips on the page.
    tooltips.forEach((component) => {
        init(component, props);
    });
};

var tooltip = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    positionTooltipX: positionTooltipX,
    positionTooltipY: positionTooltipY,
    setTooltipOverlayY: setTooltipOverlayY,
    setTooltipOverlayX: setTooltipOverlayX,
    positionTooltipOverlay: positionTooltipOverlay,
    positionTooltip: positionTooltip,
    initTooltip: initTooltip,
    init: init,
    initTooltips: initTooltips,
});

var bezier = {
    base: 'cubic-bezier(0.5, 0, 0, 0.75)',
};
var size = {
    base: '8px',
    '10x': '80px',
    '11x': '88px',
    '12x': '96px',
    '13x': '104px',
    '1x': '8px',
    '2x': '16px',
    '3x': '24px',
    '4x': '32px',
    '5x': '40px',
    '6x': '48px',
    '7x': '56px',
    '8x': '64px',
    '9x': '72px',
    half: '4px',
};
var color = {
    black: '#000',
    blue10: '#2e4994',
    blue20: '#3457b1',
    blue30: '#3e6ae1',
    green: '#12bb00',
    grey10: '#171a20',
    grey15: '#222',
    grey20: '#393c41',
    grey25: '#444',
    grey30: '#5c5e62',
    grey35: '#8e8e8e',
    grey40: '#a2a3a5',
    grey45: '#bbb',
    grey50: '#d0d1d2',
    grey60: '#e2e3e3',
    grey65: '#eee',
    grey70: '#f4f4f4',
    red10: '#b74134',
    red20: '#ed4e3b',
    white: '#fff',
    yellow: '#fbb01b',
};
var blur = {
    button: '16px',
    large: '8px',
    small: '4px',
};
var height = {
    choice: '24px',
    pill: '40px',
};
var opacity = {
    30: '0.3',
    50: '0.5',
    70: '0.7',
    100: '1',
    transparent: '0',
};
var padding = {
    card: '16px',
};
var props = {
    '{property-name}': {
        base: '{base-value}',
        '{modifier}': '{value}',
    },
    bezier: bezier,
    size: size,
    color: color,
    'font-family': {
        base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        arabic: "'Noto Sans Arabic'",
        'chinese-hk': "'PingFang HK', 'Microsoft YaHei'",
        'chinese-simplified': "'PingFang SC', 'Microsoft YaHei'",
        'chinese-traditional': "'PingFang TC', 'Microsoft YaHei'",
        combined: "'Gotham SSm', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        hebrew: "'Noto Sans Hebrew'",
        japanese: "'AXIS Font Japanese W55', 'Hiragino Sans'",
        korean: "'FB New Gothic'",
        latin: "'Gotham SSm'",
        monospace: "'Fira Code', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
    },
    'font-weight': {
        bold: '700',
        book: '400',
        light: '300',
        medium: '500',
        xlight: '200',
    },
    blur: blur,
    'border-radius': {
        base: '4px',
        card: '4px',
        circle: '100%',
        pill: '4px',
        'outline-only': '0.001px',
    },
    'border-style': {
        base: 'solid',
    },
    'border-width': {
        hairline: '0.5px',
        large: '3px',
        medium: '2px',
        small: '1px',
    },
    'box-shadow': {
        large: '0 8px 16px 0 rgba(0, 0, 0, 0.16)',
        'large-reverse': '0 -8px 16px 0 rgba(0, 0, 0, 0.16)',
        medium: '0 8px 16px 0 rgba(0, 0, 0, 0.12)',
        off: '0 0 0 0 rgba(0, 0, 0, 0)',
        small: '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
    },
    'font-size': {
        10: '10px',
        20: '12px',
        30: '14px',
        40: '17px',
        50: '20px',
        55: '23px',
        60: '24px',
        70: '28px',
        75: '34px',
        80: '40px',
    },
    height: height,
    'line-height': {
        10: '18px',
        20: '20px',
        30: '20px',
        40: '24px',
        50: '24px',
        60: '28px',
        70: '36px',
        75: '44px',
        80: '48px',
        unitless: '1.414',
    },
    opacity: opacity,
    padding: padding,
};

export {
    animateBackdrop$1 as animateBackdrop,
    colorScheme,
    contextBlock,
    cssValues,
    customElement,
    datePicker,
    formInput,
    formInputDropdown,
    formInputFileUpload,
    formInputPassword,
    formInputRange,
    formInputSearch,
    getDir as getLangDir,
    iconBadge,
    iconTrigger,
    indicateFocus,
    isMedia$1 as isMedia,
    listbox as listBox,
    mediaQueries as media,
    mediaPlayer,
    modal,
    props,
    selector,
    sidenav,
    siteHeader,
    tabs,
    tooltip,
    trapFocus$1 as trapFocus,
};