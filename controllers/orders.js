const DB = require('../models');
const ROUTER = require('express').Router();

//GET  /orders 
ROUTER.get('/', (req, res) => {
  
    //if request coming from source other than any of our user types, forbidden
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false' && req.headers['isdriver'] === 'false' && req.headers['isproducer'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }

    DB.ProductOrder.find()
    .populate('producer')
    .populate('clinic')
    .populate('products.product')
    .then(orders => {
        //if admin, view all orders and details
        if(req.headers['isadmin'] === 'true') {
            res.send(orders) 
        }
        //if prod lead view all info on all orders for your region
        else if(req.headers['isprodlead'] === 'true' ){
            let data = orders.filter(order => order.producer.region === req.headers['region'])
            res.send(data)
        }

        //if clinic lead view all info except producer address info
        else if(req.headers['isclinic'] === 'true') {
            let filtered = orders.filter(order => order.clinic.assignedUser._id.toString() === req.headers['id'])
            let data = filtered.map(order => {
                return {
                    _id: order._id,
                    producer: {
                        firstName: order.producer.firstName,
                        lastName: order.producer.lastName,
                        region: order.producer.region
                    },
                    clinic: order.clinic,
                    collected: order.collected,
                    delivered: order.delivered,
                    products: order.products
                }
            })
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

    //viewable by: all admins, clinic/prod lead from region, only active producers/drivers involved in the order
    
    //if request coming from source other than any of our user types, forbidden
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false' && req.headers['isdriver'] === 'false' && req.headers['isproducer'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }

    DB.ProductOrder.findById(req.params.id)
    .populate('producer')
    .populate('clinic')
    .populate('products.product')
    .then(order => {

        //if admin, send all details
        if(req.headers['isadmin'] === 'true' ){
            res.send(order)
        }
        //if prod lead view all info if for your region
        else if(req.headers['isprodlead'] === 'true' ){
            order.producer.region === req.headers['region'] ? res.send(order) : res.status(403).send({message: 'Forbidden'})
        }

        //if clinic lead view all info except producer address info, only if you are the assigned clinic lead for the clinic on the order
        else if(req.headers['isclinic'] === 'true') {
            let data = {
                _id: order._id,
                producer: {
                    firstName: order.producer.firstName,
                    lastName: order.producer.lastName,
                    region: order.producer.region
                },
                clinic: order.clinic,
                collected: order.collected,
                delivered: order.delivered,
                products: order.products
            }

            order.clinic.assignedUser._id.toString() === req.headers['id'] ? res.send(data) : res.status(403).send({message: 'Forbidden'})
        }


    //if producer view order only if you are the producer on the order
    else if(req.headers['isproducer'] === 'true') {
        order.producer._id.toString() === req.headers['id'] ? res.send(order) : res.status(403).send({message: 'Forbidden'})
    }

    else {
        res.status(403).send({message: 'Forbidden'})
    }


    //***TBC HOW TO CONFIRM WHICH ORDERS DRIVERS ARE PART OF***

    })
    .catch(err => {
        console.log('Error finding order', err)
        res.status(503).send({message: 'Internal server error'})
    })
    

})

//PUT /orders/:id - Update order (collected/delivered)
ROUTER.put('/:id', (req, res) => {

    //if request coming from source other than admin, prodlead, producer, clinic - forbidden
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false' && req.headers['isproducer'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }

    const updateOrder = (updates) => {
        DB.ProductOrder.updateOne(
            {_id: req.params.id},
            updates
        )
        .then(updated => {
            res.send(updated) //front end will confirm if updated w/ response.n === 1
        })
        .catch(err => {
            console.log('Error updating order', err)
            res.status(503).send('Internal server error')
        })
    }


    DB.ProductOrder.findById(req.params.id)
    .populate('producer')
    .populate('clinic')
    .populate('products.product')
    .then(order => {

        //if clinic lead in same region, can update product and quantity requested and whether it has been delivered
        if(req.headers['isclinic'] === 'true' && req.headers['region'] === order.clinic.region) {
            
            updateOrder({
                // products: req.body.products,
                    products: [{
                        product: req.body.product,
                        quantity: req.body.quantity
                    }],
                    delivered: req.body.delivered
                }
            )
        }

        //if prod lead in same region, or admin, can update who the producer is, and if collected from producer
        else if((req.headers['isprodlead'] === 'true' && req.headers['region'] === order.producer.region) || req.headers['isadmin'] === 'true' ) {
            updateOrder({
                   producer: req.body.producer,
                   collected: req.body.collected
                }
            )
        }

        //if producer on order, can update when items have been collected 
            //TO BE CONFIRMED - who/how updates whether it was collected/delivered

        else if(req.headers['isproducer'] === 'true' && req.headers['id'] === order.producer._id.toString()) {
            updateOrder({collected: req.body.collected})
        }

        //else forbidden?
        else {
            res.status(403).send({message: 'Forbidden'})
        }

    })
    .catch(err => {
        console.log('Error finding order', err)
        res.status(503).send({message: 'Internal server error'})
    }) 
    



})

module.exports = ROUTER;