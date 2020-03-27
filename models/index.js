const MONGOOSE = require('mongoose')

MONGOOSE.connect(process.env.MONGODB_URI || 'mongodb://localhost/ppe_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports.User = require('./user')
module.exports.Clinic = require('./clinic')
module.exports.Product = require('./product')
module.exports.ProductOrder = require('./productOrder')