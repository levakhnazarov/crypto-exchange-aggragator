import EventEmitter from 'events'
import $ from 'jquery'
import {TweenMax, Linear,Circ} from "gsap/TweenMax";
import {TimelineMax} from "gsap/TimelineMax";
import {TimelineLite} from "gsap/TimelineLite";
export default class OffersTable extends EventEmitter  {
  constructor ($rootEl) {
    super()
    this.$rootEl = $rootEl
    var q = (q) => this.$rootEl.querySelector(q)

//https://greensock.com/forums/topic/16853-animated-list-of-items-only-show-1-item-at-a-time/
//       var term01 = $('.wheel-03 .term1');
//       var term02 = $('.wheel-03 .term2');
//       var term03 = $('.wheel-03 .term3');
//       var term04 = $('.wheel-03 .term4');
//       var term05 = $('.wheel-03 .term5');
//       var term06 = $('.wheel-03 .term6');
//       var term07 = $('.wheel-03 .term7');
//       var term08 = $('.wheel-03 .term8');
//       var term09 = $('.wheel-03 .term9');
//       var term10 = $('.wheel-03 .term10');
//       var term11 = $('.wheel-03 .term11');
//       var term12 = $('.wheel-03 .term12');
//       var term13 = $('.wheel-03 .term13');

      var item = $(".transactions-listy li")
      for (var i=0; i<item.length; i++) {
          var tl = new TimelineMax({delay:i*Math.random() * (20 - 1) + 1});
          tl.from(item[i], 2, {y:100, autoAlpha:0})
          tl.to(item[i], 2, {y:-100, autoAlpha:0}, "+=1");
      }



      // $('.show').on('click', function() {
      //     tl.play(0);
      // })

      // $('.hide').on('click', function() {
      //     tl.reverse(-1);
      // })


//Just a timer function
//       i = 0;
//       setInterval(function() {
//           $("p.timer").text(i);
//           i++;
//       }, 1000);


  };



    // this.$tbody = q('tbody')
    //
    // this.$tbody.addEventListener('click', e => {
    //   var $el = e.target
    //   if ($el.hasAttribute('data-exchanger')) {
    //     var exchanger = $el.getAttribute('data-exchanger')
    //     if ($el.hasAttribute('data-adjust')) {
    //       this.emit('adjust', exchanger, $el.getAttribute('data-adjust'))
    //     } else {
    //       this.emit('exchange', exchanger)
    //     }
    //   }
    // })

  // }

  // _getRowLabel (attr) {
  //   return this.$rootEl.getAttribute('data-label-' + attr)
  // }
  //
  // _createRow ($offer) {
  //   var row = document.createElement('tr')
  //   var amountCol = document.createElement('td')
  //   var $amountParts = [$offer.amount, $offer.currency]
  //   if ($offer.minmax) {
  //     $amountParts.unshift(this._getRowLabel($offer.minmax))
  //   }
  //   amountCol.innerHTML = $amountParts.join(' ')
  //   amountCol.classList.add($offer.minmax ? 'adjust' : 'get')
  //   amountCol.setAttribute('data-label', this._getRowLabel('amount'))
  //   row.appendChild(amountCol)
  //
  //   if ($offer.save) {
  //     var saveCol = document.createElement('td')
  //     saveCol.classList.add('save')
  //     saveCol.setAttribute('data-label', this._getRowLabel('save'))
  //
  //     var pctEl = document.createElement('span')
  //     pctEl.innerHTML = $offer.save.pct + '% '
  //     saveCol.appendChild(pctEl)
  //
  //     var fiatEl = document.createElement('span')
  //     fiatEl.innerHTML = '(~' + $offer.save.fiat + '$)'
  //     saveCol.appendChild(fiatEl)
  //
  //     row.appendChild(saveCol)
  //   }
  //
  //   var serviceCol = document.createElement('td')
  //   serviceCol.classList.add('service')
  //   serviceCol.setAttribute('data-label', this._getRowLabel('service'))
  //   var serviceImage = document.createElement('img')
  //   serviceImage.classList.add('partner-logo')
  //   serviceImage.height = 16
  //     // console.log(exchanger)
  //   serviceImage.src = '/resources/images/partners/' + $offer.exchanger + ".svg"
  //   // serviceImage.src = '/resources/images/partners/evercoin.svg'
  //
  //   // serviceCol.appendChild(serviceImage)
  //   serviceCol.innerHTML = $offer.exchanger
  //   row.appendChild(serviceCol)
  //
  //
  //   var buttonCol = document.createElement('td')
  //   var buttonEl = document.createElement('button')
  //   buttonEl.classList.add('button')
  //   if ($offer.save) {
  //     buttonEl.classList.add('secondary')
  //   }
  //   buttonEl.innerHTML = this._getRowLabel('button')
  //
  //   if ($offer.minmax) {
  //     buttonEl.dataset.adjust = $offer.amount
  //   }
  //   buttonEl.dataset.exchanger = $offer.exchanger
  //   buttonCol.appendChild(buttonEl)
  //   row.appendChild(buttonCol)
  //
  //   return row
  // }
  //
  // update ($offers) {
  //   this.render($offers)
  // }
  //
  // render ($offers) {
  //   var $tbody = this.$tbody
  //   if ($offers.length > 0) {
  //     this.$rootEl.style.display = 'block'
  //   } else {
  //     this.$rootEl.style.display = 'none'
  //   }
  //   $tbody.innerHTML = ''
  //   for (var i = 0; i < $offers.length; i++) {
  //     let $offer = $offers[i]
  //     var $row = this._createRow($offer)
  //     $tbody.appendChild($row)
  //   }
  // }
}

