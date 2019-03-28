const createError = require('http-errors');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

function decreaseProduct(products){
    /**
     * Revisalo poporsi, que es idea de concepto
     */
    products.forEach( product => {
            // const productFound = await Product.findById(product)
            // if(productFound - product.units >= 0) {
            //     productFound.amount -= product.units
            // }
            // await productFound.save()
        Product.findById(product.product)
        .populate('product')
        .then(p => {
            if ((p.amount - product.units) >= 0){
                p.amount -= product.units;
                return p.save()
            } 
        })
        .catch(next);
    })   
};

module.exports.newOrder = (req, res, next) => {
    const user = req.user.id;
    const { products, price } = req.body;

    const order = new Order({
        user: user,
        products: products,
        price: price
    });
    
    order.save()
        .then(order => res.status(201).json(order))
        .catch(next)
};

module.exports.editOrder = (req, res, next) => {
    const order = req.params.id; 
    const { price } = req.body;
    console.info('req.body', price, {new: true})
    Order.findById(order)
    .then(order => {
        if(!order){
            throw createError(401, 'No order found matching the selection.');
        }
        else {
            Object.keys(req.body).forEach(prop => order[prop] = req.body[prop]);
            return order.save();               
        }
    })
    .then(order => res.status(202).json(order))
    .catch(next)
};

module.exports.deleteOrder = (req, res, next) => {
    console.log('req.params.id',req.params.id)
    Order.findByIdAndDelete(req.params.id)
    .then(order => {
      if (!order) throw createError(404, 'Order not found');
      else res.status(204).json();
    })
    .catch(next);
};

module.exports.sendOrder = (req, res, next) => {
    const order = req.params.id;
    Order.findById(order)
    .then(o => {
        if(o.user == req.user.id){
            o.served = 'Payed';
            decreaseProduct(o.products);
            console.log(o)
            return o.save()
            .then(order => {
                res.status(204).json(order)
            })
        } else throw createError(401, 'No privileges');

    })
    .catch(next);
};

module.exports.getOrder = (req, res, next) => {
    console.log(req.params)
    const order = req.params.id;
    Order.findById(order)
    .then( order => {
        if (!order) throw createError(404, 'Order not found');
        else res.status(204).json(order);
    })
    .catch(next);
}

module.exports.listOrders = (req, res, next) => {

    const orders = [];
    const producer = req.user.id;

    Order.find({})
    .populate('product')
    .then(o => {
        orders = ordersFilter(o, producer);
        res.status(204).json(orders)
    })
    .catch(next);
}

function ordersFilter (orders, producer){
    const ordersProduct = [];

    orders.forEach(order => {
        const { user, served }  = order; 
        const prods = productsFilter(order.products, producer)
        if (prods.length > 0){
            ordersProduct.push({user: user, products: prods, served: served})
        }
    })
    return ordersProduct
} 

function productsFilter (products, producer){
    const productsProducer = [];
    products.forEach(product => {
        Product.findById(product.product)
        .then (p => {
            if (p.user == producer){
                productsProducer.push(p)
            }
        })
        .catch(next)
    })
    console.log("products of the producer",productsProducer);
    return productsProducer;
} 