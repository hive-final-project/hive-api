const mongoose = require('mongoose');
const constants = require('../constants')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [{}],
        required: 'You need to have at least one product'
    },
    price: Number,
    day: {
        type: String,
        enum : constants.DAY_TO_SERVE
    },
    served: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
          ret.id = doc._id;
          delete ret._id;
          delete ret.__v;
          return ret;
        }
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;