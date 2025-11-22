const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

const createOrder = async (req, res) => {
    try {
        const { productId, quantity, deliveryAddress, paymentMethod } = req.body;
        
        const product = await Product.findById(productId).populate('farmer');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity available' });
        }

        const totalPrice = product.price * quantity;

        const order = new Order({
            buyer: req.user._id,
            farmer: product.farmer._id,
            product: productId,
            quantity,
            totalPrice,
            deliveryAddress,
            paymentMethod
        });

        // Update product quantity
        product.quantity -= quantity;
        if (product.quantity === 0) {
            product.isAvailable = false;
        }
        await product.save();

        const savedOrder = await order.save();

        // Create notification for farmer
        await Notification.create({
            user: product.farmer._id,
            type: 'order',
            title: 'New Order Received',
            message: `You have a new order for ${quantity} ${product.unit} of ${product.name}`,
            relatedId: savedOrder._id
        });

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const { role } = req.user;
        let filter = {};

        if (role === 'farmer') {
            filter.farmer = req.user._id;
        } else if (role === 'buyer') {
            filter.buyer = req.user._id;
        }

        const orders = await Order.find(filter)
            .populate('buyer', 'name email phoneNumber')
            .populate('farmer', 'name farmName email phoneNumber')
            .populate('product', 'name category images')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id)
            .populate('buyer')
            .populate('product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        // Create notification for buyer
        await Notification.create({
            user: order.buyer._id,
            type: 'order',
            title: 'Order Status Updated',
            message: `Your order for ${order.product.name} has been ${status}`,
            relatedId: order._id
        });

        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};