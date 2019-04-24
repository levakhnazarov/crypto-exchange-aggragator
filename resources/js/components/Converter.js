
import EventEmitter from 'events'
import roundTo from 'round-to'

import http from '../utils/http.js'
import CurrencyAmount from './CurrencyAmount.js'
import BestOffer from './BestOffer.js'
import OffersTable from './OffersTable.js'
import serialize from 'form-serialize'
import animateUtil from '../utils/animate.js'



export default class Converter extends EventEmitter {
  constructor($rootEl, $socket) {
    super();


    this.$rootEl = $rootEl;
    this.$TYPE = $rootEl.dataset.type;
    this.$form = $rootEl.closest('form');
    this.$in = new CurrencyAmount($rootEl.querySelector('[data-converter="input-amount-currency"]'));
    this.$out = new CurrencyAmount($rootEl.querySelector('[data-converter="output-amount-currency"]'));
    this.$submitBtn = $rootEl.querySelector('[data-converter="exchange"]')
    this.$more = $rootEl.querySelector('[data-converter="more"]')
    this.$direction = $rootEl.querySelector('[data-converter="direction"]')
    this.$exchanger = $rootEl.querySelector('[name="exchanger"]')
    this.$savedPctInput = $rootEl.querySelector('[name="saved"]')
    this.$savePercentageSpan = $rootEl.querySelector('.converter-save');
    this.$loader = $rootEl.querySelector('.converter .loading');
    this.$exchBtn = $rootEl.querySelector('.converter .svg.svg-exchange');
    this.$exchBtnFixed = $rootEl.querySelector('.exchange-details .svg-exchange-arrow-right')


      if (this.$exchBtnFixed) {
          this.$exchBtnFixed.classList.add('hidden')
      }
      this.$exchBtn.classList.add('hidden')
      this.$loader.classList.add('show')


    if (this.$TYPE === "first"){
        this.$submitBtn.addEventListener('click', e => {
            this.$form.method = 'post';
            this.$form.action = '/exchange/offers'
        })

    }
    if (this.$more) {
      this.$more.addEventListener('click', e => {
        this.$form.method = 'post';
        this.$form.action = '/exchange/offers'
      })
    }

    if (this.$submitBtn && this.$TYPE !== "first") {
      this.$submitBtn.addEventListener('click', e => {
        this.$form.method = 'post'
        this.$form.action = [
          '/exchange',
          this.$exchanger.value,
          [this.getCurrencyIn().toLowerCase(), this.getCurrencyOut().toLowerCase()].join('-'),
        ].join('/')
        this.$form.submit()
      })
    }


    var that = this;
    var subInit = function () {


      that.fetchData().then(() => {
      that._updateCurrencies()
        return that.fetchOffers()
      }).then(() => {
        that._updateMinMaxAmount()
        that._calc()
          var s = document.getElementsByTagName('body')[0];
          s.classList.add('loaded')
      })
    }();
    // subInit()
    

    // $socket.on('rates-update', function () {
    //
    //   console.log("socket rates update init rerender ")
    //   subInit()
    // })

    this.$in.on('amountChange', value => {
        this.$exchBtn.classList.add('hidden')
        this.$loader.classList.add('show')
      this._calc()
    })
    

    this.$out.on('amountChange', value => {
        this.$exchBtn.classList.add('hidden')
        this.$loader.classList.add('show')
      this._calc(true)
    })
    

    if (this.$TYPE == 'details') {
      this.$in.disabledCurrency()
      this.$out.disabledCurrency()
      this._setFixedDirection()

      this.$form.addEventListener('submit', e => {
        e.preventDefault()
        this.$exchBtnFixed.classList.add('hidden')
        this.$loader.classList.add('show')
        return http('post', '/api/exchange', {}, serialize(this.$form, {hash: true}))
          .then(res => {
            window.location = res.url
          })
          .catch(err => console.log(err))
      })
    }

    

    if (this.$TYPE !== 'details') {
      this.initCurrencyEvents()
      this.initOptionalComponents()
    }

  }

