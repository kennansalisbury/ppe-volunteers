const DB = require('../models');
const ROUTER = require('express').Router();

//GET /clinics - show all clinics
ROUTER.get('/', (req, res) => {
    //if request coming from source other than any of our user types, forbidden
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false' && req.headers['isdriver'] === 'false' && req.headers['isproducer'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }

    DB.Clinic.find().populate('assignedUser')
    .then(clinics => {

        //if admin or clinic lead, send back all data
        if(req.headers['isadmin'] === 'true' || req.headers['isclinic'] === 'true') {
            res.send(clinics)
        }

        //if prod lead send back all data for clinics in their region
        else if(req.headers['isprodlead'] === 'true') {
            let data = clinics.filter(clinic => clinic.region === req.headers['region'])
            res.send(data)
        }

        //if producer or driver, send back name, address info, region, and assigned user/clinic lead (name and email only)
        else if(req.headers['isproducer'] === 'true' || req.headers['isdriver'] === 'true') {
            let filtered = clinics.filter(clinic => clinic.region === req.headers['region'])
            let data = filtered.map(clinic => ({
                _id: clinic._id,
                name: clinic.name,
                address: clinic.address,
                city: clinic.city,
                state: clinic.state,
                zipcode: clinic.zipcode,
                region: clinic.region,
                clinicLead: {
                    firstName: clinic.assignedUser.firstName,
                    lastName: clinic.assignedUser.lastName,
                    email: clinic.assignedUser.email
                }
            }))
            res.send(data)
        }

    }) 
    .catch(err => {
        console.log('Error finding clinics', err)
        res.status(503).send({message: 'Internal server error'})
    })

})


//POST /clinics - add new clinic (admin or clinic admin only)
ROUTER.post('/', (req, res) => {
    //if admin or clinic requesting, find or create new clinic
    if(req.headers['isadmin'] === 'true' || req.headers['isclinic'] === 'true'){
        DB.Clinic.findOne({name: req.body.name, zipcode: req.body.zipcode})
        .then(clinic => {
            //if clinic exists, error
            if(clinic) {
                return res.status(409).send({message: 'Clinic with the same name and zipcode already exists'})
            }

            //if does not exist, create
            DB.Clinic.create(req.body)
            .then(newClinic => {
                res.send(newClinic)
                console.log('new clinic created')
            })
            .catch(err => {
                console.log('Error creating clinic', err)
                res.status(503).send({message: 'Internal server error'})
            })
        })
        .catch(err => {
            console.log('Error searching clinics', err)
            res.status(503).send({message: 'Internal server error'})
        })
    }
    //else forbidden
    else {
        res.status(403).send({message: 'Forbidden'})
    }

})


//GET /clinics/:id - show 1 clinic
ROUTER.get('/:id', (req, res) => {
    //if request coming from source other than any of our user types, forbidden
    if(req.headers['isadmin'] === 'false' && req.headers['isprodlead'] === 'false' && req.headers['isclinic'] === 'false' && req.headers['isdriver'] === 'false' && req.headers['isproducer'] === 'false') {
        res.status(403).send({message: 'Forbidden'})
        return
    }

    DB.Clinic.findById(req.params.id).populate('assignedUser')
    .then(clinic => {

        //if admin or clinic lead, send back all data
        if(req.headers['isadmin'] === 'true' || req.headers['isclinic'] === 'true') {
            res.send(clinic)
        }

        //if prod lead, if clinic in same region send back all data
        else if(req.headers['isprodlead'] === 'true' && req.headers['region'] === clinic.region) {
            res.send(clinic)
        }

        //if producer or driver, send back name, address info, region, and assigned user/clinic lead (name and email only)
        else if(req.headers['isproducer'] === 'true' || req.headers['isdriver'] === 'true') {
            let data = {
                _id: clinic._id,
                name: clinic.name,
                address: clinic.address,
                city: clinic.city,
                state: clinic.state,
                zipcode: clinic.zipcode,
                region: clinic.region,
                clinicLead: {
                    firstName: clinic.assignedUser.firstName,
                    lastName: clinic.assignedUser.lastName,
                    email: clinic.assignedUser.email
                } 
            }
            res.send(data)
        }

        else {
            res.status(403).send({message: 'Forbidden'})
        }
    })

})


//PUT /clinics/:id - update demand/need for a clinic or clinic information
ROUTER.put('/:id', (req, res) => {
    //if admin or clinic lead is requesting
    if(req.headers['isadmin'] === 'true' || req.headers['isclinic'] === 'true') {

        //find clinic and if it is a clinic lead requesting, compare assigned user to clinic lead requesting
        DB.Clinic.findById(req.params.id)
        .then(clinic => {
            
            if(req.headers['isclinic'] === 'true' && req.headers['id'] != clinic.assignedUser) {
                return res.status(403).send({message: 'Forbidden'})
            } 

            DB.Clinic.updateOne(
                {_id: req.params.id},
                req.body
            )
            .then(updated => {
                res.send(updated)
            })
            .catch(err => {
                console.log('Error updating clinic', err)
                res.status(503).send('Internal server error')
            })

        })
        .catch(err => {
            console.log('Error finding clinic', err)
            res.status(503).send('Internal server error')
        })

    }

    //else forbidden
    else {
        res.status(403).send({message: 'Forbidden'})
    }
})




module.exports = ROUTER;