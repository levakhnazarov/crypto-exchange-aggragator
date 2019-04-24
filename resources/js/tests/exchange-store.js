import {expect} from 'chai'
// import fakeFetch from 'fake-fetch'
import sinon from 'sinon'
import fetchMock from 'fetch-mock'
import ExchangeStore from '../stores/exchange-store.js'




const currencies = [
  {
    ticker: 'btc', 
    name: 'Bitcoin', 
    price_usd: 7503.90
  },
  {
    ticker: 'eth', 
    name: 'Ethereum', 
    price_usd: 414.72
  },
  {
    ticker: 'xrp', 
    name: 'Ripple', 
    price_usd: 0.542718
  }
]

const pairs = [
  ['btc','eth'],
  ['btc','xrp'],
  ['eth','btc'],
  ['xrp','btc'],
  ['xrp','eth'],
]

const offers = {
  'btc-eth': [
    {
      exchanger: 'alpha',
      input_currency: 'btc',
      output_currency: 'eth',
      rate: 17.756076,
      min_amount: 0.2,
      max_amount: 2
    },
    {
      exchanger: 'beta',
      input_currency: 'btc',
      output_currency: 'eth',
      rate: 17.749183,
      min_amount: 0.001,
      max_amount: 1.1
    },
    {
      exchanger: 'gamma',
      input_currency: 'btc',
      output_currency: 'eth',
      rate: 17.401900,
      min_amount: 0.001,
      max_amount: 177.25175
    }
  ],
  'eth-btc': [
    {
      exchanger: 'alpha',
      input_currency: 'eth',
      output_currency: 'btc',
      rate: 0.055216,
      min_amount: null,
      max_amount: null
    },
    {
      exchanger: 'beta',
      input_currency: 'eth',
      output_currency: 'btc',
      rate: 0.055136,
      min_amount: 0.18,
      max_amount: 10
    },
    {
      exchanger: 'gamma',
      input_currency: 'eth',
      output_currency: 'btc',
      rate: 0.055127,
      min_amount: 0.01995,
      max_amount: 1430.32893
    },
  ],
  'btc-xrp': [
    {
      exchanger: 'alpha',
      input_currency: 'btc',
      output_currency: 'xrp',
      rate: 13929.87463,
      min_amount: 0.00499,
      max_amount: null
    },
    {
      exchanger: 'beta',
      input_currency: 'btc',
      output_currency: 'xrp',
      rate: 14020.6040079,
      min_amount: 0.00180948,
      max_amount: 0.73847608
    },
    {
      exchanger: 'gamma',
      input_currency: 'btc',
      output_currency: 'xrp',
      rate: 13507.38785,
      min_amount: 0.00315,
      max_amount: 0.733179
    },
  ],
  'xrp-btc': [
    {
      exchanger: 'alpha',
      input_currency: 'xrp',
      output_currency: 'btc',
      rate: 0.00007021,
      min_amount: 90,
      max_amount: null
    },
    {
      exchanger: 'beta',
      input_currency: 'xrp',
      output_currency: 'btc',
      rate: 0.00004924,
      min_amount: 44.000558,
      max_amount: 9832.042376
    }
  ],
  'xrp-eth': [
    {
      exchanger: 'alpha',
      input_currency: 'xrp',
      currency_to: 'eth',
      rate: 0.00124994,
      min_amount: 90,
      max_amount: null
    },
    {
      exchanger: 'beta',
      input_currency: 'xrp',
      output_currency: 'eth',
      rate: 0.00126358,
      min_amount: 0.001,
      max_amount: 10313.65346611
    },
    {
      exchanger: 'gamma',
      input_currency: 'xrp',
      output_currency: 'eth',
      rate: 0.00123434,
      min_amount: 41.92872117,
      max_amount: 10188.86443046
    }
  ]
  
}


let requests

let server
const FAKE_SLOW_RESPONSE_TIMEOUT = 25