  initCurrencyEvents () {


    this.$in.on('currencyChange', (value, old) => {

        this.$exchBtn.classList.add('hidden')
        this.$loader.classList.add('show')

      if (value === this.$out.getCurrency()) {
        this.$out.setCurrency(old)
      }
      this._updateCurrencies()
      this._updateDirection()
      this._updatePairs(value, 'in')
      this.fetchOffers().then(res => {

        if (res.length > 0) {
            this.$in.$rootEl.querySelector('input').disabled = false;
            this._updateMinMaxAmount()
            this._calc()
        }else{
            this.$in.$rootEl.querySelector('input').disabled = true;
        }

      })
    })

    this.$out.on('currencyChange', (value, old) => {
        this.$exchBtn.classList.add('hidden')
        this.$loader.classList.add('show')

        if (value === this.$in.getCurrency()) {
        this.$in.setCurrency(old)
      }
      this._updateCurrencies()
      this._updateDirection()
      this._updatePairs(value, 'out')
        this.fetchOffers().then(res => {

          if (res.length > 0) {
              this.$out.$rootEl.querySelector('input').disabled = false;
              this._updateMinMaxAmount()
              this._calc()
          }else{
              this.$out.$rootEl.querySelector('input').disabled = true;
          }

      })
    })

    this.$direction.addEventListener('click', e => {

      if (this._currentDirectionCanSwap()) {
        this.$exchBtn.classList.add('hidden')
        this.$loader.classList.add('show')

        var a = this.$in.getCurrency()
        var b = this.$out.getCurrency()
        this.$in.setCurrency(b)
        this.$out.setCurrency(a)
        this._updateCurrencies()
        this.fetchOffers().then(res => {
          this._updateMinMaxAmount()
          this._calc()
        })
      }
    })
  }

  initOptionalComponents () {
    this.$bestOfferEl = document.querySelector('[data-offer="wrap"]')
    if (this.$bestOfferEl) {
      this.$bestOfferComponent = new BestOffer(this.$bestOfferEl);

      this.$bestOfferComponent.on('exchange', exchanger => {
        
        this.$form.method = 'post'
        this.$form.action = [
          '/exchange', 
          exchanger, 
          [this.getCurrencyIn().toLowerCase(), this.getCurrencyOut().toLowerCase()].join('-'),
        ].join('/')
        this.$exchanger.value = exchanger
        this.$form.submit()
      })
    }

    this.$otherOffersTableEl = document.querySelector('[data-offers="other"]')
    if (this.$otherOffersTableEl) {
      this.$otherOffers= new OffersTable(this.$otherOffersTableEl)
      this.$otherOffers.on('exchange', exchanger => {
        this.$form.method = 'post'
        this.$form.action = [
          '/exchange', 
          exchanger, 
          [this.getCurrencyIn().toLowerCase(), this.getCurrencyOut().toLowerCase()].join('-'),
        ].join('/')
        this.$exchanger.value = exchanger
        this.$form.submit()
      })
    }

    this.$adjustOffersTableEl = document.querySelector('[data-offers="adjust-limit"]')
    if (this.$adjustOffersTableEl) {
      this.$adjustOffers = new OffersTable(this.$adjustOffersTableEl)
      this.$adjustOffers.on('adjust', (exchanger, amount) => {
        this.$in.setAmount(amount)
        this.$form.method = 'post'
        this.$form.action = [
          '/exchange', 
          exchanger, 
          [this.getCurrencyIn().toLowerCase(), this.getCurrencyOut().toLowerCase()].join('-'),
        ].join('/')
        this.$exchanger.value = exchanger
        this.$form.submit()
      })
    }
  }

  _setFixedDirection () {
    this.$direction.dataset.direction = 'fixed'
  }

  _setAnyDirection () {
    this.$direction.dataset.direction = 'any'
  }

  _currentDirectionCanSwap () {
    return this.$pairs.reduce((can, pair) => {
      if (pair.from === this.$out.getCurrency() && pair.to === this.$in.getCurrency()) {
        can = true
      }
      return can
    }, false)
  }

  _updateDirection () {
    if (this._currentDirectionCanSwap()) {
      this._setAnyDirection()
    } else {
      this._setFixedDirection()
    }
  }

  fetchData () {
    return this.fetchCurrencies()
      .then(() => this.fetchPairs())
  }

  fetchCurrencies () {
    // var params = []
    // if (this.$TYPE == 'details') {
    //   params = {
    //     tickers: [this.getCurrencyIn(), this.getCurrencyOut()].join(',')
    //   }
    // }
    return http('get', '/api/exchange/currencies')
      .then(res => this.$currencies = res)
      .catch(err => console.log(err))
  }

  fetchPairs () {
    var params = []
    if (this.$TYPE == 'details') {
      return new Promise((resolve, reject) => {
        resolve(this.$pairs = [{from: this.getCurrencyIn(), to: this.getCurrencyOut()}])
      })
    }
    return http('get', '/api/exchange/pairs')
      .then(res => this.$pairs = res)
      .catch(err => console.log(err))
  }

