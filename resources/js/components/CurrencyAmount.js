import EventEmitter from 'events'
import FixedScrollPosition from '../utils/FixedScrollPosition.js'
import throttle from '../utils/throttle.js'

import CountUp from 'countup.js'

import formatMoney from '../utils/formatMoney.js'
const EVENT_AMOUNT_CHANGE = 'amountChange'
const EVENT_CURRENCY_CHANGE = 'currencyChange'

export default class CurrencyAmount extends EventEmitter {
  constructor ($rootEl, $currencies = []) {


    super()
    Logger.useDefaults();

      this.$rootEl = $rootEl;
    this.$currencies = $currencies;
    this.initElements();
    this.initEvents();
    this._renderCurrenciesList();
    this.$fixscroll = new FixedScrollPosition();
    this.initValues()
  }

  initElements () {
    var q = (q) => this.$rootEl.querySelector(q);


    this.$amountFieldEl = q('[data-ca="amount-field"]');
    this.$currencyFieldEl = q('[data-ca="currency-field"]');
    this.$currencyButtonEl = q('[data-ca="currency-button"]');
    this.$currencyListEl = q('[data-ca="currency-list"]');
    this.$currencySearchFieldEl = q('[data-ca="currency-search-field"]');
    this.$currencyCloseButtonEls = this.$rootEl.querySelectorAll('[data-ca="currency-list-close"]');
    this.$minmaxHelper = q('[data-amount-helper="min-max"]');
    this.$usdHelper = q('[data-amount-helper="usd"]');
    this.$outAmountPlaceholder = q('label[for="out_amount"]')


  }

  initValues () {
    var $amount = this.$amountFieldEl;
    this.$amount = $amount.value;
    this._updateMinMaxHelper()
    this._convertAmountToUsd()
  }

