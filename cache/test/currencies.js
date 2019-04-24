//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Currency = require('../../models/currency');
let Exchanger = require('../../models/exchanger');
let Rate = require('../../models/rate');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();



chai.use(chaiHttp);
chai.use(require('chai-things'))

//Our parent block
describe('Curs', () => {
  beforeEach((done) => { //Before each test we empty the database
    Rate.remove({}, err => {
      Exchanger.remove({}, err => {
        Currency.remove({}, err => {
          Currency.remove({}, (err) => {
            var items = [
              {
                abbr: "btc",
                name: "Bitcoin",
                icon: "btc.png"
              },
              {
                abbr: "ltc",
                name: "Litecoin",
                icon: "ltc.png"
              }
            ]
            Currency.create(items, err => {
              Exchanger.create([{name: 'Alpha'}, {name: 'Beta'}], err => {
                Rate.create([
                  {
                    exchanger: items[0]._id,
                    from: 'btc',
                    to: 'ltc',
                    rate: 0.0001
                  },
                  {
                    exchanger: items[0]._id,
                    from: 'ltc',
                    to: 'btc',
                    rate: 0.0001
                  },
                  {
                    exchanger: items[1]._id,
                    from: 'btc',
                    to: 'ltc',
                    rate: 0.0002
                  }
                ], (err, items) => {
                  done()
                })
              })
            });
          }); 
        })
      })
    })
      
  });
 /*
  * Test the /GET route
  */
  describe('/GET /api/v1/currencies', () => {
    it('it should GET all curs and pars', (done) => {

      chai.request(server)
        .get('/api/v1/currencies')
        .end((err, res) => {
          res.should.have.status(200);
          
          // Он должен быть массивом
          res.body.should.to.be.a('array')
          // Длинна должна быть > 0

          // item должен быть объектом
          res.body[0].should.to.be.a('object')
          // у item дожен быть abbr
          res.body[0].should.to.have.property('abbr')
          // у item дожен быть name
          res.body[0].should.to.have.property('name')
          // у item дожен быть icon
          res.body[0].should.to.have.property('icon')
          res.body[0].should.not.have.property('_id')
          res.body[0].should.not.have.property('__v')

          res.body[0].should.to.have.property('rates')
          res.body[0].rates.should.to.be.a('array')
          // console.log()
          res.body[0].rates[0].should.to.have.property('to')
          // res.body[0].rates[0].should.to.have.property('from')
          // res.body[0].rates[0].should.to.have.property('exchanger')
          res.body[0].rates[0].should.to.have.property('rate')
          // res.body[0].rates[0].should.to.have.property('exchanger')
          // res.body[0].rates[0].should.to.have.property('from')
          // res.body[0].rates[0].should.to.have.property('to')
          // res.body[0].rates[0].should.to.have.property('rate')
          // пары
          // expect(body[0]).to.have.property('pars')
          // expect(body[0].pars).to.be.a('array')
          // expect(body[0].pars[0]).to.have.property('abbr')
          // expect(body[0].pars[0]).to.have.property('rate')

          done()
        });
    });
  });
 
});



// юнит - тест модель
// фукнциональный - тестирует форма
// приемочные - вбить данные форму и проверить куда тебя перебросило и что показало
// rest - структара данных, корректный ответ и заголовки