  _updatePairs(ticker, direction) {

    if(ticker === '') return;

    return http('get', '/pairs/'+ ticker)
        .then(res => {

          if(res.json.length === 0) return;
          if (direction === 'in'){
              this.$out.updateCurrencies(res)
          }else{
              this.$in.updateCurrencies(res)

          }



        })
        .catch(err => console.log(err))
  }

  fetchOffers () {
    var params = {from: this.getCurrencyIn(), to: this.getCurrencyOut()}
    if (this.$TYPE == 'details') {
      params.exchanger = this.$exchanger.value
    }
    return http('get', '/api/exchange/offers', params)
      .then(res => {
        this.updateMoreOffersCounter(res.length)
        return this.$offers = res
      })
      .catch(err => console.log(err))
  }

  _updateCurrencies () {

    this.$in.updateCurrencies(this.$currencies.filter(currency => {
      if (currency.ticker === this.$in.getCurrency()) {
        this.$in.setUsdRate(currency.usd)
      }

      return this.$pairs.reduce((result, pair) => {
        if (pair.from === currency.ticker) {

          result = true
        }
        return result
      }, false)
    }))


    this.$out.updateCurrencies(this.$currencies.filter(currency => {
      return this.$pairs.reduce((result, pair) => {
        if (pair.from === this.$in.getCurrency() && pair.to === currency.ticker) {
          result = true
        }
        return result
      }, false)
    }))
  }

  getCurrencyIn () {
    return this.$in.getCurrency()
  }

  getCurrencyOut () {
    return this.$out.getCurrency()
  }

  getAmountIn () {
    return this.$in.getAmount() 
  }

  getAmountOut () {
    return this.$out.getAmount() 
  }

  getMin () {
    return this.$offers.reduce((value, offer) => {
      if (value === null || offer.min < value) {
        value = offer.min
      }
      return value
    }, null)
  }

  getMax () {
    return this.$offers.reduce((value, offer) => {
      if (value !== null && (offer.max === null || offer.max > value)) {
        value = offer.max
      }
      return value
    }, 0)
  }

  _updateMinMaxAmount () {

    let val = this.$in._convertUsdToAmount(50)
    this.$in.setMin(
        val
      // typeof this.getMin() === 'number' ? roundTo.up(this.getMin(), 6) : this.getMin()
    )
    this.$in.setMax(
      typeof this.getMax() === 'number' ? roundTo.down(this.getMax(), 6) : this.getMax()
    )
    // this.$in.setInUsd(50)
  }

  _getBestOfferByAmount (amount, reverse = false) {
    return this.$offers.reduce((best, offer) => {
      var amt = amount
      var overMin = null
      var overMax = null
      if (reverse) {
        amt = ( amount * 1 ) / offer.rate
        if (amt < this.getMin()) {
          overMin = true
        } else if (this.getMax() && amt > this.getMax()) {
          overMax = true
        }
      }

      if (overMin) {

        if (amt < offer.min && (best === null || offer.min < best.min)) {
          best = offer
        }
      } else if (overMax) {

        if (amt > offer.max && (best === null || offer.max > best.max)) {
          if (!best || best.max !== null) {
            best = offer  
          }
        }
      } else {

        if (amt >= offer.min && (amt <= offer.max || offer.max === null) && (best === null || offer.rate > best.rate)) {
          best = offer
        }
      }
      
      return best
    }, null)
  }


  _calc (reverse = false) {
    var $offer = this._getBestOfferByAmount(!reverse ? this.$in.getAmount() : this.$out.getAmount(), reverse);

    if ($offer) {
      if (!reverse) {
        let amount = ($offer.rate * this.$in.getAmount()) / 1;
        this.$out.$amount = amount
        this.$out.setAmount( amount )
      } else {
        this.$in.setAmount( (this.$out.getAmount() * 1) / $offer.rate )
      }
      this.$exchanger.value = $offer.exchanger
    }
    
    
    this._updateUiComponents()
  }


  _getOutCurrencyUsdRate () {
    return this.$currencies.reduce((rate, currency) => {

      if(currency.ticker.toLowerCase() === this.$out.getCurrency().toLowerCase()) {
        if (currency.usd) {
          rate = currency.usd  
        }
      }
      return rate
    }, 0)
  }

