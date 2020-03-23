const MONGOOSE = require('mongoose')
const DB = require('..')

let data = [{name: 'Mask'}, {name: 'Gown'}, {name: 'Face Shield'}]

DB.Product.create(data).then(console.log('products seeded'))