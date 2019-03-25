const mongoose = require('mongoose');
const constants = require('../constants');

const productSchema = new mongoose.Schema({
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: constants.CATEGORY_CONST.map(c => c.id),
        required: 'You need to select a category'
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
    amount: {
        type: Number,
        required: 'You need to include how many units, kg, liters do you have of the product.'
    },
    description: String,
    active: Boolean
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;