  _updateUiComponents () {

    var $inAmount = this.$in.getAmount(),
        $inCurrency = this.$in.getCurrency().toUpperCase(),
        $outAmount = this.$out.getAmount(),
        $outCurrency = this.$out.getCurrency().toUpperCase(),
        $low = this.$offers.sort(function (a, b) { return a.rate - b.rate}),
        $outUsdRate = this._getOutCurrencyUsdRate(),
        $lowAmount = $low.length > 0 ? ($low[0].rate * $inAmount) / 1 : 0,
        $lowUsd = $low.length > 0 ? $lowAmount * $outUsdRate : 0;

    var $best = this.$offers.reduce((best, offer) => {
      if ($inAmount >= offer.min && ($inAmount <= offer.max || offer.max === null) &&
          (best === null || offer.rate > best.rate)) { best = offer }
            return best
    }, null);


      if ($best) {
        let percent = ((($best.rate * $inAmount) / $lowAmount) * 100) - 100;
        let pct = (percent.toFixed(0) !== "0" ) ? percent.toFixed(0) : percent.toFixed(2);

        if (this.$savePercentageSpan != null && !isNaN(percent) && pct !== '0.00') {
          var innerHtml
            if(!document.querySelector('.converter--full').classList.contains('offers-converter')){
              innerHtml = $best.exchanger + '<br/> ' + pct + '%';
            }else{
              innerHtml = $best.exchanger + ' ' + pct + '%';
            }

            this.$savePercentageSpan.querySelector('span').innerHTML = innerHtml;
            this.$savedPctInput.value = pct;
            // animateUtil(this.$savePercentageSpan, 300)
        }
    }

    // TODO строгая типизация, изолированность методов и свойств, scope

    if (this.$bestOfferComponent) {
        let amount = $best ? (($best.rate * $inAmount) / 1) : 0,
            bestPct = (((amount / $lowAmount) * 100) - 100).toFixed(2);

        bestPct = (bestPct === Math.floor(parseFloat(bestPct))) ? parseFloat(bestPct).toFixed(0) : parseFloat(bestPct).toFixed(2)

        this.$bestOfferComponent.update($best ? {
        amount: amount,
        currency: $outCurrency,
        exchanger: $best.exchanger,
        save: {
          pct: bestPct,
          fiat: ((amount * $outUsdRate) - $lowUsd).toFixed(2)
        }
      } : null)


    } else {
      $best = null
    }
    

    var $other = this.$offers.reduce((other, offer) => {
      var notBest = $best ? offer.exchanger != $best.exchanger : true
      if (notBest && $inAmount >= offer.min && ($inAmount <= offer.max || offer.max === null)) {


        var amount = (offer.rate * $inAmount) / 1,
            pct = (((amount / $lowAmount) * 100) - 100).toFixed(2),
            fiat = ((amount * $outUsdRate) - $lowUsd).toFixed(2);
            pct = (pct === Math.floor(parseFloat(pct))) ? parseFloat(pct).toFixed(0) : parseFloat(pct).toFixed(2)

          other.push({
            amount: +Number(amount).toFixed(6),
            currency: $outCurrency,
            rate: offer.rate,
            exchanger: offer.exchanger,
            save: {
              pct: (pct === 'NaN') ? '0' : pct,
              fiat: (fiat === 'NaN') ? '0' : fiat
            }
        })
      }
      return other
    }, []).sort(function (a, b) {
      return b.rate - a.rate
    });

    
    var $adjust = this.$offers.reduce(function (adjust, offer) {
      var notBest = $best ? offer.exchanger != $best.exchanger : true
      if (notBest && ($inAmount < offer.min || ($inAmount > offer.max && offer.max !== null))) {
        var amount
        var minmax
        if ($inAmount < offer.min) {
          amount = offer.min
          minmax = 'min'
        } else if ($inAmount > offer.max) {
          amount = offer.max
          minmax = 'max'
        }
        adjust.push({
          amount: +Number(amount).toFixed(6),
          currency: $inCurrency,
          minmax: minmax,
          exchanger: offer.exchanger
        })
      }
      return adjust
    }, [])

    if (this.$otherOffers) {
      this.$otherOffers.update($other)  
    }
    
    if (this.$adjustOffers) {
      this.$adjustOffers.update($adjust)  
    }


      if (this.$loader) {
        this.$loader.classList.remove('show')
      }
      if (this.$exchBtn){
        this.$exchBtn.classList.remove('hidden')
      }
      if (this.$exchBtnFixed) {
        this.$exchBtnFixed.classList.remove('hidden')
      }

  }

  updateMoreOffersCounter (count) {
    if (this.$more) {
      if (count > 1) {
        // animateUtil(this.$more, 300)
        this.$more.classList.remove('hide')

        this.$savePercentageSpan.classList.remove('hide')


          this.$more.querySelector('span').innerHTML = count - 1
      } else {
        this.$more.classList.add('hide')
        this.$savePercentageSpan.classList.add('hide')
      }
    }
  }
}


