import debounce from '../utils/debounce.js'
import EventEmitter from 'events'
export default class ExchangeStore extends EventEmitter {
  constructor (options = {}) {
    super()
    this._currencies = []
    this._pairs = []

    this._inputCurrencies = []
    this._inputCurrency = null
    this._inputCurrencyObj = null
    this._inputAmount = 0
    this._inputAmountInUsd = 0

    this._outputCurrencies = []
    this._outputCurrency = null
    this._outputAmount = 0

    this._offers = []
    this._processedOffers = []

    this._init(options)

    this.on('_fetchAndCalc', () => {
      this._fetchOffers().then(() => {
        this._inputAmountAdjust()
        this._calc()
      })
    })
  }

  _init (options) {



    this._fetchCurrencies().then(() => {
      return this._fetchPairs()
    }).then(() => {
      this._initDefaultValues(options, () => {
        this.emit('init', true)
      })
    })
  }

  _initDefaultValues (options, callback) {
    this._updateInputCurrencies()
    this._setDefaultInputCurrency(typeof options.inputCurrency !== 'undefined' ? options.inputCurrency : null)
    this._updateOutputCurrencies()
    this._setDefaultOutputCurrency(typeof options.outputCurrency !== 'undefined' ? options.outputCurrency : null)
    this._fetchOffers().then(() => {
      this.setInputAmount(typeof options.inputAmount !== 'undefined' ? options.inputAmount : null)
      callback()
    })
  }

  canSwap () {
    return this._pairs.filter((p) => {
      return p[0] == this.getOutputCurrency() && p[1] == this.getInputCurrency()
    }).length > 0
  }

  swap () {
    if (this.canSwap()) {
      let input = this.getInputCurrency()
      let output = this.getOutputCurrency()
      this._inputCurrency = output
      this._inputCurrencyObj = this._getCurrencyByTicker(output)
      this._outputCurrency = input
      this._outputCurrencyObj = this._getCurrencyByTicker(input)
      this.emit('_fetchAndCalc')
    }
  }

  setCurrencies (value) {
    this._currencies = value
  }

  _fetchCurrencies () {
    return fetch('/currencies')
      .then(res => res.json())
      .then(items => this.setCurrencies(items))
  }

  setPairs (value) {
    this._pairs = value
    this._updateInputCurrencies()
  }

  _fetchPairs () {
    return fetch('/pairs')
      .then(res => res.json())
      .then(items => this.setPairs(items))
  }

  getInputCurrencies () {
    return this._inputCurrencies
  }

  getInputCurrency () {
    return this._inputCurrency
  }

  setInputCurrency (value) {
    if (!value) {
      this._setDefaultInputCurrency()
    } else {
      if (value === this.getOutputCurrency() && this.canSwap()) {
        this.swap()
        return
      } else {
        this._inputCurrency = value
        this._inputCurrencyObj = this._getCurrencyByTicker(value)  
      }
      
      // this._inputCurrencyObj = this._inputCurrencies.reduce((obj, currency) => {
      //   if (currency.ticker === value) {
      //     obj = currency
      //   }
      //   return obj
      // }, null)
    }
    this.emit('_fetchAndCalc', true)
    this._updateOutputCurrencies()
  }

  _setDefaultInputCurrency (ticker = null) {
    let currency
    if (ticker) {
      currency = this._getCurrencyByTicker(ticker)
    }

    if (!currency) {
      currency = this._inputCurrencies[0] // default
    }
    this._inputCurrency = currency.ticker
    this._inputCurrencyObj = currency
  }

  getInputAmount () {
    return this._inputAmount
  }

  setInputAmount (value) {
    this._inputAmount = value || this.getMinInputAmount()
    this._calcInputAmountInUsd()
    this._calc()
  }

  _inputAmountAdjust () {
    if (this._inputAmount < this.getMinInputAmount()) {
      this._inputAmount = this.getMinInputAmount()
    } else if (this._inputAmount > this.getMaxInputAmount()) {
      this._inputAmount = this.getMaxInputAmount()
    }
  }

  getMinInputAmount () {
    return this._offers.reduce((min, offer) => {
      if (!min || min > offer.min_amount) {
        min = offer.min_amount 
      }
      return min
    }, null)
  }

  getMaxInputAmount () {
    return this._offers.reduce((max, offer) => {
      // null in max is ifinitu
      if (!max || (offer.max_amount === null || max < offer.max_amount)) {
        max = offer.max_amount === null ? Number.POSITIVE_INFINITY : offer.max_amount
      }
      return max
    }, null)
  }

  getInputAmountInUsd () {
    return this._inputAmountInUsd
  }

  setInputAmountInUsd (value) {
    this._inputAmountInUsd = value
    this._calcInputAmountInUsd(true)
    this._calc()
  }

  getOutputCurrencies () {
    return this._outputCurrencies
  }

  getOutputCurrency () {
    return this._outputCurrency
  }

