const DB = require('../models');
const ROUTER = require('express').Router();

//GET  /products - All products
ROUTER.get('/', (req, res) => {
    DB.Product.find().then(products => res.send(products))
})


//POST /products - Create new product (admin only)
ROUTER.post('/', (req, res) => {
    
    if(req.headers['isadmin'] === 'true') {

        DB.Product.create({name: req.body.name})
        .then(product => res.send({message: `${product.name} created`}))
        .catch(err => {
            console.log('Error creating product', err)
            res.status(503).send({message: 'Internal server error'})
        })
    }
    else {
        res.status(403).send({message: 'Forbidden'})
    }
   
})

module.exports = ROUTER;