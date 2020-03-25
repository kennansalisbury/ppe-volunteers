const DB = require('../models');
const ROUTER = require('express').Router();

//GET  /orders 
ROUTER.get('/', (req, res) => {
  
    
    DB.ProductOrder.find()
    .populate('producer')
    .populate('clinic')
    .populate('products.product')
    .then(orders => {
        //if admin, view all orders and details
        if(req.headers['isadmin'] === 'true') {
            res.send(orders) 
        }
        //if prod lead, or clinic lead, view all orders for your region
        else if(req.headers['isprodlead'] === 'true' || req.headers['isclinic'] === 'true'){
            let data = orders.filter(order => order.producer.region === req.headers['region'])
            res.send(data)
        }
        //if active producer view orders you are fulfilling 
        else if(req.headers['isproducer'] === 'true') {
            let data = orders.filter(order => order.producer._id.toString() === req.headers['id'])
            res.send(data)
        }


        //***TBC HOW TO CONFIRM WHICH ORDERS DRIVERS ARE PART OF***


        else {
            res.status(403).send({message: 'Forbidden'})
        }
    })
    .catch(err => {
        console.log('Error finding orders', err)
        res.status(503).send('Internal server error')
    })
  
    
})

//POST  /orders - Create new order (clinc lead only)
ROUTER.post('/', (req, res) => {

    //if not clinic lead, forbidden
    if(req.headers['isclinic'] === 'false') {
        return res.status(403).send({message: 'Forbidden'})
    }

    DB.ProductOrder.create({
        producer: req.body.producer,
        clinic: req.body.clinic,
        collected: req.body.collected,
        delivered: req.body.delivered,
        products: [{
            product: req.body.product,
            quantity: req.body.quantity
        }]
    })
    .then(newOrder => {
        res.send(newOrder)
        console.log('new order created')
    })
    .catch(err => {
        console.log('Error creating order', err)
        res.status(503).send({message: 'Internal server error'})
    })

    
})

//GET   /orders/:id - 1 order
ROUTER.get('/:id', (req, res) => {
    res.send('find 1 order')

    //viewable by: all admins, all clinic leads, only active producers/drivers involved in the order


})

//PUT /orders/:id - Update order (collected/delivered)
ROUTER.put('/:id', (req, res) => {
    res.send('update 1 order')

    //if clinc lead in same region, can update all details

    //TO BE CONFIRMED - who/how updates whether it was collected/delivered

})

module.exports = ROUTER;