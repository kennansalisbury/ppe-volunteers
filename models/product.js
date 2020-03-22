// dependencies
const MONGOOSE = require('mongoose');
// schema
const productSchema = new MONGOOSE.Schema({
    name: {
        type: String,
        required: [true, 'product name is required']
    }
});

module.exports = MONGOOSE.model('Product', productSchema);