  setOutputCurrency (value) {
    if (value === this.getInputCurrency()) {
      if (this.canSwap()) {
        this.swap()
        return
      }
    }
    this._outputCurrency = value
    this._outputCurrencyObj = this._getCurrencyByTicker(value)
    this.emit('_fetchAndCalc')
  }

  getOutputAmount () {
    return this._outputAmount
  }

  setOutputAmount (value) {
    this._outputAmount = value
    this._calc(true)
  }

  _getCurrencyByTicker (ticker) {
    let currency = this._currencies.filter(i => i.ticker == ticker)
    if (currency.length > 0) {
      return currency[0]
    }
    return null
  }

  _updateInputCurrencies () {
    this._inputCurrencies = this._currencies.reduce((result, currency) => {
      for (var i = 0; i < this._pairs.length; i++) {
        let pair = this._pairs[i]
        if (currency.ticker === pair[0]) {
          result.push(currency)
          break
        }
      }
      return result
    }, [])
  }

  _updateOutputCurrencies () {
    this._outputCurrencies = this._currencies.reduce((result, currency) => {
      var pairs = this._pairs.filter(pair => {
        return pair[0] === this._inputCurrency
      })
      for (var i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        if (currency.ticker === pair[1]) {
          result.push(currency);
          break
        }
      }
      return result
    }, [])
  }

  _setDefaultOutputCurrency (ticker = null) {
    let currency;

    if (ticker) {
      currency = this._getCurrencyByTicker(ticker)
    }

    if (!currency) {
      currency = this._outputCurrencies[0] // default
    }
    this._outputCurrency = currency.ticker
    this._outputCurrencyObj = currency
  }

  _fetchOffers() {
    let options = {
      method: 'post',
      body: {
        input_currency: this._inputCurrency,
        output_currency: this._outputCurrency,
      }
    };


    return fetch('/offers', options)
      .then(res => res.json())
      .then(items => this._offers = items)
      .catch(err => console.log(err))
  }

  getOffers () {
    return this._processedOffers
  }

  _calcOffers (reverse, amount) {

    let lowOffer = this._offers.sort(function (a, b) {
      return a.rate - b.rate
    }).reduce((result, offer) => {
      if (!result) {
        result = offer
      }
      return result
    }, null)

    let outputCurrencyUsdRate = this._outputCurrencyObj.price_usd;

    // var $outUsdRate = this._getOutCurrencyUsdRate()
    // var $lowAmount = lowOffer ? (lowOffer.rate * $inAmount) / 1 : 0
    // var $lowUsd = $low.length > 0 ? $lowAmount * $outUsdRate : 0

    return this._offers.reduce((result, offer) => {
      let amt, previousBest = result.best
      
      if (reverse) {
        amt = (amount * 1) / offer.rate
        offer.input_amount = amt
        offer.output_amount = amount
      } else {
        amt = amount * offer.rate / 1
        offer.input_amount = amount
        offer.output_amount = amt
      }
      // ((a-b) / ((a+b) / 2)) * 100
      let lowOutputAmount = lowOffer 
        ? (lowOffer.rate * offer.input_amount) / 1 
        : 0
      let lowUsd = lowOffer 
        ? lowOutputAmount * outputCurrencyUsdRate 
        : 0
      offer.save = {
        pct: (offer.output_amount - lowOutputAmount) / offer.output_amount * 100,
        usd: offer.output_amount * outputCurrencyUsdRate - lowUsd
      }

      let inMinRange = offer.input_amount >= offer.min_amount
      let inMaxRange = offer.input_amount <= offer.max_amount || offer.max_amount === null
      let isBest = !previousBest || offer.rate > previousBest.rate

      if (inMinRange && inMaxRange && isBest) {
        if (previousBest) {
          result.other.push(previousBest) // previous best move to others
        }
        result.best = offer
      } else if (!inMinRange || !inMaxRange) {
        result.over.push(offer)
      } else {
        result.other.push(offer)
      }
      result.total++
      return result
    }, {
      best: null,
      other: [],
      over: [],
      total: 0
    })
  }

  _calc (reverse = false) {
    let amount = reverse ? this._outputAmount : this._inputAmount
    let offers = this._calcOffers(reverse, amount)
    this._processedOffers = offers
    if (offers.best) {
      if (reverse) {
        this._inputAmount = offers.best.input_amount
        this._calcInputAmountInUsd()
      } else {
        this._outputAmount = offers.best.output_amount
      }
    }
    this.emit('calc', true)
  }

  _calcInputAmountInUsd (reverse = false) {
    if (this._inputCurrencyObj) {
      if (reverse) {
        this._inputAmount =  1 / this._inputCurrencyObj.price_usd * this._inputAmountInUsd
      } else {
        this._inputAmountInUsd = this._inputCurrencyObj.price_usd * this._inputAmount  
      }
    }
  }
}