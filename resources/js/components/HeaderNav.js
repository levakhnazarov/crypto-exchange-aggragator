import FixedScrollPosition from '../utils/FixedScrollPosition'
import throttle from '../utils/throttle.js'
export default class HeaderNav {

  constructor () {
    this.initEvents()
    this.$fixscroll = new FixedScrollPosition()
  }

  initEvents () {
    document.addEventListener('click', event => {
      var el = event.target
      if (el.closest('[data-nav-show]')) {
        var id = el.closest('[data-nav-show]').getAttribute('data-nav-show')
        this.showComponent(id)
        if (id == 'track') {
          document.querySelector('#track-order-input').focus()
        }
        return false
      } else if (el.closest('[data-nav-close]') || el.getAttribute('data-nav-overlay') === '') {
        this.hideComponent()
      } else if (!el.closest('[data-nav-component]') || el.getAttribute('data-nav-component') == '') {
        this.hideComponent()
      }
    });

    var that = this
    var responsive = throttle(function () {
      that._responsive()
    }, 250)

    window.addEventListener('resize', () => responsive())
  }

  showComponent (component) {
    document.querySelector('[data-nav-display]').dataset.navDisplay = component;

    document.body.style.overflowY = "hidden";
    if(component === "menu"){
      document.body.style.position = "fixed";
      document.documentElement.style.position = "fixed";
    }

    this._responsive();
  }

  hideComponent () {
    document.querySelector('[data-nav-display]').dataset.navDisplay = '';
      document.body.style.position = "unset";
      document.documentElement.style.position = "unset";

      this._responsive();
    document.body.style.overflowY = "scroll";

  }

  _responsive () {
    var existCloseBtn = document.querySelector('.nav-mobile-close').offsetParent !== null
    if (existCloseBtn) {
      this.$fixscroll.add();
    } else {
      this.$fixscroll.remove();
    }
  }

}