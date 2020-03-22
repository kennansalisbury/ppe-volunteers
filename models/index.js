const MONGOOSE = require('mongoose')

MONGOOSE.connect(process.env.MONGODB_URI || 'mongodb://localhost/ppe_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports.User = require('./user')