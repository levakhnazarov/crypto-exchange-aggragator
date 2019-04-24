//
// if (typeof renderOffers === 'undefined') {
//   renderOffers = false
// }
//
// var formEl = document.getElementById('form')
// var exchangerEl = document.getElementById('exchanger')
//
// var val_from = document.getElementById('val-from')
// var cur_from = document.getElementById('cur-from')
// var val_to = document.getElementById('val-to')
// var cur_to = document.getElementById('cur-to')
// var moreOffersEl = document.getElementById('more-offers')
// var submitBtnEl = document.getElementById('submit-btn')
//
// if (moreOffersEl) {
//   moreOffersEl.onclick = e => {
//     e.preventDefault()
//     formEl.action = '/exchange/offers'
//     formEl.submit()
//   }
// }
//
//
// if (submitBtnEl) {
//   submitBtnEl.onclick = e => {
//     e.preventDefault()
//     formEl.action = ['/exchange', exchangerEl.value, cur_from.value + '-' + cur_to.value].join('/')
//     formEl.submit()
//   }
// }
//
//
// function valOnChange (e) {
//   var el = e.target, style = el.style
//   if (!el.validity.valid) {
//     style.borderColor = 'red'
//     return
//   } else {
//     style.borderColor = ''
//   }
//   calc()
// }
//
// val_from.onchange = valOnChange
// val_from.onkeyup = valOnChange
//
// cur_from.onchange = e => {
//   renderRightOptions()
//   calc(true)
// }
//
// cur_to.onchange = e => calc(true)
//
// var reverseEl = document.getElementById('reverse')
// if (reverseEl) {
//   reverseEl.onclick = e => {
//     e.preventDefault()
//     let from = cur_from.value
//     let to = cur_to.value
//     cur_from.value = to
//     cur_to.value = from
//     renderRightOptions()
//     calc(true)
//   }
// }
//
//
// function getBestRate (from, to) {
//   return rates.reduce((result, item) => {
//     if (item.from == from && item.to == to) {
//       result = item
//     }
//     return result
//   }, {
//     exchanger: null,
//     rate: 0,
//     offers: 0
//   })
// }
//
// function loadOffers(from, to) {
//   return new Promise(function (resolve, reject) {
//     var xhr = new XMLHttpRequest()
//     xhr.open('POST', '/rates')
//     xhr.onload = function () {
//       if (this.status >= 200 && this.status < 300) {
//         resolve(JSON.parse(this.responseText));
//       } else {
//         reject({
//           status: this.status,
//           statusText: xhr.statusText
//         });
//       }
//     }
//     xhr.onerror = function () {
//       reject({
//         status: this.status,
//         statusText: xhr.statusText
//       })
//     }
//     xhr.setRequestHeader('Content-Type', 'application/json')
//     xhr.send(JSON.stringify({
//       from: from,
//       to: to,
//     }))
//   })
// }
// var offers = []
// function calc (needLoadOffers) {
//   var result = getBestRate(cur_from.value, cur_to.value)
//   exchangerEl.value = result.exchanger
//   var bestRate = result.rate
//   if (!renderOffers) {
//     if (moreOffersEl) {
//       if (result.offers > 1) {
//       moreOffersEl.style.display = ''
//         // moreOffersEl.text = 'more offers' + (result.offers - 1)
//         moreOffersEl.text = 'or compare ' + (result.offers - 1) + ' more offers »'
//       } else {
//         moreOffersEl.style.display = 'none'
//       }
//     }
//   } else if (renderOffers === true) {
//     if (typeof needLoadOffers !== 'undefined' && needLoadOffers === true) {
//       loadOffers(cur_from.value, cur_to.value).then(items => {
//         offers = items
//         renderOffersTable(offers)
//       })
//     } else {
//       renderOffersTable(offers)
//     }
//
//   }
//
//   val_to.value = (bestRate * val_from.value / 1)
// }
//
// function renderLeftOptions () {
//   for (var i = 0; i < currencies.length; i++) {
//     let cur = currencies[i]
//     let option = document.createElement("option")
//     option.value = cur.abbr
//     option.text = cur.name
//     cur_from.add(option)
//     if (i === 0) {
//       cur_from.value = currencies[0].abbr
//     }
//   }
//   renderRightOptions()
// }
//
// function renderRightOptions () {
//   var from = cur_from.value
//   var oldValue = cur_to.value
//   cur_to.options.length = 0 // clear all options
//   if (!from) return
//   let availables = rates.reduce((list, item) => {
//     if (from == item.from && list.indexOf(item.to) === -1) {
//       list.push(item.to)
//     }
//     return list
//   }, [])
//
//   let filtered = currencies.filter(i => i.abbr !== from && availables.indexOf(i.abbr) !== -1)
//   for (var i = 0; i < filtered.length; i++) {
//     let cur = filtered[i]
//     let option = document.createElement("option")
//     option.value = cur.abbr
//     option.text = cur.name
//     cur_to.add(option)
//   }
//   cur_to.value = filtered.reduce((value, item) => {
//     if (item.abbr == oldValue) {
//       value = item.abbr
//     }
//     return value
//   }, filtered[0].abbr)
// }
//
//
// var offersTableEl = document.getElementById('offers')
//
//
//
// function renderOffersTable (offers) {
//   offers = offers.sort((a, b) => a.rate - b.rate)
//   while ( offersTableEl.rows.length > 0 ) {
//     offersTableEl.deleteRow(0);
//   }
//   var min = Math.min.apply(null, offers.map(i => i.rate))
//   for (var i = 0; i < offers.length; i++) {
//     let offer = offers[i]
//     var row = offersTableEl.insertRow(0)
//     var cell0 = row.insertCell(0)
//     var cell1 = row.insertCell(1)
//     var cell2 = row.insertCell(2)
//     var cell3 = row.insertCell(3)
//     var profit = (offer.rate / min - 1) * 100
//     cell0.innerHTML = (offer.rate * val_from.value / 1)
//     cell1.innerHTML = profit > 0 ? profit.toFixed(2) + '%' : null
//     cell2.innerHTML = offer.exchanger
//     var link = document.createElement("a")
//     link.text = 'Exchange'
//     link.setAttribute('href', '#exchange-' + offer.exchanger)
//     link.setAttribute('class', 'btn btn-primary w-50')
//     link.setAttribute('style', 'border-radius: 35px;')
//     link.setAttribute('onclick', 'setExchanger("' + offer.exchanger + '"); return false;')
//     cell3.appendChild(link)
//   }
// }
//
// function setExchanger (exchanger) {
//   exchangerEl.value = exchanger
//   formEl.action = ['/exchange', exchangerEl.value, cur_from.value + '-' + cur_to.value].join('/')
//   formEl.submit()
// }
//
// renderLeftOptions()
//
//
//
// if (formData) {
//   val_from.value = formData.val_from
//   cur_from.value = formData.cur_from
//   renderRightOptions()
//   cur_to.value = formData.cur_to
//   exchanger.value = formData.exchanger
//   calc(renderOffers)
// } else {
//   calc(renderOffers)
// }
