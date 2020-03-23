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
    region: {
        type: String,
        // required: [true, 'region is required'] - unsure how we implement this during the auth flow
        // must be required at some point, otherwise gaps will appear. Will think on this more.
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