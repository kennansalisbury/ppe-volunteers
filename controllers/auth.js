// dependencies
require('dotenv').config();
const JWT = require('jsonwebtoken');
const DB = require('../models');
const ROUTER = require('express').Router();
// POST /auth/login
ROUTER.post('/login', (req, res) => {
    console.log(req.body.email)
    // check if username is in the system
    DB.User.findOne({ email: req.body.email})
    .then(user => {
        // confirm user and password exist
        if (!user || !user.password) {
            return res.status(404).send({ message: 'User not found.'});
        };
        // if user exists, check password
        if (!user.isAuthenticated(req.body.password)) {
            // invalid password, error
            return res.status(406).send({ message: 'Invalid credentials.'});
        };
        let token = JWT.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60
        });
        res.send({ token });
    })
    .catch(err => {
        console.log(`Error in POST /auth/login. ${err}`);
        res.status(503).send({ message: 'Database error.'});
    });
});
// POST /auth/signup
ROUTER.post('/signup', (req, res) => {
    // use email as the key until we've spoken with Nina
    // if email exists, user is already in the system. can create a failsafe for this
    DB.User.findOne({ email: req.body.email })
    .then(user => {
        // if user exists, error
        if (user) {
            return res.status(409).send({ message: 'Email already in use'});
        };
        // if not, create
        DB.User.create(req.body)
        .then(newUser => {
            // sign token to user
            let token = JWT.sign(newUser.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 120
            });
            res.send({ token });
        })
        .catch(err => {
            console.log(`Error creating new user. ${err}`);
            res.status(500).send({ message: 'Internal server error.'})
        });
    })
    .catch(err => {
        console.log(`Error in POST /auth/signup. ${err}`);
        res.status(503).send({ message: 'Database error.' })
    });
});
// GET /current/user
ROUTER.get('/current/user', (req, res) => {
    // if user is logged in, req.user should have data
    console.log(req.user);
    if (!req.user || !req.user._id) {
        return res.status(417).send({ message: 'Expectation failed. Check config.' });
    };
        // Data from token issue
        // If updating user, sign token again after update
    res.send({ user: req.user });
});

module.exports = ROUTER;