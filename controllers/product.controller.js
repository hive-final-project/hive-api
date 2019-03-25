const createError = require('http-errors');
const Product = require('../models/product.model');

module.exports.newProduct = (req, res, next) => {
    const { name, producer } = req.body;
    Product.findOne({ name: name})
    .populate('producer')
    .then(product => {
        if (product && producer === product.producer.id){
            throw createError(409,'Product already registered');
        } else return new Product(req.body).save();
    })
    .then(product => res.status(201).json(product))
    .catch(next);
};

module.exports.editProduct = (req, res, next) => {
    const name = req.body.name;
    Product.findOne({ name: name })
    .then(product => {
        if(!product){
            throw createError(401, message);
        }
        else {
            if (req.file) user.imageURL = req.file.secure_url;
            Object.keys(req.body).forEach(prop => product[prop] = req.body[prop]);
            return product.save();               
        }
    })
    .then(product => res.status(202).json(product))
    .catch(next)
};

module.exports.delete = (req, res, next) => {
    Product.findByIdAndDelete(req.params.id)
    .then(product => {
      if (!product) throw createError(404, 'Product not found');
      else res.status(204).json();
    })
    .catch(next);
}