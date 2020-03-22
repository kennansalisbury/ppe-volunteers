// dependencies
const MONGOOSE = require('mongoose');
// schema
const clinicSchema = new MONGOOSE.Schema({
    name: {
        type: String,
        required: [true, 'clinic name required']
    },
    address: {
        type: [String],
        required: [true, 'clinic address required']
    },
    city: {
        type: String,
        required: [true, 'clinic city required']
    },
    state: {
        type: String,
        required: [true, 'clinic state required']
    },
    zipcode: {
        type: String,
        required: [true, 'clinic zipcode required']
    },
    numberOfEmployees: {
        type: Number,
        required: [true, 'clinic employees number required']
    },
    // required?
    assignedUser: {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'User'
    },  
    orders: {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = MONGOOSE.model('Clinic', clinicSchema);