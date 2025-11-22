const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'stripe', 'paypal', 'mobile_money'],
        default: 'cash'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    trackingNumber: {
        type: String
    },
    estimatedDelivery: {
        type: Date
    },
    orderTimeline: [{
        status: String,
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    customerNotes: {
        type: String
    }
}, {
    timestamps: true
});

// Add to order timeline when status changes
orderSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        const statusDescriptions = {
            'pending': 'Order placed and waiting for confirmation',
            'confirmed': 'Order confirmed by farmer',
            'preparing': 'Farmer is preparing your order',
            'shipped': 'Order has been shipped',
            'delivered': 'Order delivered successfully',
            'cancelled': 'Order was cancelled'
        };

        this.orderTimeline.push({
            status: this.status,
            description: statusDescriptions[this.status] || `Order status changed to ${this.status}`
        });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);