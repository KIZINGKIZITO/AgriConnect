const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createPaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        const order = await Order.findById(orderId)
            .populate('product')
            .populate('buyer');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.buyer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order._id.toString(),
                buyerId: req.user._id.toString()
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            await handleSuccessfulPayment(paymentIntent);
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            await handleFailedPayment(failedPayment);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

const handleSuccessfulPayment = async (paymentIntent) => {
    try {
        const orderId = paymentIntent.metadata.orderId;
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'paid',
            paymentMethod: 'stripe',
            paidAt: new Date()
        });
        
        // You can also send email notifications here
    } catch (error) {
        console.error('Error handling successful payment:', error);
    }
};

module.exports = {
    createPaymentIntent,
    handleWebhook
};