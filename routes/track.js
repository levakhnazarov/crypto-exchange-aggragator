var express = require('express');
var router = express.Router();
let models = require( '../models');
const Transaction = models.Transaction;
const Order = models.Order
router.get('/', (req, res, next) => {

    Order.find({
        where: {
            public_id: req.query.id
        }
    }).then(order => {
        if (order) {
            res.render('exchange-summary', {
                order: order,
                path: '/track?id=' + req.query.id
            })
        } else {
            res.status(404).send('Order not found!')
        }
    })
})


module.exports = router;