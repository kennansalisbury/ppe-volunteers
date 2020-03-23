const DB = require('../models');
const ROUTER = require('express').Router();

//GET /clinics - show all clinics
ROUTER.get('/', (req, res) => {
    res.send('find all clinics')
})


//POST /clinics - add new clinic (admin or clinic admin only)
ROUTER.post('/', (req, res) => {
    res.send('create new clinic')
})


//GET /clinics/:id - show 1 clinic
ROUTER.get('/:id', (req, res) => {
    res.send('show 1 clinic')
})


//PUT /clinics/:id - update demand/need for a clinic
ROUTER.put('/:id', (req, res) => {
    res.send('update 1 clinic')
})




module.exports = ROUTER;