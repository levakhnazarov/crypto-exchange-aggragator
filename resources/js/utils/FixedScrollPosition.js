import EventEmitter from 'events'

const SCROLLBAR_HIDDEN_CLASS = 'dialog-is-open'
const SCROLLBAR_MEASURE_CLASS = 'dialog-scrollbar-measure'

class FixedScrollPosition extends EventEmitter  {
  constructor () {
    super() // required
    this.scrollbarWidthPx = this._getScrollbarWidth() + 'px'
  }

  _headerSetPaddingRight (value) {
    return document.querySelector('.header').style.paddingRight = value
  }

  add () {
    let body = document.body
    body.classList.add(SCROLLBAR_HIDDEN_CLASS)
    body.style.paddingRight = this.scrollbarWidthPx
    this._headerSetPaddingRight(this.scrollbarWidthPx)
  }

  remove () {
    let body = document.body
    body.classList.remove(SCROLLBAR_HIDDEN_CLASS)
    body.style.paddingRight = ''
    this._headerSetPaddingRight('')
  }

  _getScrollbarWidth() {
    const scrollDiv = document.createElement('div')
    scrollDiv.className = SCROLLBAR_MEASURE_CLASS
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
  }
}


export default FixedScrollPosition