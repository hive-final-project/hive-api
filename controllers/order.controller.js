const createError = require('http-errors');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');


function decreaseProduct(products, next){

    const start = async () => {
        await asyncForEach(products, async (product) => {
            const eachProduct = await Product.findById(product.product);
            if ((eachProduct.amount - product.units) >= 0 ){
                eachProduct.amount -= product.units;
                await eachProduct.save()
            }
            else throw createError(401, 'Not enougth stock');
        })
    }

    start(); 
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
            decreaseProduct(o.products, next);
            console.log(o)
            return o.save()
            .then(order => {
                res.status(201).json(order)
            })
        } else throw createError(401, 'No privileges');

    })
    .catch(next);
};

module.exports.getOrder = (req, res, next) => {
    console.log(req.params)
    const order = req.params.id;
    Order.findById(order)
    .then( o => {
        if(o.user == req.user.id){
            res.status(201).json(o)
        }
    })
    .catch(next);
}

module.exports.listOrders = (req, res, next) => {

    const start = async() => {
        let orders = [];
        const producer = req.user.id;
        const allOrders = await Order.find({})
        console.log('All orders', allOrders);
        orders = await ordersFilter(allOrders, producer, next);
        if (orders.length > 0) {
            console.log('orders de vuelta', orders);
            return orders;
        }
        else throw createError(404, 'No orders found');
    } 

   start()
   .then(orders => {
       res.status(201).json(orders)
   })
   .catch(next)
}

function ordersFilter (orders, producer, next){

    const start = async () => {
        let ordersProduct = [];
        await asyncForEach(orders, async (order) => {
            const { user, served }  = order; 
            const prods = await productsFilter(order.products, producer, next)
                if (prods.length > 0){
                    ordersProduct.push({user: user, products: prods, served: served})
                }
        })
        return ordersProduct;
    } 
    return start();
} 

function productsFilter (products, producer, next){

    const start =  async () => {
        let productsProducer = [];
        await asyncForEach(products, async (product) => {
        const eachProduct = await Product.findById(product.product)
                if (eachProduct.user == producer){
                    productsProducer.push(eachProduct);
                }
        })
        return productsProducer;
    }
    return start();
} 

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}
