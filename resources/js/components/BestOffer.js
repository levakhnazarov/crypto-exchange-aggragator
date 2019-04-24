import EventEmitter from 'events'
var logger = require("eazy-logger").Logger({
});


export default class BestOffer extends EventEmitter  {
  constructor ($rootEl) {
    super()
    this.$rootEl = $rootEl
    var q = (q) => this.$rootEl.querySelector(q)
    this.$serviceEl = q('[data-offer="service"]')
    this.$amountEl = q('[data-offer="amount"]')
    this.$savePctEl = q('[data-offer="save-pct"]')
    this.$saveFiatEl = q('[data-offer="save-fiat"]')
    this.$submitBtn = q('[data-offer="submit"]')
    this.$submitBtn.addEventListener('click', e => {
      this.emit('exchange', this.$exchanger)
    })
  }

  update ($offer) {
    this.render($offer)
    this.$exchanger = $offer ? $offer.exchanger : null
  }

  show () {
    this.$rootEl.style.display = 'block'
  }

  hide () {
    this.$rootEl.style.display = 'none'
  }

  render ($offer) {
    if ($offer) {
        mixpanel.track("best offer");

        var $amount = +Number($offer.amount).toFixed(6)
        this.show()
        // this.$serviceEl.width = 100;
        this.$serviceEl.height = 30;
        this.$serviceEl.src = '/resources/images/partners/' + $offer.exchanger + '.svg';
        this.$serviceEl.height = '32';
        // this.$serviceEl.innerHTML = $offer.exchanger
        this.$amountEl.innerHTML = [$amount, $offer.currency.toUpperCase(), $offer.exchanger].join(' ')


      if($offer.save.fiat === '0' || $offer.save.fiat === 'NaN' || isNaN($offer.save.fiat)){
          $offer.save.fiat = '0.00'
      }
      let saveFiat = ($offer.save.fiat !== '0.00') ? ' (~$' + $offer.save.fiat + ')' : '';

      if($offer.save.pct === '0' || $offer.save.pct === 'NaN' || isNaN($offer.save.pct)){
          $offer.save.pct = '0.00'
      }
      let savePct = ($offer.save.pct === '0.00') ? '' :$offer.save.pct + '% '

      this.$savePctEl.innerHTML = savePct;
      this.$saveFiatEl.innerHTML = saveFiat;

      if (saveFiat !== '' && savePct !== ''){
          document.querySelector('.exchange-best-save').classList.remove('hidden');

      }else{
          document.querySelector('.exchange-best-save').classList.add('hidden');

      }



    } else {
      this.hide()
    }
  }
}

