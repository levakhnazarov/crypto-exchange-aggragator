import EventEmitter from 'events'
import currencyFormatter from 'currency-formatter'

// var currencyFormatter = require('currency-formatter');



export default class CurrenciesTable extends EventEmitter {
  constructor ($el) {
    super()
    this.$table = $el
    this.$exchangeBtnTpl = $el.getAttribute('data-currencies-exchange-btn-template') || 'Exchange {currency}'
    this.$thead = $el.querySelector('thead')
    this.$tbody = $el.querySelector('tbody')
    this._updateTotal()

    this.$thead.addEventListener('click', e => {
      var el = e.target.closest('[data-sort-col]')
      
      if (el && el.dataset && el.dataset.sortCol) {
        var current = this._getCurrentSortEl()
        if (current && current !== el) {
          current.dataset.sortDirection = ''
        }
        el.dataset.sortDirection = el.dataset.sortDirection == 'desc' ? 'asc' : 'desc'
        this.emit('sort', this.getCurrentSort())
      }
    })
  }

  _getCurrentSortEl () {
    return this.$thead.querySelector('th:not([data-sort-direction=""])');
  }

  getCurrentSort () {
    var el = this._getCurrentSortEl()
    if (el) {
      return el.dataset.sortCol + ':' + el.dataset.sortDirection
    }
    return 'name:asc';
  }

  update (data) {
    this._renderTable(data, false)
  }

  append (data) {
    this._renderTable(data, true)
  }

  getTotal () {
    return this.$_total
  }

  _updateTotal () {
    this.$_total = this.$tbody.querySelectorAll('tr').length
  }

  _renderTable (data, append) {


    var tbody = this.$tbody;
    if (!append) {
      tbody.innerHTML = '';  
    }


    for (var i = 0; i < data.length; i++) {

      let el = this._createRow(data[i])


      tbody.appendChild(el)
      setTimeout(function() {
        el.classList.add('append-anim')
      }, 10)
    }
    this._updateTotal()
  }

  _createRow (data) {


      var prettyFormattedPrice = currencyFormatter.format(data.price_usd, {
          decimal:	',',
          thousand: ' ',
          precision: 2,
      });


    var row = document.createElement('tr')

    // first column
    var nameAndSymbolCol = document.createElement('td')
    nameAndSymbolCol.classList.add('currency')
    nameAndSymbolCol.dataset.rate = '$' + prettyFormattedPrice;
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')


      svg.classList.add('svg', 'svg-'+data.ticker)
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/sprite.svg#'+data.ticker)
      svg.appendChild(use)

    // var symbol = document.createElement('img')
    // symbol.src = '/resources/images/currencies/' + data.ticker.toLowerCase() + '.svg'
    // symbol.width = 24
    // symbol.height = 24

    var name = document.createElement('span')
    name.innerHTML = data.name + ' (' + data.ticker.toUpperCase() + ')'

    nameAndSymbolCol.appendChild(svg)
    nameAndSymbolCol.appendChild(name)

    row.appendChild(nameAndSymbolCol)




    // rate
    var rateCol = document.createElement('td')
    rateCol.classList.add('rate')
    rateCol.innerHTML = '$' + prettyFormattedPrice

    row.appendChild(rateCol)

    // changes
    var changes1hCol  = this._createChangesColumn('rate-1h', data.change_1h_pct, data.change_1h_usd)
    var changes24hCol = this._createChangesColumn('rate-24h', data.change_24h_pct, data.change_24h_usd)
    var changes7dCol  = this._createChangesColumn('rate-7d', data.change_7d_pct, data.change_7d_usd)
    row.appendChild(changes1hCol)
    row.appendChild(changes24hCol)
    row.appendChild(changes7dCol)

    var buttonCol = document.createElement('td')
    var button = document.createElement('a')
    button.classList.add('button', 'responsive')
    button.href = 'offers/' +  data.ticker.toLowerCase() + '-btc'
    var span = document.createElement('span')
    span.innerHTML = this.$exchangeBtnTpl.replace('%s', data.ticker.toUpperCase())

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.classList.add('svg', 'svg-chevron-right')
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/sprite.svg#chevron-right')
    svg.appendChild(use)

    button.appendChild(span)
    button.appendChild(svg)
    buttonCol.appendChild(button)

    row.appendChild(buttonCol)

    return row
  }

  _createChangesColumn (className, pct, usd) {
    var usd = parseFloat(usd)
    var col = document.createElement('td')
    col.classList.add(className)
    if (parseFloat(pct) > 0) {
      col.classList.add('up')
    } else {
      col.classList.add('down')
    }
    col.textContent = parseFloat(pct) + '%'
    var sup = document.createElement('sup')
    if (Math.abs(usd) > 0) {
      sup.innerHTML = '$' + usd 
    }
    
    col.appendChild(sup)
    return col
  }
}