const DB = require('../models');
const ROUTER = require('express').Router();

//GET  /products - All products
ROUTER.get('/', (req, res) => {
    res.send('show all products')
})


//POST /products - Create new product (admin only)
ROUTER.post('/', (req, res) => {
    res.send('create new product')
})

module.exports = ROUTER;