
import debounce from '../utils/debounce'
import throttle from '../utils/throttle'
// var logger = require('morgan');
// var check = require('check-types');

//TODO CodeStyle

import CurrenciesTable from './CurrenciesTable'
export default class Currencies {

  constructor () {
    this.$searchField = document.querySelector('[data-currencies-search]');
    this.$preloader = document.querySelector('.preloader');
    this.$table = new CurrenciesTable(document.querySelector('[data-currencies-table]'));
    
    this.$table.on('sort', sort => this._fetch(false))

    this.$loadedCount = this.$table.getTotal()
    this.$limit = this.$loadedCount
    this.$totalCount = null

    this._initEvents()
    this._hidePreloader()
  }

  _initEvents () {
    var _fetch = debounce(this._update.bind(this), 250)
    this.$searchField.addEventListener('input', _fetch)

    var _more = throttle(this._more.bind(this), 500)
    window.addEventListener('scroll', _more)
  }

  _update () {
    this._fetch(false)
  }

  _more () {


    if (this.$totalCount === 0) return
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var bottom = document.documentElement.scrollHeight - document.documentElement.clientHeight
    var footerHeight = document.querySelector('.footer').clientHeight
    if (scrollTop > bottom - footerHeight) {
      this._fetch(true)
    }
  }
    /**
     * TODO we must fetch numbers from server only as numbers!
     * Get currencies table
     * @private
     */
  _fetch(more = false) {


    if (this._visiblePreloader()) return
    var loadedCount = this.$table.getTotal()
    if (more && this.$totalCount > 0 && loadedCount >= this.$totalCount) {
      return
    }
    this._showPreloader()
    if (!more) {
      this.$table.update([])
    }


    fetch(window.location.pathname, {
      method: 'post',
      body: JSON.stringify({ 
        query: this.$searchField.value,
        offset: more ? loadedCount : 0,
        limit: this.$limit,
        sort: this.$table.getCurrentSort()
      }),
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {

        //TODO Only Numbers from backend!

        var modifiedRows = res.rows.filter(function(row){
         // if(!check.null(row.change_1h_pct) &&
         //     !check.null( row.change_1h_usd) &&
         //     !check.null( row.change_7d_pct) &&
         //     !check.null( row.change_7d_usd) &&
         //     !check.null( row.change_24h_pct) &&
         //     !check.null( row.change_24h_usd)){
         if(1===1){
           return true;
         }else{
           return false
         }
        });


      if (more) {
        this.$table.append(modifiedRows)
      } else {
        this.$table.update(modifiedRows)
      }
      this.$totalCount = modifiedRows.length
      this._hidePreloader()
    }).catch(err => {

      this.$totalCount = 0;
      this._hidePreloader()
    })
  }

  _visiblePreloader() {
    return !this.$preloader.classList.contains('hide');
  }

  _showPreloader () {
    this.$preloader.classList.remove('hide');
  }

  _hidePreloader () {
    this.$preloader.classList.add('hide');
  }
}