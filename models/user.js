// dependencies
const BCRYPT = require('bcryptjs');
const MONGOOSE = require('mongoose');
// schema
const userSchema = new MONGOOSE.Schema({
    firstName: {
        type: String,
        required: [true, 'first name required']
    },
    lastName: {
        type: String,
        required: [true, 'last name required']
    },
    username: {
        type: String,
        required: [true, 'username required']
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minlength: [8, 'password must be minimum 8 characters']
    },
    email: {
        type: String,
        required: [true, 'email required']
    },
    address: {
        type: [String],
        required: [true, 'address is required']
    },
    city: {
        type: String,
        required: [true, 'city is required']
    },
    state: {
        type: String,
        required: [true, 'state is required']
    },
    zipcode: {
        type: String,
        required: [true, 'zipcode is required']
    },
    region: {
        type: String,
        // required: [true, 'region is required'] - unsure how we implement this during the auth flow
        // must be required at some point, otherwise gaps will appear. Will think on this more.
    },
    // not required, set initial value to false on front end
    isProducer: {
        type: Boolean,
        default: false
    },
    isProdLead: {
        type: Boolean,
        default: false
    },
    isClinic: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDriver: {
        type: Boolean,
        default: false
    },
    //default false
    isActive: {
        type: Boolean,
        default: false
    },
    inventory: [{
        product: {
            type: MONGOOSE.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product ordered is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            default: 0
        }
    }],
    orders: {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'ProductOrder'
    }
});
// hash password with bcrypt
userSchema.pre('save', function(next) {
    this.password = BCRYPT.hashSync(this.password, 12)
    next()
});
// remove password from user object
userSchema.set('toJSON', {
    transform: (doc, user) => {
        delete user.password
        return user
    }
});
// helper function for password hash comparison
userSchema.methods.isAuthenticated = function(typedPassword) {
    return BCRYPT.compareSync(typedPassword, this.password)
};

module.exports = MONGOOSE.model('User', userSchema);