  initEvents () {
    // amount events
    this.on(EVENT_AMOUNT_CHANGE, e => {

      this._updateMinMaxHelper();
      this._convertAmountToUsd()
    });

    this.$amountFieldEl.addEventListener('input', e => {

      this.emit(EVENT_AMOUNT_CHANGE, e.target.value)
    });

    if (this.$minmaxHelper) {
      this.$minmaxHelper.addEventListener('click', e => {
        this._setMinMaxValue()
          this.setInUsd(50)
      })
    }

    if (this.$usdHelper) {
      this.$usdHelper.addEventListener('input', e => {
        this._convertUsdToAmount()

        this.emit(EVENT_AMOUNT_CHANGE, this.getAmount())
      })
    }

    var that = this
    this.responsiveListThrottle = throttle(function () {
      that.responsiveList()
    }, 250)

    window.addEventListener('resize', () => this.responsiveListThrottle())


    
    /**
     * currency events
     */
    
    this.$currencyButtonEl.addEventListener('click', e => this.toggleList())

    // click outside
    window.addEventListener('click', e => {
      if (!e.target.closest('[data-ca="currency-dropdown"]')) {
        this.hideList()
      }
    });
    // push esc
    window.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        this.hideList()
      }
    })
    this.on(EVENT_CURRENCY_CHANGE, this.setCurrency)

      this.$currencyListEl.addEventListener('click', e => {

      var element = e.target
      var el
      if (element.parentNode.tagName.toLowerCase() === 'li') {
        el = element.parentNode
      } else if (element.tagName.toLowerCase() === 'li') {
        el = element
      }

      if (el) {
        if (this.getCurrency() != el.dataset.value) {
          this.emit(EVENT_CURRENCY_CHANGE, el.dataset.value, this.getCurrency())
        }
        this.hideList()
      }
    })


    // search 
    this.$currencySearchFieldEl.addEventListener('input', e => this._renderCurrenciesList(e.target.value))

    // close (for mobile)
    var $closeButtons = this.$currencyCloseButtonEls
    for (var i = 0; i < $closeButtons.length; i++) {
      $closeButtons[i].addEventListener('click', e => this.hideList())
    }
  }

  disabledCurrency () {
    this.$currencyButtonEl.disabled = -1
  }

  getAmount () {
    return Number(this.$amountFieldEl.value)
  }

  setAmount (value) {


    this.$amountFieldEl.value = formatMoney(value, 6)
    this._updateMinMaxHelper()
  }

  getMin () {
    return Number(this.$amountFieldEl.min)
  }

  setMin (value) {
    this.$amountFieldEl.min = +Number(value).toFixed(6)
    this._updateMinMaxHelper()
  }

  getMax () {
    return Number(this.$amountFieldEl.max)
  }

  setMax (value) {
    this.$amountFieldEl.max = value ? +Number(value).toFixed(6) : value
    this._updateMinMaxHelper()
  }

  _updateMinMaxHelper () {

      var outHelper = document.querySelector('[data-converter="output-amount-currency"]');

      if (!this.$minmaxHelper) {
      return
      }
    var dataset = this.$minmaxHelper.dataset

    dataset.currency = this.getCurrency()
    if (this.getMax() && this.getAmount() > this.getMax()) {
      dataset.show = 'max'
      dataset.value = this.getMax()
      dataset.valid = false

      outHelper.classList.add('invalid');


    } else if (this.getMin() > 0) {
      dataset.valid = true;
      dataset.show = 'min';
      dataset.value = this.getMin()
      outHelper.classList.remove('invalid');

      if (this.getAmount() < this.getMin()) {
        dataset.valid = false;
        outHelper.classList.add('invalid');

      }
    } else {
      dataset.valid = true;

        outHelper.classList.remove('invalid');

        // dataset.show = 'any'
    }
  }

  _setMinMaxValue () {
    if (this.getAmount() > this.getMax()) {
      this.setAmount(this.getMax())
      this.emit(EVENT_AMOUNT_CHANGE, this.getMax())
    } else {
      this.setAmount(this.getMin())
      this.emit(EVENT_AMOUNT_CHANGE, this.getMin())
    }
  }


  getUsdRate () {
    return this.$usdRate
  }

  setUsdRate (value) {
    this.$usdRate = value;
    this._convertAmountToUsd()
  }

  _convertUsdToAmount (inputVal = false) {

    var value = inputVal ? (1 / this.getUsdRate()) * inputVal : (1 / this.getUsdRate()) * this.getInUsd()

    if(inputVal) return value;
    this.setAmount(value)
  }

  getInUsd () {
    return this.$usdHelper.value
  }

  setInUsd (value) {

    if(isNaN(this.$usdHelper.value)) this.$usdHelper.value = 0;

    if(typeof value === 'string'){
      value = parseFloat(value.replace(',',''))
    }
    if(value === 0 ) return



    var numAnim = new CountUp(this.$usdHelper, this.$usdHelper.value, value, 2);
    if (!numAnim.error) {
        numAnim.start();
    } else {
        console.error(numAnim.error);
    }


    this.$usdHelper.value = value
  }

  _convertAmountToUsd () {
    if (!this.$usdHelper) { return }
    var value = parseFloat((this.getAmount() * this.getUsdRate()).toFixed(2))
    if (value === Math.floor(value)){ value = value.toFixed(0) }
    // value = (typeof value === 'number') ? value : parseFloat(value)

    this.setInUsd(formatMoney(value, 2))
  }

  getCurrency () {
    return this.$currencyFieldEl.value
  }

  setCurrency (value, old) {

    this.$currencyFieldEl.value = value
    this.setCurrencyUi(value, old)
  }

  setCurrencyUi (value, old) {

    var $el = this.$currencyButtonEl
    $el.setAttribute('data-len', value.length)
    $el.querySelector('span').innerHTML = value;

      var svg = $el.querySelector('svg')

      svg.classList.remove('svg-' + old)
      svg.classList.add('svg-' + value)
      var used = svg.querySelector('use')
          svg.removeChild(used)
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/sprite.svg#'+value)
          svg.appendChild(use)

  }

  updateCurrencies (items) {

    // Logger.debug(items);



    this.$currencies = items;
    var existCurrentInList = items.reduce((exist, item) => {
      if (item.ticker === this.getCurrency()) {
        exist = true
      }
      return exist
    }, false)
    if (!existCurrentInList && typeof items[0] !== 'undefined') {
      this.emit(EVENT_CURRENCY_CHANGE, items[0].ticker, this.getCurrency())
      this.setCurrency(items[0].ticker)
    }
    this._renderCurrenciesList()
  }

  responsiveList () {
    var $mobileCloseButton = this.$currencyCloseButtonEls[0]
    if (this.isDisplayedList() && $mobileCloseButton.offsetParent !== null) {
      this.$fixscroll.add()
    } else {
      this.$fixscroll.remove()
    }
  }

  isDisplayedList () {
    return this.$currencyButtonEl.classList.contains('cydp-show')
  }

  toggleList () {
    if (this.isDisplayedList()) {
      this.hideList()
    } else {
      this.showList()
    }
  }

  showList () {
    this.$currencyButtonEl.classList.add('cydp-show')
    this.responsiveList()
  }

  hideList () {
    this.$currencyButtonEl.classList.remove('cydp-show')
    this.responsiveList()
  }

  _createCurrencyItem ($ticker, $name) {
    var el = document.createElement('li');

    el.setAttribute('data-value', $ticker);

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.classList.add('svg', 'svg-'+$ticker)
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/sprite.svg#'+$ticker)
      svg.appendChild(use)

      el.appendChild(svg)

      var nameEl = document.createElement('span')
      nameEl.innerHTML = $name
      el.appendChild(nameEl)

      var tickerEl = document.createElement('strong')
      tickerEl.innerHTML = $ticker.toUpperCase()
      el.appendChild(tickerEl)
    
    return el
  }

  _renderCurrenciesList (searchQuery = '') {
    searchQuery = searchQuery.toLowerCase().trim();
    var $list = this.$currencyListEl;
    var $items = this.$currencies;
    $list.innerHTML = '';


    if (searchQuery !== '') {
      $items = $items.filter($item => {
        return $item.ticker.toLowerCase().search(searchQuery) !== -1 || $item.name.toLowerCase().search(searchQuery) !== -1
      }).unique()
    }

    for (var i = 0; i < $items.length; i++) {
      let $item = $items[i];
      let $el = this._createCurrencyItem($item.ticker, $item.name);
      $list.appendChild($el)
    }
  }

}
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].ticker === a[j].ticker)
                a.splice(j--, 1);
        }
    }

    return a;
};

