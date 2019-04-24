import HeaderNav from './components/HeaderNav';
import Converter from './components/Converter.js';
import TxList from './components/TxList.js';
import ClipboardJS from 'clipboard'
import Offer from './components/Offer.js';
import io from 'socket.io-client';
// const socket = io('http://' + window.location.hostname + ':4000');
import http from "./utils/http";
new HeaderNav();
new ClipboardJS('#clip');

let particlesHeight = 0;
document.addEventListener('DOMContentLoaded', e => {
    particlesJS("particles-js",
        {
            "particles": {
                "number": {
                    "value": 385,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 20,
                        "height": 20
                    }
                },
                "opacity": {
                    "value": 1,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0,
                        "sync": false
                    }
                },
                "size": {
                    "value": 2,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 4,
                        "size_min": 0.3,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 128.27296486924183,
                    "color": "#ffffff",
                    "opacity": 0.0561194221302933,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 600
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "remove"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 121.81158184520176,
                        "line_linked": {
                            "opacity": 0
                        }
                    },
                    "bubble": {
                        "distance": 250,
                        "size": 0,
                        "duration": 2,
                        "opacity": 0,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 400,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });


 var $reviews = document.querySelector('[data-reviews]');
 if ($reviews) {

     // logger.info("we have reviews dom...")
  import(/* webpackChunkName: "reviews" */ './components/Reviews.js').then(module => {
    var Reviews = module.default;
    new Reviews($reviews)
  });
 }

 if (document.querySelector('[data-currencies-table]')) {
     document.getElementById('particles-js').style.height = "60%";
        import(/* webpackChunkName: "currencies" */ './components/Currencies.js').then(module => {
        var Currencies = module.default;
        new Currencies()
  });
 }

 if (document.querySelector('.promo')) {
     document.getElementById('particles-js').style.height = "13%";
 }


    document.getElementsByTagName('body')[0].click()




    if (document.querySelector('.cutted')){

     var cutted = document.querySelector('#second-converter')
         cutted.addEventListener('click', e => {
            var c = document.querySelector(".converter--full");c.scrollIntoView({block: "end", behavior: "smooth"});

         })
     console.log(document.querySelector('.cutted'))

    }


var forms = document.querySelectorAll('[data-converter="form"]');
if (forms.length === 0) {
    var s = document.getElementsByTagName('body')[0];
    s.classList.add('loaded')

}


if (forms && forms.length > 0){
    // new Converter(forms[0], false)

    for(let i = 0; i < forms.length;i++){

        // setTimeout(function() {
            new Converter(forms[i], false)
        // }, i * 5000);

    }
}else if(!document.querySelector('.promo') && !document.querySelector('[data-currencies-table]')){
    document.getElementById('particles-js').style.height = "45%";
}


var txList = document.querySelector("#transactions-list");
if (txList){
    setTimeout(function() {

  new TxList(txList)

    }, 1000);

}


var info = document.querySelector("#info")
if (info) {
  var steps = document.querySelector("#steps")


    setInterval(function() {
    var params = {exchanger: info.dataset.exchanger, order: info.dataset.order}

    http('get', '/api/exchange/order', params)
        .then(res => {

            // info.dataset.step = res.status
            steps.dataset.step = res.status;

            if (res.hasOwnProperty('incomeTx')){
                var incomeTxUrl = document.getElementsByClassName('exchange-txurl');
                for (var b = 0; b < incomeTxUrl.length; b++) {
                    incomeTxUrl[b].innerHTML = res.incomeTx
                }
            }

            if (res.hasOwnProperty('txIdUrl')){
                var txUrl = document.getElementsByClassName('send-txurl');
                for (var i = 0; i < txUrl.length; i++) {
                    txUrl[i].innerHTML = res.txIdUrl
                }
            }


        })
        .catch(err => console.log(err))

    }, 30000);

}

let innerHeight = document.getElementById("particles-js").clientHeight;
let primarySection = document.querySelector('.top.bg-primary')
    let primaryOffersPromo = document.querySelector('.offers-first');
    let primaryOffersFirst = document.querySelector('.bg-primary.first');

    if((primarySection && primaryOffersPromo) || primaryOffersFirst){
        primarySection.style.height = innerHeight + "px";
    }

    particlesHeight = document.getElementById('particles-js').style.height


});
window.onresize = function(event) {
    let innerHeight = document.getElementById("particles-js").clientHeight;
    let primarySection = document.querySelector('.top.bg-primary');
    let primaryOffersPromo = document.querySelector('.offers-first');
    let primaryOffersFirst = document.querySelector('.bg-primary.first');

    if((primarySection && primaryOffersPromo)  || primaryOffersFirst){
        primarySection.style.height = innerHeight + "px";
    }

    if(particlesHeight.indexOf("%") > -1){
        let height = particlesHeight.replace("%",""),
            newParticlesHeight = (event.srcElement || event.currentTarget).innerHeight * (height / 100)
            document.getElementById("particles-js").style.height = newParticlesHeight + "px"
    }else{
        document.getElementById("particles-js").style.height = (event.srcElement || event.currentTarget).innerHeight+ "px";
    }

};

// var steps = document.querySelector("#steps");
// if(steps) {
//
// }

// var transactions = document.querySelector("#transactions-list")
// if (transactions) {
//   function addTransactionItem(input, output, amount, saved) {
//     var list = transactions
//     var firstChild = list.children[0]
//     var el = firstChild.cloneNode(true)
//
//     var imgUrl = '/resources/images/currencies/'
//     el.querySelector(
//       '[data-transaction-input-currency="icon"]'
//     ).src = imgUrl + input + '.svg'
//
//     el.querySelector(
//       '[data-transaction-output-currency="icon"]'
//     ).src = imgUrl + output + '.svg'
//
//     el.querySelector('[data-transaction-input-amount]').innerHTML = amount
//
//     el.querySelector('[data-transaction-input-currency="ticker"]').innerHTML = input.toUpperCase()
//     el.querySelector('[data-transaction-output-currency="ticker"]').innerHTML = output.toUpperCase()
//
//     el.querySelector('[data-transaction-saved="pct"]').innerHTML = saved
//     el.classList.remove('transaction-item-show')
//     list.insertBefore(el, firstChild)
//       console.log("Sdf")
//     // setTimeout(function() {
//       el.classList.add('transaction-item-show')
//     // }, 10)
//
//   }
//   socket.emit('transactions')
//
//
//   socket.on('transaction', function (data) {
//     addTransactionItem(data.in, data.out, data.amount, data.saved)
//   })
// }



// httpGetAsync("//cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",function(data){





