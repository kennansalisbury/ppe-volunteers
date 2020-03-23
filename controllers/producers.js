const DB = require('../models');
const ROUTER = require('express').Router();

// GET /producers - find all producers
ROUTER.get('/', (req, res) => {
    //stub for testing route
    res.send('find all producers')

    // DB.User.find({ isProducer: true })
    // .then(users => {
    //     res.send(users)
    // })
    // .catch(err => {
    //     console.log('Error finding producers', err)
    //     res.status(503).send({message: 'Internal server error'})
    // })
})


//GET /producers/:id - find 1 producer
ROUTER.get('/:id', (req, res) => {
    //stub for testing route
    res.send('find 1 producer')

    //need to make this more secure than params?
    // DB.User.findById(req.params.id)
    // .then(user => {
    //     res.send(user) //update to only send needed fields once confirmed what we need to see
    // })
})


//PUT /producers/:id - update 1 producer
ROUTER.put('/:id', (req, res) => {
    //stub for testing route
    res.send('update 1 producer')

    // DB.User.updateOne(
    //     {_id: req.params.id},
    //     {inventory: req.body.inventory} //may need to update based on how we have them update inventory
    // )
    // .then(updated => {
    //     //need to be able to test and play around with what this returns
    // })
    // .catch(err => {
    //     console.log('Error updating inventory', err)
    //     res.status(503).send('Internal server error')
    // })

})



module.exports = ROUTER;