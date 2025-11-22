const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    isRecommended: {
        type: Boolean,
        default: true
    },
    helpfulVotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Ensure one review per order
reviewSchema.index({ order: 1 }, { unique: true });

// Update product average rating when review is added
reviewSchema.post('save', async function(doc) {
    const Review = mongoose.model('Review');
    const Product = mongoose.model('Product');
    
    const reviews = await Review.find({ product: doc.product });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(doc.product, {
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length
    });
});

module.exports = mongoose.model('Review', reviewSchema);