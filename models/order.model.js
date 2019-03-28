const mongoose = require('mongoose');
const constants = require('../constants');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            units: Number
        }],
        default: []
    },
    price: Number,
    served: {
        type: String,
        enum: constants.ORDER_STATUS,
        default: 'Pending'
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