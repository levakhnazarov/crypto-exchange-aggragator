import Siema from 'siema'
import throttle from '../utils/throttle.js'
const PAGE_DATA_ATTR = 'data-reviews-page'
export default class Reviews {
  constructor ($el) {
    // import(/* webpackChunkName: "siema" */ 'siema').then(module => {
    //   var Siema = module.default;
    //   // new Reviews()
    //   console.log('Siema loaded');
    // });
    this.rootEl = $el
    this.listEl = $el.querySelector('[data-reviews-list]')
    this.paginationEl = $el.querySelector('[data-reviews-pagination]')
    this.visibleOnMobileEl = $el.querySelector('[data-reviews-visible-on-mobile]')
    this.isMobile = this._isMobile()
    this.mobileItems = [].slice.call(this.listEl.querySelectorAll('.reviews-item')).reduce((list, el) => {
      list.push(el.cloneNode(true));
      return list;
    }, [])
    this.desktopItems = this.mobileItems.reduce((result, item) => {
      var cur = result.length - 1;
      var el = result[cur];
      if (typeof el === 'undefined' || el.querySelectorAll('.reviews-item').length >= 4) {
        var el = document.createElement('div');
        el.classList.add('reviews-group');
        cur = result.push(el);
      }
      el.appendChild(item.cloneNode(true));
      return result;
    }, []);   

    
    this.initSlider()
    this._initEvents()
  }

  _initEvents () {
    var reInitSlider = throttle(this.reInitSlider.bind(this), 500)
    window.addEventListener('resize', reInitSlider)

    // pagination
    this.rootEl.addEventListener('click', e => {
      var el = null;
      if (e.target.hasAttribute(PAGE_DATA_ATTR)) {
        el = e.target
      } else if (e.target.closest('[' + PAGE_DATA_ATTR + ']')) {
        el = e.target.closest('[' + PAGE_DATA_ATTR + ']')
      }

      if (el) {
        var action = el.dataset.reviewsPage;
        switch (action) {
          case 'prev':
            this.slider.prev()
            break;
          case 'next':
            this.slider.next()
            break;
          default:
            this.slider.goTo(action)
        }
        e.preventDefault();
      }
    })
  }

  _isMobile () {
    return this.visibleOnMobileEl.offsetParent !== null
  }

  reInitSlider () {
    if (this.isMobile === this._isMobile()) {
      return
    }
    this.isMobile = this._isMobile()
    if (typeof this.slider === 'object') {
      this.slider.destroy(true, this.initSlider.bind(this))
    } else {
      this.initSlider()
    }
  }

  initSlider ($el) {
    if (this.isMobile) {
      this._renderItems(this.mobileItems);
    } else {
      this._renderItems(this.desktopItems);
    }
    var _this = this
    this.slider = new Siema({
      selector: this.listEl,
      perPage: 1,
      onInit: function () {
        var current = _this.paginationEl.querySelector('[' + PAGE_DATA_ATTR + '="0"]')
        if (current) {
          current.classList.add('cur')
        }
      },
      onChange: function () {
        var that = this
        var els = _this.paginationEl.querySelectorAll('li');
        [].forEach.call(els, function(el) {
          if (el.dataset.reviewsPage == that.currentSlide) {
            el.classList.add('cur')
          } else {
            el.classList.remove('cur')
          }
        })
      }
    })
  }

  _renderItems (items) {
    this.listEl.innerHTML = '';
    for (var i = 0; i < items.length; i++) {
      this.listEl.appendChild(items[i]);
    }
    this._renderPagination(items);
  }

  _renderPagination (items) {
    this.paginationEl.innerHTML = '';
    for (var i = 0; i < items.length; i++) {
      this.paginationEl.append(this._createPaginationItem(i))
    }
  }
  _createPaginationItem (page) {
    var el = document.createElement('li');
    el.dataset.reviewsPage = page;

    var a = document.createElement('a');
    a.href = '#reviews-page-' + page;
    el.appendChild(a);

    var i = document.createElement('i');
    a.appendChild(i);

    return el;
  }
}