import EventEmitter from 'events'
import formatMoney from '../utils/formatMoney.js'

export default class OffersTable extends EventEmitter  {
  constructor ($rootEl) {
    super()
    this.$rootEl = $rootEl
    var q = (q) => this.$rootEl.querySelector(q)
    this.$tbody = q('tbody')

    this.$tbody.addEventListener('click', e => {
      var $el = e.target
      if ($el.hasAttribute('data-exchanger')) {
        var exchanger = $el.getAttribute('data-exchanger')
        if ($el.hasAttribute('data-adjust')) {
          this.emit('adjust', exchanger, $el.getAttribute('data-adjust'))
        } else {
          this.emit('exchange', exchanger)  
        }
      }
    })

  }

  _getRowLabel (attr) {
    return this.$rootEl.getAttribute('data-label-' + attr)
  }

  _createRow ($offer) {
    var row = document.createElement('tr')
    var amountCol = document.createElement('td')
    var $amountParts = [$offer.amount, $offer.currency]
    if ($offer.minmax) {
      $amountParts.unshift(this._getRowLabel($offer.minmax))
    }
      $amountParts = $amountParts.map(function(el){

      if (!isNaN(el)){
        el = formatMoney(el, 6)

      }
        return el

    })
    amountCol.innerHTML = $amountParts.join(' ')
    amountCol.classList.add($offer.minmax ? 'adjust' : 'get')
    amountCol.setAttribute('data-label', this._getRowLabel('amount'))
    row.appendChild(amountCol)

    if ($offer.save) {
      var saveCol = document.createElement('td')
      saveCol.classList.add('save')
      saveCol.setAttribute('data-label', this._getRowLabel('save'))

      var pctEl = document.createElement('span')
      if($offer.save.pct === '0' || $offer.save.pct === 'NaN' || isNaN($offer.save.pct)){
          $offer.save.pct = '0.00'
      }
      pctEl.innerHTML = ($offer.save.pct === '0.00') ? '-' : $offer.save.pct +'%';
      saveCol.appendChild(pctEl)

      var fiatEl = document.createElement('span')
      if($offer.save.fiat === '0' || $offer.save.fiat === 'NaN' || isNaN($offer.save.fiat)){
          $offer.save.fiat = '0.00'
      }
      fiatEl.innerHTML = ($offer.save.fiat === '0.00') ? '-' : '(~' + $offer.save.fiat + '$)';
      saveCol.appendChild(fiatEl)
      
      row.appendChild(saveCol)
    }
    
    var serviceCol = document.createElement('td');
    serviceCol.classList.add('service');
    serviceCol.setAttribute('data-label', this._getRowLabel('service'))
    var serviceImage = document.createElement('img')
    serviceImage.classList.add('partner-logo')
    serviceImage.width = 100
    // console.log(exchanger)
    serviceImage.src = '/resources/images/partners/' + $offer.exchanger + ".png"
    // serviceImage.src = '/resources/images/partners/evercoin.svg'

    serviceCol.appendChild(serviceImage)
    // serviceCol.innerHTML = $offer.exchanger
    row.appendChild(serviceCol)


    var buttonCol = document.createElement('td')
    var buttonEl = document.createElement('button')
    buttonEl.classList.add('button')
    if ($offer.save) {
      buttonEl.classList.add('secondary')
    }
    buttonEl.innerHTML = this._getRowLabel('button')
    
    if ($offer.minmax) {
      buttonEl.dataset.adjust = $offer.amount  
    }
    buttonEl.dataset.exchanger = $offer.exchanger
    buttonCol.appendChild(buttonEl)
    row.appendChild(buttonCol)
    
    return row
  }

  update ($offers) {
    this.render($offers)
  }

  render ($offers) {
    var $tbody = this.$tbody
    if ($offers.length > 0) {
      this.$rootEl.style.display = 'block'
    } else {
      this.$rootEl.style.display = 'none'
    }
    $tbody.innerHTML = ''
    for (var i = 0; i < $offers.length; i++) {
      let $offer = $offers[i]
      var $row = this._createRow($offer)
      $tbody.appendChild($row)
    }
  }
}

