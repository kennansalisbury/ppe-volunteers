// dependencies
const MONGOOSE = require('mongoose');

const materialSchema = new MONGOOSE.Schema({
    name: {
        type: String,
        required: [true, 'material name is required']
    },
    cost: {
        type: Number
    }
});

module.exports = MONGOOSE.model('Material', materialSchema);