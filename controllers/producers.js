const DB = require('../models');
const ROUTER = require('express').Router();

// GET /producers - find all ACTIVE producers and provide info depending on which type of user the rq is coming from
ROUTER.get('/', (req, res) => {
    //req.headers from front end to include user the request is coming from
        //include type of user (i.e. isClinic, isAdmin etc.), and user region
    
    //if rq coming from source other than admin, producer lead, or clinic lead - forbidden
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }

    DB.User.find({ isProducer: true, isActive: true })
    .then(producers => {
        
        //if rq coming from admin, send all producer details
        if(req.headers['isadmin'] === 'true') {
            res.send(producers)
        } 
        //if rq coming from producer lead, send all info for producers in their region
        else if(req.headers['isprodlead'] === 'true') {
            let data = producers.filter(producer => producer.region === req.headers['region'])
            res.send(data)
        }
        //if rq coming from clinic lead, send only id &  inventory for all producers in their region
        else if(req.headers['isclinic'] === 'true') {
            let list = producers.filter(producer => producer.region === req.headers['region'])
            let data = list.map(producer => ({
                id: producer._id,
                inventory: producer.inventory
            }))
            res.send(data)
        }
    })
    .catch(err => {
        console.log('Error finding producers', err)
        res.status(503).send({message: 'Internal server error'})
    })
})

//GET /producers/:id - find 1 producer, show only necessary info for person viewing
ROUTER.get('/:id', (req, res) => {
    //req.headers from front end to include user the request is coming from
        //include type of user (i.e. isClinic, isAdmin etc.), user region and user id
    
    //forbidden request if rq coming from: 
    //a producer whose id is different than req.params.id
    if((req.headers['isproducer'] === 'true' && req.params.id != req.headers['id'])) { 
        res.status(403).send({message: 'Forbidden'})
        return
    }

    //OR from source other than any type of user
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false' && req.headers['isproducer'] === 'false' && req.headers['isdriver'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }  

    DB.User.findById(req.params.id)
    .then(producer => {
   
        //if rq coming from producer (same id as requesting) or from admin, show all info
        if((req.headers['isproducer'] === 'true' && req.params.id === req.headers['id']) || req.headers['isadmin'] === 'true' ) {
            res.send(producer)
        } 
        //if rq coming from prod lead, show all info only if in region, otherwise forbidden
        else if(req.headers['isprodlead'] === 'true') {
            producer.region === req.headers['region'] ? res.send(producer) : res.status(403).send({message: 'Forbidden'})
        } 
        //if rq coming from clinic lead, show id and inventory only if in region, otherwise forbidden
        else if(req.headers['isclinic'] === 'true') {
            currentProducer = {
                id: producer._id,
                inventory: producer.inventory
            }
            producer.isActive && producer.region === req.headers['region'] ? res.send(currentProducer) : res.status(403).send({message: 'Forbidden'})
        }
        //if rq coming from driver, show id and address only
        else if(req.headers['isdriver'] === 'true') {
            currentProducer = {
                id: producer._id,
                address: producer.address,
                city: producer.city,
                state: producer.state,
                zipcode: producer.zipcode
            }
            producer.isActive ? res.send(currentProducer) : res.status(403).send({message: 'Forbidden'})
        }
    })
    .catch(err => {
        console.log('Error finding producer', err)
        res.status(503).send({message: 'Internal server error'})
    }) 
})


//PUT /producers/:id - update 1 producer
ROUTER.put('/:id', (req, res) => {

    //only can update a producer's inventory if requested by that producer or potentially if prodlead (need to search for user and determine region first)
    if(req.headers['isproducer'] === 'true' || req.headers['isprodlead'] === 'true') {

        DB.User.findById(req.params.id)
        .then(user => {
            //if requesting user's id is equal to the requested user id, or requesting user's region is equal to the requested user's region, update
            if(req.params.id === req.headers['id'] || user.region === req.headers['region']) {
                
                //update inventory
                DB.User.updateOne(
                    {_id: req.params.id},
                    {inventory: req.body.inventory} //may need to update this code based on how we have them update inventory
                )
                .then(updated => {
                    res.send(updated) //front end will confirm if updated w/ response.n === 1
                })
                .catch(err => {
                    console.log('Error updating inventory', err)
                    res.status(503).send('Internal server error')
                })

            } else {
                res.status(403).send({message: 'Forbidden'})
            }
        })
        .catch(err => {
            console.log('Error finding user', err)
            res.status(503).send({message: 'Internal server error'})
        })  
    }
    else {
        res.status(403).send({message: 'Forbidden'})
    }   

})



module.exports = ROUTER;