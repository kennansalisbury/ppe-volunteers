const DB = require('../models');
const ROUTER = require('express').Router();

//GET  /orders  - All orders
ROUTER.get('/', (req, res) => {
    res.send('find all orders')
})

//POST  /orders - Create new order
ROUTER.post('/', (req, res) => {
    res.send('create new order')
})

//GET   /orders/:id - 1 order
ROUTER.get('/:id', (req, res) => {
    res.send('find 1 order')
})

//PUT /orders/:id - Update order (collected/delivered)
ROUTER.put('/:id', (req, res) => {
    res.send('update 1 order')
})

module.exports = ROUTER;