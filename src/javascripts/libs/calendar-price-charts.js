/**
 * @param prices {[[number], [number]]}
 * @returns {number} biggest value of prices, needs to use it as 100% of chart height
 */
const biggestPrice = (prices) => Math.max.apply(null, prices.reduce((a, b) => a.concat(b)));
/**
 * @param price {number}
 * @param max {number} biggest value of prices
 * @returns {number} returns actual height for the chart from 0 to 100
 */
const getChartHeight = (price, max) => Number(price) / Number(max) * 100;
/**
 * @type {[string]}
 * needs to set current month name
 */
const monthNames = ['Январь', 'Фервраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
/**
 * @param yyyy {number} - year, 2017
 * @param mm {number} - month 0-11
 * @param dd {number} - day 1-31
 * @returns {boolean} - if the day for current date is day off - returns true, otherwise returns false
 */
const isDayOff = (yyyy, mm, dd) => [0,6].indexOf(new Date(yyyy, mm, dd).getDay()) !== -1;
/**
 * @types {string} - elements classes
 */
const containerClass        = '.js-calendar-price-charts';
const monthClass            = 'calendar-price-charts__month';
const itemsClass            = 'calendar-price-charts__items';
const itemClass             = 'calendar-price-charts__item';
const chartsContainerClass  = 'calendar-price-charts__items_charts';
const chartItemClass        = 'calendar-price-charts__item_chart';
const daysContainerClass    = 'calendar-price-charts__items_days';
const dayItemClass          = 'calendar-price-charts__item_day';
const dayOffClass           = 'calendar-price-charts__item_day_day-off';
const monthNameClass        = 'calendar-price-charts__month-name';
/**
 * @types {string} - elements data-attributes
 */
const priceData         = 'price';
const titleData         = 'title';

/**
 * @returns {Element} <div class="<monthClass>"></div>
 */
const createMonthElement = () => {
    const el = document.createElement('div');
    el.classList.add(monthClass);

    return el;
};

/**
 * @param mm {number} month 0-11
 * @returns {Element} <div class="<monthNameClass>"><monthNames[mm]></div>
 */
const createMonthNameElement = (mm) => {
    const el = document.createElement('div');
    el.classList.add(monthNameClass);
    el.innerText = monthNames[mm];
    return el;
};

/**
 * @returns {Element} <div class="<itemsClass> <chartsContainerClass>"></div>
 */
const createChartsContainerElement = () => {
    const el = document.createElement('div');
    el.classList.add(itemsClass);
    el.classList.add(chartsContainerClass);

    return el;
};

/**
 * @returns {Element} <div class="<itemsClass> <daysContainerClass>"></div>
 */
const createDaysContainerElement = () => {
    const el = document.createElement('div');
    el.classList.add(itemsClass);
    el.classList.add(daysContainerClass);

    return el;
};

/**
 *
 * @param price {number} price for the day
 * @param biggestPrice {number} - biggest price
 * @returns {Element} <div class="<itemClass> <chartItemClass>" style="height: <getChartHeight(price, biggestPrice)>" data-price="<price>" data-title="от <price> $"></div>
 */

const createChartItemElement = (price, biggestPrice) => {
    const el = document.createElement('div');
    el.classList.add(itemClass);
    el.classList.add(chartItemClass);
    el.style.height = getChartHeight(price, biggestPrice) + '%';
    el.dataset[priceData] = price;
    el.dataset[titleData] = `от ${price} $`;

    return el;
};


/**
 * @param yyyy {number} year
 * @param mm {number} month 0-11
 * @param dd {number} day 1-31
 * @returns {Element} <div class="<itemClass> <dayItemClass> <dayOffClass?>"><day></div>
 */
const createDayItemElement = (yyyy = new Date().getFullYear(), mm, dd) => {
    const el = document.createElement('div');
    el.classList.add(itemClass);
    el.classList.add(dayItemClass);
    el.innerText = dd;

    if (isDayOff(yyyy, mm, dd)) {
        el.classList.add(dayOffClass);
    }

    return el;
};

/**
 * Generate charts
 * @param prices {[[number]]}
 */
const init = (prices) => {
    const containerEl = document.querySelector(containerClass);

    // if there's no container
    if (!containerEl) {
        return;
    }
    // if incorrect data
    if (!Array.isArray(prices)) {
        throw new Error(`Expected data to be an array`);
    }

    if (!prices.every(item => Array.isArray(item))) {
        throw new Error(`Expected data to be an array of arrays`);
    }

    if (!prices.every(item => item.every(n => typeof n === 'number'))) {
        throw new Error(`Expected data to be an array of arrays of numbers`);
    }

    const cachedBiggestPrice = biggestPrice(prices);

    prices.forEach((monthPrices, monthIndex) => {
        const month = createMonthElement();
        const charts = createChartsContainerElement();
        const days = createDaysContainerElement();

        monthPrices.forEach((price, dayIndex) => {
            const chartItem = createChartItemElement(price, cachedBiggestPrice);
            const dayItem = createDayItemElement(new Date().getFullYear(), monthIndex, dayIndex + 1);

            charts.appendChild(chartItem);
            days.appendChild(dayItem);
        });

        const monthName = createMonthNameElement(monthIndex);

        month.appendChild(charts);
        month.appendChild(days);
        month.appendChild(monthName);
        containerEl.appendChild(month);
    });
};

/**
 * Initialization
 */
module.exports = (data) => {
    init(data);
};