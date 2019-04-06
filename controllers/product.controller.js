const createError = require('http-errors');
const Product = require('../models/product.model');

module.exports.newProduct = (req, res, next) => {
    const user = req.user;
    const { name } = req.body;
    Product.findOne({ name: name})
    .populate('user')
    .then(product => {
        if (product && user === product.user.id){
            throw createError(409,'Product already registered');
        } else {
            const product =  new Product(req.body);
            product.user = user;
            if (req.file) product.imageURL = req.file.secure_url;
            return product.save();
        }
    })
    .then(product => res.status(201).json(product))
    .catch(next);
};

module.exports.editProduct = (req, res, next) => {
    console.log('rec.params', req.params.id)
    const product = req.params.id;
    Product.findById(product)
    .then(product => {
        if(!product){
            throw createError(401, 'No product found.');
        }
        else {
            if (req.file) product.imageURL = req.file.secure_url;
            Object.keys(req.body).forEach(prop => product[prop] = req.body[prop]);
            return product.save();               
        }
    })
    .then(product => res.status(202).json(product))
    .catch(next)
};

module.exports.getProduct = (req, res, next) => {
    const product = req.params.id;
    console.log('product', product);
    Product.findById(product)
    .populate('user')
    .then(product => {
        if(!product){
            throw createError(404, 'No product found.');
        }
        else {
            res.status(202).json(product)
        }
    })
    .catch(next)
};

module.exports.getAllProducts = (req, res, next) => {
    Product.find({})
    .then(p => {
        console.log('response', p)
        if(!p){
            throw createError(404, 'No product found.');
        }
        else {
            res.status(202).json(p)
        }
    })
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