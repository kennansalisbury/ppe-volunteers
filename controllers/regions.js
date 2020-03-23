const DB = require('../models');
const ROUTER = require('express').Router();

//GET /regions - show all regions
ROUTER.get('/', (req, res) => {
    res.send('show all regions')
})

//POST /regions - add new region
ROUTER.post('/', (req, res) => {
    res.send('add new region')
})

//GET /regions/:id - 1 region - all producers/clinics in that region
ROUTER.get('/:id', (req, res) => {
    res.send('show 1 region - all producers/clinics')
})

//PUT /regions/:id - Add/remove producers/clinics/leads to a region
ROUTER.put('/:id', (req, res) => {
    res.send('update 1 region - add/remove producers/clinics/leads')
})

module.exports = ROUTER;