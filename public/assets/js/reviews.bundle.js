webpackJsonp([1],{

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _siema = __webpack_require__(93);

var _siema2 = _interopRequireDefault(_siema);

var _throttle = __webpack_require__(14);

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PAGE_DATA_ATTR = 'data-reviews-page';

var Reviews = function () {
  function Reviews($el) {
    _classCallCheck(this, Reviews);

    // import(/* webpackChunkName: "siema" */ 'siema').then(module => {
    //   var Siema = module.default;
    //   // new Reviews()
    //   console.log('Siema loaded');
    // });
    this.rootEl = $el;
    this.listEl = $el.querySelector('[data-reviews-list]');
    this.paginationEl = $el.querySelector('[data-reviews-pagination]');
    this.visibleOnMobileEl = $el.querySelector('[data-reviews-visible-on-mobile]');
    this.isMobile = this._isMobile();
    this.mobileItems = [].slice.call(this.listEl.querySelectorAll('.reviews-item')).reduce(function (list, el) {
      list.push(el.cloneNode(true));
      return list;
    }, []);
    this.desktopItems = this.mobileItems.reduce(function (result, item) {
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

    this.initSlider();
    this._initEvents();
  }

  _createClass(Reviews, [{
    key: '_initEvents',
    value: function _initEvents() {
      var _this2 = this;

      var reInitSlider = (0, _throttle2.default)(this.reInitSlider.bind(this), 500);
      window.addEventListener('resize', reInitSlider);

      // pagination
      this.rootEl.addEventListener('click', function (e) {
        var el = null;
        if (e.target.hasAttribute(PAGE_DATA_ATTR)) {
          el = e.target;
        } else if (e.target.closest('[' + PAGE_DATA_ATTR + ']')) {
          el = e.target.closest('[' + PAGE_DATA_ATTR + ']');
        }

        if (el) {
          var action = el.dataset.reviewsPage;
          switch (action) {
            case 'prev':
              _this2.slider.prev();
              break;
            case 'next':
              _this2.slider.next();
              break;
            default:
              _this2.slider.goTo(action);
          }
          e.preventDefault();
        }
      });
    }
  }, {
    key: '_isMobile',
    value: function _isMobile() {
      return this.visibleOnMobileEl.offsetParent !== null;
    }
  }, {
    key: 'reInitSlider',
    value: function reInitSlider() {
      if (this.isMobile === this._isMobile()) {
        return;
      }
      this.isMobile = this._isMobile();
      if (_typeof(this.slider) === 'object') {
        this.slider.destroy(true, this.initSlider.bind(this));
      } else {
        this.initSlider();
      }
    }
  }, {
    key: 'initSlider',
    value: function initSlider($el) {
      if (this.isMobile) {
        this._renderItems(this.mobileItems);
      } else {
        this._renderItems(this.desktopItems);
      }
      var _this = this;
      this.slider = new _siema2.default({
        selector: this.listEl,
        perPage: 1,
        onInit: function onInit() {
          var current = _this.paginationEl.querySelector('[' + PAGE_DATA_ATTR + '="0"]');
          if (current) {
            current.classList.add('cur');
          }
        },
        onChange: function onChange() {
          var that = this;
          var els = _this.paginationEl.querySelectorAll('li');
          [].forEach.call(els, function (el) {
            if (el.dataset.reviewsPage == that.currentSlide) {
              el.classList.add('cur');
            } else {
              el.classList.remove('cur');
            }
          });
        }
      });
    }
  }, {
    key: '_renderItems',
    value: function _renderItems(items) {
      this.listEl.innerHTML = '';
      for (var i = 0; i < items.length; i++) {
        this.listEl.appendChild(items[i]);
      }
      this._renderPagination(items);
    }
  }, {
    key: '_renderPagination',
    value: function _renderPagination(items) {
      this.paginationEl.innerHTML = '';
      for (var i = 0; i < items.length; i++) {
        this.paginationEl.append(this._createPaginationItem(i));
      }
    }
  }, {
    key: '_createPaginationItem',
    value: function _createPaginationItem(page) {
      var el = document.createElement('li');
      el.dataset.reviewsPage = page;

      var a = document.createElement('a');
      a.href = '#reviews-page-' + page;
      el.appendChild(a);

      var i = document.createElement('i');
      a.appendChild(i);

      return el;
    }
  }]);

  return Reviews;
}();

exports.default = Reviews;

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.Siema = t() : e.Siema = t();
}("undefined" != typeof self ? self : undefined, function () {
  return function (e) {
    function t(r) {
      if (i[r]) return i[r].exports;var n = i[r] = { i: r, l: !1, exports: {} };return e[r].call(n.exports, n, n.exports, t), n.l = !0, n.exports;
    }var i = {};return t.m = e, t.c = i, t.d = function (e, i, r) {
      t.o(e, i) || Object.defineProperty(e, i, { configurable: !1, enumerable: !0, get: r });
    }, t.n = function (e) {
      var i = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };return t.d(i, "a", i), i;
    }, t.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, t.p = "", t(t.s = 0);
  }([function (e, t, i) {
    "use strict";
    function r(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(t, "__esModule", { value: !0 });var n = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return typeof e === "undefined" ? "undefined" : _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
    },
        s = function () {
      function e(e, t) {
        for (var i = 0; i < t.length; i++) {
          var r = t[i];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }return function (t, i, r) {
        return i && e(t.prototype, i), r && e(t, r), t;
      };
    }(),
        l = function () {
      function e(t) {
        var i = this;if (r(this, e), this.config = e.mergeSettings(t), this.selector = "string" == typeof this.config.selector ? document.querySelector(this.config.selector) : this.config.selector, null === this.selector) throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(), this.selectorWidth = this.selector.offsetWidth, this.innerElements = [].slice.call(this.selector.children), this.currentSlide = this.config.loop ? this.config.startIndex % this.innerElements.length : Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage)), this.transformProperty = e.webkitOrNot(), ["resizeHandler", "touchstartHandler", "touchendHandler", "touchmoveHandler", "mousedownHandler", "mouseupHandler", "mouseleaveHandler", "mousemoveHandler", "clickHandler"].forEach(function (e) {
          i[e] = i[e].bind(i);
        }), this.init();
      }return s(e, [{ key: "attachEvents", value: function value() {
          window.addEventListener("resize", this.resizeHandler), this.config.draggable && (this.pointerDown = !1, this.drag = { startX: 0, endX: 0, startY: 0, letItGo: null, preventClick: !1 }, this.selector.addEventListener("touchstart", this.touchstartHandler), this.selector.addEventListener("touchend", this.touchendHandler), this.selector.addEventListener("touchmove", this.touchmoveHandler), this.selector.addEventListener("mousedown", this.mousedownHandler), this.selector.addEventListener("mouseup", this.mouseupHandler), this.selector.addEventListener("mouseleave", this.mouseleaveHandler), this.selector.addEventListener("mousemove", this.mousemoveHandler), this.selector.addEventListener("click", this.clickHandler));
        } }, { key: "detachEvents", value: function value() {
          window.removeEventListener("resize", this.resizeHandler), this.selector.removeEventListener("touchstart", this.touchstartHandler), this.selector.removeEventListener("touchend", this.touchendHandler), this.selector.removeEventListener("touchmove", this.touchmoveHandler), this.selector.removeEventListener("mousedown", this.mousedownHandler), this.selector.removeEventListener("mouseup", this.mouseupHandler), this.selector.removeEventListener("mouseleave", this.mouseleaveHandler), this.selector.removeEventListener("mousemove", this.mousemoveHandler), this.selector.removeEventListener("click", this.clickHandler);
        } }, { key: "init", value: function value() {
          this.attachEvents(), this.selector.style.overflow = "hidden", this.selector.style.direction = this.config.rtl ? "rtl" : "ltr", this.buildSliderFrame(), this.config.onInit.call(this);
        } }, { key: "buildSliderFrame", value: function value() {
          var e = this.selectorWidth / this.perPage,
              t = this.config.loop ? this.innerElements.length + 2 * this.perPage : this.innerElements.length;this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = e * t + "px", this.enableTransition(), this.config.draggable && (this.selector.style.cursor = "-webkit-grab");var i = document.createDocumentFragment();if (this.config.loop) for (var r = this.innerElements.length - this.perPage; r < this.innerElements.length; r++) {
            var n = this.buildSliderFrameItem(this.innerElements[r].cloneNode(!0));i.appendChild(n);
          }for (var s = 0; s < this.innerElements.length; s++) {
            var l = this.buildSliderFrameItem(this.innerElements[s]);i.appendChild(l);
          }if (this.config.loop) for (var o = 0; o < this.perPage; o++) {
            var a = this.buildSliderFrameItem(this.innerElements[o].cloneNode(!0));i.appendChild(a);
          }this.sliderFrame.appendChild(i), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent();
        } }, { key: "buildSliderFrameItem", value: function value(e) {
          var t = document.createElement("div");return t.style.cssFloat = this.config.rtl ? "right" : "left", t.style.float = this.config.rtl ? "right" : "left", t.style.width = (this.config.loop ? 100 / (this.innerElements.length + 2 * this.perPage) : 100 / this.innerElements.length) + "%", t.appendChild(e), t;
        } }, { key: "resolveSlidesNumber", value: function value() {
          if ("number" == typeof this.config.perPage) this.perPage = this.config.perPage;else if ("object" === n(this.config.perPage)) {
            this.perPage = 1;for (var e in this.config.perPage) {
              window.innerWidth >= e && (this.perPage = this.config.perPage[e]);
            }
          }
        } }, { key: "prev", value: function value() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
              t = arguments[1];if (!(this.innerElements.length <= this.perPage)) {
            var i = this.currentSlide;if (this.config.loop) {
              if (this.currentSlide - e < 0) {
                this.disableTransition();var r = this.currentSlide + this.innerElements.length,
                    n = this.perPage,
                    s = r + n,
                    l = (this.config.rtl ? 1 : -1) * s * (this.selectorWidth / this.perPage),
                    o = this.config.draggable ? this.drag.endX - this.drag.startX : 0;this.sliderFrame.style[this.transformProperty] = "translate3d(" + (l + o) + "px, 0, 0)", this.currentSlide = r - e;
              } else this.currentSlide = this.currentSlide - e;
            } else this.currentSlide = Math.max(this.currentSlide - e, 0);i !== this.currentSlide && (this.slideToCurrent(this.config.loop), this.config.onChange.call(this), t && t.call(this));
          }
        } }, { key: "next", value: function value() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
              t = arguments[1];if (!(this.innerElements.length <= this.perPage)) {
            var i = this.currentSlide;if (this.config.loop) {
              if (this.currentSlide + e > this.innerElements.length - this.perPage) {
                this.disableTransition();var r = this.currentSlide - this.innerElements.length,
                    n = this.perPage,
                    s = r + n,
                    l = (this.config.rtl ? 1 : -1) * s * (this.selectorWidth / this.perPage),
                    o = this.config.draggable ? this.drag.endX - this.drag.startX : 0;this.sliderFrame.style[this.transformProperty] = "translate3d(" + (l + o) + "px, 0, 0)", this.currentSlide = r + e;
              } else this.currentSlide = this.currentSlide + e;
            } else this.currentSlide = Math.min(this.currentSlide + e, this.innerElements.length - this.perPage);i !== this.currentSlide && (this.slideToCurrent(this.config.loop), this.config.onChange.call(this), t && t.call(this));
          }
        } }, { key: "disableTransition", value: function value() {
          this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;
        } }, { key: "enableTransition", value: function value() {
          this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing;
        } }, { key: "goTo", value: function value(e, t) {
          if (!(this.innerElements.length <= this.perPage)) {
            var i = this.currentSlide;this.currentSlide = this.config.loop ? e % this.innerElements.length : Math.min(Math.max(e, 0), this.innerElements.length - this.perPage), i !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), t && t.call(this));
          }
        } }, { key: "slideToCurrent", value: function value(e) {
          var t = this,
              i = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide,
              r = (this.config.rtl ? 1 : -1) * i * (this.selectorWidth / this.perPage);e ? requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              t.enableTransition(), t.sliderFrame.style[t.transformProperty] = "translate3d(" + r + "px, 0, 0)";
            });
          }) : this.sliderFrame.style[this.transformProperty] = "translate3d(" + r + "px, 0, 0)";
        } }, { key: "updateAfterDrag", value: function value() {
          var e = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX),
              t = Math.abs(e),
              i = this.config.multipleDrag ? Math.ceil(t / (this.selectorWidth / this.perPage)) : 1,
              r = e > 0 && this.currentSlide - i < 0,
              n = e < 0 && this.currentSlide + i > this.innerElements.length - this.perPage;e > 0 && t > this.config.threshold && this.innerElements.length > this.perPage ? this.prev(i) : e < 0 && t > this.config.threshold && this.innerElements.length > this.perPage && this.next(i), this.slideToCurrent(r || n);
        } }, { key: "resizeHandler", value: function value() {
          this.resolveSlidesNumber(), this.currentSlide + this.perPage > this.innerElements.length && (this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage), this.selectorWidth = this.selector.offsetWidth, this.buildSliderFrame();
        } }, { key: "clearDrag", value: function value() {
          this.drag = { startX: 0, endX: 0, startY: 0, letItGo: null, preventClick: this.drag.preventClick };
        } }, { key: "touchstartHandler", value: function value(e) {
          -1 !== ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e.target.nodeName) || (e.stopPropagation(), this.pointerDown = !0, this.drag.startX = e.touches[0].pageX, this.drag.startY = e.touches[0].pageY);
        } }, { key: "touchendHandler", value: function value(e) {
          e.stopPropagation(), this.pointerDown = !1, this.enableTransition(), this.drag.endX && this.updateAfterDrag(), this.clearDrag();
        } }, { key: "touchmoveHandler", value: function value(e) {
          if (e.stopPropagation(), null === this.drag.letItGo && (this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX)), this.pointerDown && this.drag.letItGo) {
            e.preventDefault(), this.drag.endX = e.touches[0].pageX, this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;var t = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide,
                i = t * (this.selectorWidth / this.perPage),
                r = this.drag.endX - this.drag.startX,
                n = this.config.rtl ? i + r : i - r;this.sliderFrame.style[this.transformProperty] = "translate3d(" + (this.config.rtl ? 1 : -1) * n + "px, 0, 0)";
          }
        } }, { key: "mousedownHandler", value: function value(e) {
          -1 !== ["TEXTAREA", "OPTION", "INPUT", "SELECT"].indexOf(e.target.nodeName) || (e.preventDefault(), e.stopPropagation(), this.pointerDown = !0, this.drag.startX = e.pageX);
        } }, { key: "mouseupHandler", value: function value(e) {
          e.stopPropagation(), this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.enableTransition(), this.drag.endX && this.updateAfterDrag(), this.clearDrag();
        } }, { key: "mousemoveHandler", value: function value(e) {
          if (e.preventDefault(), this.pointerDown) {
            "A" === e.target.nodeName && (this.drag.preventClick = !0), this.drag.endX = e.pageX, this.selector.style.cursor = "-webkit-grabbing", this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing;var t = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide,
                i = t * (this.selectorWidth / this.perPage),
                r = this.drag.endX - this.drag.startX,
                n = this.config.rtl ? i + r : i - r;this.sliderFrame.style[this.transformProperty] = "translate3d(" + (this.config.rtl ? 1 : -1) * n + "px, 0, 0)";
          }
        } }, { key: "mouseleaveHandler", value: function value(e) {
          this.pointerDown && (this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.drag.endX = e.pageX, this.drag.preventClick = !1, this.enableTransition(), this.updateAfterDrag(), this.clearDrag());
        } }, { key: "clickHandler", value: function value(e) {
          this.drag.preventClick && e.preventDefault(), this.drag.preventClick = !1;
        } }, { key: "remove", value: function value(e, t) {
          if (e < 0 || e >= this.innerElements.length) throw new Error("Item to remove doesn't exist 😭");var i = e < this.currentSlide,
              r = this.currentSlide + this.perPage - 1 === e;(i || r) && this.currentSlide--, this.innerElements.splice(e, 1), this.buildSliderFrame(), t && t.call(this);
        } }, { key: "insert", value: function value(e, t, i) {
          if (t < 0 || t > this.innerElements.length + 1) throw new Error("Unable to inset it at this index 😭");if (-1 !== this.innerElements.indexOf(e)) throw new Error("The same item in a carousel? Really? Nope 😭");var r = t <= this.currentSlide > 0 && this.innerElements.length;this.currentSlide = r ? this.currentSlide + 1 : this.currentSlide, this.innerElements.splice(t, 0, e), this.buildSliderFrame(), i && i.call(this);
        } }, { key: "prepend", value: function value(e, t) {
          this.insert(e, 0), t && t.call(this);
        } }, { key: "append", value: function value(e, t) {
          this.insert(e, this.innerElements.length + 1), t && t.call(this);
        } }, { key: "destroy", value: function value() {
          var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
              t = arguments[1];if (this.detachEvents(), this.selector.style.cursor = "auto", e) {
            for (var i = document.createDocumentFragment(), r = 0; r < this.innerElements.length; r++) {
              i.appendChild(this.innerElements[r]);
            }this.selector.innerHTML = "", this.selector.appendChild(i), this.selector.removeAttribute("style");
          }t && t.call(this);
        } }], [{ key: "mergeSettings", value: function value(e) {
          var t = { selector: ".siema", duration: 200, easing: "ease-out", perPage: 1, startIndex: 0, draggable: !0, multipleDrag: !0, threshold: 20, loop: !1, rtl: !1, onInit: function onInit() {}, onChange: function onChange() {} },
              i = e;for (var r in i) {
            t[r] = i[r];
          }return t;
        } }, { key: "webkitOrNot", value: function value() {
          return "string" == typeof document.documentElement.style.transform ? "transform" : "WebkitTransform";
        } }]), e;
    }();t.default = l, e.exports = t.default;
  }]);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ })

});