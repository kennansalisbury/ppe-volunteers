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
        type: Number,
        required: [true, 'zipcode is required']
    },
    // not required, set initial value to false on front end
    isProducer: {
        type: Boolean
    },
    isProdLead: {
        type: Boolean
    },
    isClinic: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    },
    // products: {
    //     type: MONGOOSE.Schema.Types.ObjectId,
    //     ref: 'Product'
    // },
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