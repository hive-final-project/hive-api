const createError = require('http-errors');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

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
    console.info('PRODUCTS => ', req.body)
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
    console.info('req.body', req.body)
    delete req.body.products
    Order.findByIdAndUpdate(order, req.body, { runValidators: true, new: true })
        .then(order => res.status(202).json(order))
        .catch(next)
};

module.exports.deleteOrder = (req, res, next) => {
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
            return o.save()
            .then(order => {
                res.status(201).json(order)
            })
        } else throw createError(401, 'No privileges');

    })
    .catch(next);
};

module.exports.getOrder = (req, res, next) => {
    const order = req.params.id;
    Order.findById(order)
    .then( o => {
        if(o.user == req.user.id){
            res.status(201).json(o)
        }
    })
    .catch(next);
}

module.exports.listOrders = async (req, res, next) => {

    const start = async() => {
        let orders = [];
        const producer = req.user.id;
        const allOrders = await Order.find({})
        orders = await ordersFilter(allOrders, producer);
        console.log('orders back', allOrders)
        if (orders.length) {
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

const ordersFilter = (orders, producer) => {
    console.log('filter', orders)
    const start = async () => {
        let ordersProduct = [];
        await asyncForEach(orders, async (order) => {
            const { user, served, id }  = order; 
            const prods = await productsFilter(order.products, producer)
            console.log('order', order.products)
            console.log('prods', prods)
            if (prods.length){
                ordersProduct.push({user: user, products: prods, served: served, id: id})
            }
        })
        console.log('ordersFilter', ordersProduct)
        return ordersProduct;
    } 
    return start();
} 

const productsFilter = (products, producer) => {
    const start = async () => {
        let productsProducer = [];
        console.log('finalProducts', products)
        await asyncForEach(products, async (product) => {
            try {
                const eachProduct = await Product.findById(product.product)
                console.log('eachProduct',eachProduct)
                if (eachProduct.user == producer){
                    productsProducer.push(eachProduct);
                }
            } catch(error) {
                console.info('ERROR => ', error)
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