beforeEach(() => {

  fetchMock.get('/currencies', (url, opts) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // fake slow response
        resolve(currencies)
      }, FAKE_SLOW_RESPONSE_TIMEOUT)
    });
  });

  fetchMock.get('/pairs', (url, opts) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // fake slow response
        resolve(pairs)
      }, FAKE_SLOW_RESPONSE_TIMEOUT)
    });
  });

  fetchMock.post('/offers', (url, opts) => {
    return new Promise((resolve, reject) => {
      let body = opts.body
      let pair = [body.input_currency, body.output_currency].join('-')
      let response = offers[pair]
      setTimeout(() => { // fake slow response
        resolve(response)
      }, FAKE_SLOW_RESPONSE_TIMEOUT)
    })
  });
})

afterEach(() => {
  fetchMock.restore();
})

describe('Exchange store', () => {
  
  let store

  describe('Currencies', () => {

    beforeEach(done => {
      store = new ExchangeStore()
      store.once('init', () => done())
    })

    describe('Input', () => {

      describe('Init with empty values', () => {
        let value = 'btc'
        it('Should be default value', () => {
          expect(store.getInputCurrency()).to.equal(value)
        })
        it('Allowed currencies', () => {
          expect(store.getInputCurrencies()).to.deep.equal([
            currencies[0],
            currencies[1],
            currencies[2]
          ])
        })
      })

      describe('Set new value', () => {
        let value = 'xrp'
        beforeEach(done => {
          store.setInputCurrency(value)
          store.once('calc', () => done())
        })
        it('Value should be changed', () => {
          expect(store.getInputCurrency()).to.equal(value)
        })
      })

      describe('Set new value (swap - alternative)', () => {
        let value = 'eth'
        beforeEach(done => {
          store.setInputCurrency(value)
          store.once('calc', () => done())
        })
        it('Value should be changed', () => {
          expect(store.getInputCurrency()).to.equal(value)
        })
      })
      
      describe('Init with started values', () => {
        let _input = 'xrp', _output = 'btc'
        beforeEach(done => {
          store = new ExchangeStore({
            inputCurrency: _input,
            outputCurrency: _output
          })
          store.once('init', () => done())
        })
        it('Should be start value', () => {
          expect(store.getInputCurrency()).to.equal(_input)
        })
        it('Allowed currencies', () => {
          expect(store.getInputCurrencies()).to.deep.equal([
            currencies[0],
            currencies[1],
            currencies[2]
          ])
        })
      })

    }) // Input

    describe('Output', () => {

      describe('Init with empty values', () => {
        let value = 'eth'
        it('Should be default value', () => {
          expect(store.getOutputCurrency()).to.equal(value)
        })
      })

      describe('Allowed currencies', () => {
        it('Only certain', () => {
          expect(store.getOutputCurrencies()).to.deep.equal([
            currencies[1],
            currencies[2]
          ])
        })
      })

      describe('Set new value', () => {
        let value = 'xrp'
        beforeEach(done => {
          store.setOutputCurrency(value)
          store.once('calc', () => done())
        })
        it('Value should be changed', () => {
          expect(store.getOutputCurrency()).to.equal(value)
        })
      })

      describe('Set new value (swap - alternative)', () => {
        let value = 'btc'
        beforeEach(done => {
          store.setOutputCurrency(value)
          store.once('calc', () => done())
        })
        it('Value should be changed', () => {
          expect(store.getOutputCurrency()).to.equal(value)
        })
      })
     
      describe('Init with started values', () => {
        let _input = 'xrp', _output = 'btc'
        beforeEach(done => {
          store = new ExchangeStore({
            inputCurrency: _input,
            outputCurrency: _output
          })
          store.once('init', () => done())
        })
        it('Should be start value', () => {
          expect(store.getOutputCurrency()).to.equal(_output)
        })
        it('Allowed currencies', () => {
          expect(store.getOutputCurrencies()).to.deep.equal([
            currencies[0],
            currencies[1]
          ])
        })
      })

    }) // Output

    describe('Swap', () => {
      describe('With default values', () => {
        beforeEach(done => {
          store.swap()
          store.once('calc', () => done())
        })
        it ('Should be interchanged', () => {
          expect(store.getInputCurrency()).to.equal('eth')
          expect(store.getOutputCurrency()).to.equal('btc')
        }) 
      })
      describe('With started values', () => {
        let _input = 'xrp', _output = 'btc'
        beforeEach(done => {
          store = new ExchangeStore({
            inputCurrency: _input,
            outputCurrency: _output
          })
          store.once('calc', () => done())
        })
        describe('try', () => {
          beforeEach(done => {
            store.swap()
            store.once('calc', () => done())
          })
          it ('Should be interchanged', () => {
            expect(store.getInputCurrency()).to.equal(_output)
            expect(store.getOutputCurrency()).to.equal(_input)
          }) 
        })
      })
    })

  }) // Currencies

  describe('Amounts', () => {

    beforeEach(done => {
      store = new ExchangeStore()
      store.once('init', () => done())
    })

    describe('Input', () => {

      describe('Init with empty values', () => {
        let value = offers['btc-eth'][2].min_amount
        it('Should be default value', () => {
          expect(store.getInputAmount()).to.equal(value)
        })
      })

      describe('Set new value', () => {
        let value = 0.005
        beforeEach(done => {
          store.once('calc', () => done())
          store.setInputAmount(value)
        })
        it('Valid value', () => {
          expect(store.getInputAmount()).to.equal(value)
        })
      })

      describe('Init with started values', () => {
        let _input = 'xrp', _output = 'btc'
        let _amount = 2
        beforeEach(done => {
          store = new ExchangeStore({
            inputCurrency: _input,
            outputCurrency: _output,
            inputAmount: _amount
          })
          store.once('init', () => done())
        })
        it('Should be start value', () => {
          expect(store.getInputAmount()).to.equal(_amount)
        })
      })

      describe('In usd', () => {

        describe('Init with empty values', () => {
          let _value = offers['btc-eth'][2].min_amount * currencies[0].price_usd
          it('Should be default value', () => {
            expect(store.getInputAmountInUsd()).to.equal(_value)
          })
        })

        describe('Set new amount', () => {
          let _value = 0.005
          let _inUsd = _value * currencies[0].price_usd
          beforeEach(done => {
            store.once('calc', () => done())
            store.setInputAmount(_value)
          })
          it('Valid value', () => {
            expect(store.getInputAmountInUsd()).to.equal(_inUsd)
          })
        })
        // - changed after set new input currency
        
      }) //- In usd

      describe('Min', () => {
        describe('Init with empty values', () => {
          let _value = offers['btc-eth'][2].min_amount
          it('Should be default value', () => {
            expect(store.getMinInputAmount()).to.equal(_value)
          })
        })
        // - changed after set new input currency
        // - changed after set new output currency

      }) //- Min

      describe('Max', () => {

        describe('Init with empty values', () => {
          let _value = offers['btc-eth'][2].max_amount
          it('Should be default value', () => {
            expect(store.getMaxInputAmount()).to.equal(_value)
          })
        })
        // - changed after set new input currency
        // - changed after set new output currency
        
      }) //- Max

    }) //- Input

    describe('Output', () => {

       describe('Init with empty values', () => {
        let _offer = offers['btc-eth'][1]
        let _value = _offer.min_amount * _offer.rate / 1
        it('Should be default value', () => {
          expect(store.getOutputAmount()).to.equal(_value)
        })
      })

      describe('Set new input value', () => {
        let _offer = offers['btc-eth'][1]
        let _inputAmount = 0.005
        let _value = _inputAmount * _offer.rate / 1
        beforeEach(done => {
          store.once('calc', () => done())
          store.setInputAmount(_inputAmount)
        })
        it('Valid value', () => {
          expect(store.getOutputAmount()).to.equal(_value)
        })
      })

      describe('Set new output(self) value', () => {
        let _value = 25
        beforeEach(done => {
          store.once('calc', () => done())
          store.setOutputAmount(_value)
        })
        it('Valid value', () => {
          expect(store.getOutputAmount()).to.equal(_value)
        })
      })

      describe('Init with started values', () => {
        const _offer = offers['xrp-btc'][1]
        const _inputCurrency = 'xrp', _outputCurrency = 'btc'
        const _inputAmount = 75
        const _value = _inputAmount * _offer.rate 
        beforeEach(done => {
          store = new ExchangeStore({
            inputCurrency: _inputCurrency,
            outputCurrency: _outputCurrency,
            inputAmount: _inputAmount
          })
          store.once('init', () => done())
        })
        it('Should be start value', () => {
          expect(store.getOutputAmount()).to.equal(_value)
        })
      })

      describe('Input amount in usd', () => {

        describe('Set new amount', () => {
          const _offer = offers['btc-eth'][0]
          const _inUsd = 3500
          const _inputAmount = 1 / currencies[0].price_usd * _inUsd
          const _value = _inputAmount * _offer.rate 
          beforeEach(done => {
            store.once('calc', () => done())
            store.setInputAmountInUsd(_inUsd)
          })
          it('Valid value', () => {
            expect(store.getOutputAmount()).to.equal(_value)
          })
        })
        // - changed after set new input currency
        
      }) //- In usd

    }) //- Output

  }) //- Amounts

  // describe('Init with empty values', () => {
  //   let store

  //   beforeEach(done => {
  //     store = new ExchangeStore()
  //     store.on('init', () => done())
  //   })

  //   describe('Default states after init', () => {
  //     const pair = ['btc', 'eth'].join('-')
  //     const _offers = offers[pair]
  //     const _exchangeRate = _offers[1]
  //     const _minAmount = _offers[1].min_amount
  //     const _maxAmount = _offers[2].max_amount
  //     const _inputCurrency = currencies[0]
  //     const _outputCurrency = currencies[1]

  //     const _inputAmountValue = _exchangeRate.min_amount
  //     const _inputCurrencyValue = _inputCurrency.ticker
  //     const _outputAmount = _exchangeRate.rate * _inputAmountValue / 1
  //     const _outputCurrencyValue = _outputCurrency.ticker

  //     describe('Input', () => {
  //       it('allowed currencies', () => {
  //         const inputCurrencies = store.getInputCurrencies()
  //         expect(inputCurrencies).to.deep.equal([
  //           currencies[0],
  //           currencies[1],
  //           currencies[2]
  //         ])
  //       })
  //       it('currency value', () => {
  //         const inputCurrency = store.getInputCurrency()
  //         expect(inputCurrency).to.equal(_inputCurrencyValue)
  //       })
  //       it('amount', () => {
  //         const inputAmount = store.getInputAmount()
  //         expect(inputAmount).to.equal(_inputAmountValue)
  //       })

  //       it('amount in usd', () => {
  //         const inputAmountInUsd = store.getInputAmountInUsd()
  //         const _inputAmountInUsd = _inputCurrency.price_usd * _inputAmountValue
  //         expect(inputAmountInUsd).to.equal(_inputAmountInUsd)
  //       })

  //       it('amount min', () => {
  //         const minInputAmount = store.getMinInputAmount()
  //         expect(minInputAmount).to.equal(_minAmount)
  //       })

  //       it('amount max', () => {
  //         const maxInputAmount = store.getMaxInputAmount()
  //         expect(maxInputAmount).to.equal(_maxAmount)
  //       })
  //     })

  //     describe('Output', () => {
  //       it('allowed currencies', () => {
  //         const outputCurrencies = store.getOutputCurrencies()
  //          expect(outputCurrencies).to.deep.equal([
  //           currencies[1],
  //           currencies[2]
  //         ])
  //       })
  //       it('currency value', () => {
  //         const outputCurrency = store.getOutputCurrency()
  //         expect(outputCurrency).to.equal(_outputCurrencyValue)
  //       })
  //       it('amount', () => {
  //         const outputAmount = store.getOutputAmount()
  //         expect(outputAmount).to.equal(_outputAmount)
  //       })
  //     })
  //     describe('Offers', () => {
  //       let storeOffers

  //       // calculate low offer
  //       let lowOfferAmount = _offers[2].rate * _inputAmountValue
  //       let lowOfferUsd = lowOfferAmount * _outputCurrency.price_usd

  //       // calculate offers summary
  //       let ofers = _offers.reduce((list, offer) => {
  //         let outputAmount = offer.rate * _inputAmountValue
  //         let obj = Object.assign({
  //           input_amount: _minAmount,
  //           output_amount: outputAmount,
  //           save: {
  //             pct: (outputAmount - lowOfferAmount) / outputAmount * 100,
  //             usd: outputAmount * _outputCurrency.price_usd - lowOfferUsd
  //           }
  //         }, offer)
  //         list.push(obj)
  //         return list
  //       }, [])

  //       let bestOffer = ofers[1]
  //       let otherOffers = [ofers[2]]
  //       let overOffers = [ofers[0]]

  //       beforeEach(() => {
  //         storeOffers = store.getOffers()
  //       })
  //       it('Total offers', () => {
  //         expect(storeOffers.total).to.equal(_offers.length)
  //       })
  //       it('Best offer', () => {
  //         expect(storeOffers.best).to.deep.equal(bestOffer)
  //       })
  //       it('Other offers', () => {
  //         expect(storeOffers.other).to.deep.equal(otherOffers)
  //       })
  //       it('Over limits', () => {
  //         expect(storeOffers.over).to.deep.equal(overOffers)
  //       })
  //     })
  //   })



  //   describe('Amounts change', () => {
  //     const _input = 'btc', _output = 'eth'
  //     const _pair = [_input, _output].join('-')
  //     const _inputCurrency = currencies[0], _outputCurrency = currencies[1]

  //     describe('Change input amount', () => {
  //       const _offer = offers[_pair][0]
  //       const _inputAmount = 0.5
  //       const _outputAmount = _offer.rate * _inputAmount

  //       beforeEach(function() {
  //         store.setInputAmount(_inputAmount)
  //       })

  //       it('Return settled input amount', () => {
  //         const amount = store.getInputAmount()
  //         expect(amount).to.equal(_inputAmount)
  //       })
  //       it('Return updated input amount in usd', () => {
  //         const usd = store.getInputAmountInUsd()
  //         expect(usd).to.equal(_inputCurrency.price_usd * _inputAmount)
  //       })
  //       it('Return updated output amount (calc)', () => {
  //         const amount = store.getOutputAmount()
  //         expect(amount).to.equal(_outputAmount)
  //       })
  //     })

  //     describe('Change input amount in usd', () => {
  //       const _offer = offers[_pair][0]
  //       const _inputAmountInUsd = 7000
  //       const _inputAmount = 1 / _inputCurrency.price_usd * _inputAmountInUsd
  //       const _outputAmount = _offer.rate * _inputAmount
        
  //       beforeEach(function() {
  //         store.setInputAmountInUsd(_inputAmountInUsd)
  //       })

  //       it('Return new amount in usd', () => {
  //         const amount = store.getInputAmountInUsd()
  //         expect(amount).to.equal(_inputAmountInUsd)
  //       })
  //       it('Return updated input amount', () => {
  //         const amount = store.getInputAmount()
  //         expect(amount).to.equal(_inputAmount)
  //       })
  //       it('Should be return updated output amount', () => {
  //         const amount = store.getOutputAmount()
  //         expect(amount).to.equal(_outputAmount)
  //       })
  //     })

  //     describe('Change output amount', () => {
  //       const _offer = offers[_pair][0]
  //       const _outputAmount = 25
  //       const _inputAmount = _outputAmount * 1 / _offer.rate

  //       beforeEach(function() {
  //         store.setOutputAmount(_outputAmount)
  //       })

  //       it('Return settled output amount', () => {
  //         const amount = store.getOutputAmount()
  //         expect(amount).to.equal(_outputAmount)
  //       })
  //       it('Return updated input amount (calc)', () => {
  //         const amount = store.getInputAmount()
  //         expect(amount).to.equal(_inputAmount)
  //       })
  //       it('Return updated input amount in usd', () => {
  //         const usd = store.getInputAmountInUsd()
  //         expect(usd).to.equal(_inputCurrency.price_usd * _inputAmount)
  //       })
  //     })
  //   })


  //   describe('Currencies change', () => {

  //     describe('Change input currency', () => {
  //       const _input = 'xrp', _output = 'eth'
  //       const _pair = [_input, _output].join('-')
  //       const _offer = offers[_pair][1]
  //       const _inputCurrency = currencies[2], _outputCurrency = currencies[1]
  //       const _inputAmount = _offer.min_amount

  //       beforeEach(done => {
  //         store.setInputCurrency(_input)
  //         store.on('calc', () => done())
  //       })

  //       it('Return settled input currency', () => {
  //         const currency = store.getInputCurrency()
  //         expect(currency).to.equal(_input)
  //       })
  //       it('Return updated output amount', () => {
  //         const _outputAmount = store.getInputAmount() * _offer.rate
  //         const amount = store.getOutputAmount()
  //         expect(amount).to.equal(_outputAmount)
  //       })
  //       it('Return updated output currencies', () => {
  //         const outputCurrencies = store.getOutputCurrencies()
  //         expect(outputCurrencies).to.deep.equal([
  //           currencies[0],
  //           currencies[1]
  //         ])
  //       })
  //     })

  //     describe('Change output currency', () => {
  //       const _input = 'btc', _output = 'xrp'
  //       const _pair = [_input, _output].join('-')
  //       const _offer = offers[_pair][1]
  //       const _inputCurrency = currencies[2], _outputCurrency = currencies[1]
  //       const _inputAmount = _offer.min_amount

  //       beforeEach(done => {
  //         store.setOutputCurrency(_output)
  //         store.on('calc', () => done())
  //       })

  //       it('Return settled output currency', () => {
  //         const currency = store.getOutputCurrency()
  //         expect(currency).to.equal(_output)
  //       })
  //       it('Return updated output amount', () => {
  //         const _outputAmount = store.getInputAmount() * _offer.rate
  //         const amount = store.getOutputAmount()
  //         expect(amount).to.equal(_outputAmount)
  //       })
  //     })
  //   })

  //   describe('Swap currencies', () => {
  //     it('Can swap', () => {
  //       expect(store.canSwap()).to.equal(true)
  //     })
  //     describe('Do swap', () => {
  //       const _input = 'eth', _output = 'btc'
  //       let lastOutputAmount
        
  //       beforeEach(done => {
  //         lastOutputAmount = store.getOutputAmount()
  //         store.swap()
  //         store.on('calc', () => done())
  //       })

  //       it('Input currency changed', () => {
  //         const currency = store.getInputCurrency()
  //         expect(currency).to.equal(_input)
  //       })
  //       it('Output currency changed', () => {
  //         const currency = store.getOutputCurrency()
  //         expect(currency).to.equal(_output)
  //       })
  //       it('Output amount changed', () => {
  //         const amount = store.getOutputAmount()
  //         expect(amount).not.equal(lastOutputAmount)
  //       })
  //     })
  //   }) 
  // })

  // describe('Init with started values', () => {
  //   let store
  //   const _input = 'xrp', _output = 'btc'
  //   const pair = [_input, _output].join('-')
  //   const _inputAmountValue = 200
  //   beforeEach(done => {
  //     store = new ExchangeStore({
  //       inputCurrency: _input,
  //       outputCurrency: _output,
  //       inputAmount: _inputAmountValue,
  //     })
  //     store.on('init', () => done())
  //   })
  //   describe('check states after init', () => {

  //     const _offers = offers[pair]
  //     const _exchangeRate = _offers[0]
  //     const _minAmount = _offers[1].min_amount
  //     const _maxAmount = _offers[0].max_amount === null ? Number.POSITIVE_INFINITY : _offers[0].max_amount
  //     const _inputCurrency = currencies[2]
  //     const _outputCurrency = currencies[0]

      
  //     const _inputCurrencyValue = _inputCurrency.ticker
  //     const _outputAmount = _exchangeRate.rate * _inputAmountValue / 1
  //     const _outputCurrencyValue = _outputCurrency.ticker

  //     describe('Input', () => {
  //       it('allowed currencies', () => {
  //         const inputCurrencies = store.getInputCurrencies()
  //         expect(inputCurrencies).to.deep.equal([
  //           currencies[0],
  //           currencies[1],
  //           currencies[2]
  //         ])
  //       })
  //       it('currency value', () => {
  //         const inputCurrency = store.getInputCurrency()
  //         expect(inputCurrency).to.equal(_inputCurrencyValue)
  //       })
  //       it('amount', () => {
  //         const inputAmount = store.getInputAmount()
  //         expect(inputAmount).to.equal(_inputAmountValue)
  //       })

  //       it('amount in usd', () => {
  //         const inputAmountInUsd = store.getInputAmountInUsd()
  //         const _inputAmountInUsd = _inputCurrency.price_usd * _inputAmountValue
  //         expect(inputAmountInUsd).to.equal(_inputAmountInUsd)
  //       })

  //       it('amount min', () => {
  //         const minInputAmount = store.getMinInputAmount()
  //         expect(minInputAmount).to.equal(_minAmount)
  //       })

  //       it('amount max', () => {
  //         const maxInputAmount = store.getMaxInputAmount()
  //         expect(maxInputAmount).to.equal(_maxAmount)
  //       })
  //     })

  //     describe('Output', () => {
  //       it('allowed currencies', () => {
  //         const outputCurrencies = store.getOutputCurrencies()
  //          expect(outputCurrencies).to.deep.equal([
  //           currencies[0],
  //           currencies[1]
  //         ])
  //       })
  //       it('currency value', () => {
  //         const outputCurrency = store.getOutputCurrency()
  //         expect(outputCurrency).to.equal(_outputCurrencyValue)
  //       })
  //       it('amount', () => {
  //         const outputAmount = store.getOutputAmount()
  //         expect(outputAmount).to.equal(_outputAmount)
  //       })
  //     })
  //     describe('Offers', () => {
  //       let storeOffers

  //       // calculate low offer
  //       let lowOfferAmount = _offers[1].rate * _inputAmountValue
  //       let lowOfferUsd = lowOfferAmount * _outputCurrency.price_usd

  //       // calculate offers summary
  //       let ofers = _offers.reduce((list, offer) => {
  //         // console.log(offer.rate * _inputAmountValue)
  //         let outputAmount = offer.rate * _inputAmountValue
  //         let obj = Object.assign({
  //           input_amount: _inputAmountValue,
  //           output_amount: outputAmount,
  //           save: {
  //             pct: (outputAmount - lowOfferAmount) / outputAmount * 100,
  //             usd: outputAmount * _outputCurrency.price_usd - lowOfferUsd
  //           }
  //         }, offer)
  //         list.push(obj)
  //         return list
  //       }, [])
  //       let bestOffer = ofers[0]

  //       let otherOffers = [ofers[1]]
  //       let overOffers = []

  //       beforeEach(() => {
  //         storeOffers = store.getOffers()
  //       })
  //       it('Total offers', () => {
  //         expect(storeOffers.total).to.equal(_offers.length)
  //       })
  //       it('Best offer', () => {
  //         expect(storeOffers.best).to.deep.equal(bestOffer)
  //       })
  //       it('Other offers', () => {
  //         expect(storeOffers.other).to.deep.equal(otherOffers)
  //       })
  //       it('Over limits', () => {
  //         expect(storeOffers.over).to.deep.equal(overOffers)
  //       })
  //     })
  //   })
  // })

})