const mongoose = require('mongoose');
const constants = require('../constants');

const productSchema = new mongoose.Schema({
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producer',
        required: true
    },
    category: {
        type: String,
        enum: constants.CATEGORY_CONST.map(c => c.id)
    },
    name: {
        type: String,
        required: 'A product name is necessary.'
    },
    imageURL: String,
    price: {
        type: Number,
        required: 'You need to establish a price for the product.'
    },
    units: {
        type: Number,
        required: 'You need to include how many units do you have of the product.'
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

['Fruits & Vegetables', 'Milk products', 'Poultry products', 'Apiculture', 'Butcher products']

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;