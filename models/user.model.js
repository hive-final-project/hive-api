const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const Order = require('./order.model')

const emailRegEx = /(.+)@(.+){2,}\.(.+){2,}/i;
const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d){8,}/;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'Email is required.',
        validate: emailRegEx
    },
    name:{
        type: String,
        required: 'We need your name.'
    },
    password:{
        type: String,
        required: 'Password is required',
        validate: passRegEx
    },
    imageURL: String,
    street:{
        type: String,
        required: 'A street is required'
    },
    number:{
        type: String,
        required: 'Witch is your street number?'
    },
    zipCode:{
        type: Number,
        required:'Your zip code is required'
    },
    other: String
},{timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
          ret.id = doc._id;
          delete ret._id;
          delete ret.__v;
          delete ret.password;
          return ret;
        }
    }
});

userSchema.virtual('orders', {
    ref: Order.modelName,
    localField: '_id',
    foreignField: 'order',
    options: { sort: { position: -1 } }
})

userSchema.pre('save', function(next){
    const user = this;
    if (!user.isModified('password')){
        next();
    } else {
        bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            return bcrypt.hash(user.password, salt)
            .then(hash => {
                user.password = hash;
                next();
            })
        })
        .catch(error => next(error))
    }
});

userSchema.methods.checkPassword = function(password){
    return bcrypt.compare(password, this.password)
}; 

const User = mongoose.model('User', userSchema);

module.exports = User;