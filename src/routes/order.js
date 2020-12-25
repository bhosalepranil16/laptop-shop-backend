const router = require('express').Router();

const Order = require('../db/models/order');
const isUser = require('../middlerwares/user');
const isOwner = require('../middlerwares/owner');

router.get('/orders/allOrders', isOwner, async (req, res) => {
    try {
        if(!req.isOwner) {
            throw new Error('Unauthenticated');
        }
        const orders = await Order.find({}, null, { skip: (req.query.page - 1) * 5, limit : 5 })
                        .populate('laptop').populate('user');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(err);
    }
});

router.get('/orders/me', isUser, async(req, res) => {
    try {
        if(!req.isUser) {
            throw new Error('Unauthenticated');
        }
        const orders = await Order.find({ user : req._id }, null, { skip: (req.query.page - 1) * 5, limit : 5 })
                        .populate('laptop').populate('user');;
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(err);
    }
});

router.post('/orders/createOrder', isUser, async(req, res) => {
    if(!req.isUser) {
        throw new Error('Unauthenticated');
    } 
    const order = new Order({
        user : req._id,
        ...req.body
    });
    await order.save();
    res.status(201).json(order);
});

router.patch('/orders/placeOrder/:id', isOwner, async(req, res) => {
    try {
        if(!req.isOwner) {
            throw new Error('Unauthenticated');
        }
        let order = await Order.findById(req.params.id);
        if(!order) {
            res.status(404).send();
        }
        order = await Order.updateOne({ _id: req.params.id }, { placed : true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/orders/deleteOrder/:id', isUser, async (req, res) => {
    try {
        if(!req.isUser) {
            throw new Error('Unauthenticated');
        }
        const order = await Order.findById(req.params.id);
        if(order._doc.user != req._id) {
            throw new Error('Unauthenticated');
        }
        if(!order) {
            res.status(404).send();
        }
        await Order.deleteOne({_id : req.params.id});
        res.status(200).send();
    }
    catch(err) {
        res.status(500).json(err);
    }
});



module.exports = router;


