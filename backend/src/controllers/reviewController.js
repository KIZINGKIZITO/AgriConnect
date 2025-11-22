const Review = require('../models/Review');
const Order = require('../models/Order');

const createReview = async (req, res) => {
    try {
        const { orderId, rating, comment, isRecommended } = req.body;

        // Check if order exists and belongs to user
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to review this order' });
        }

        // Check if order is delivered
        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Can only review delivered orders' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ order: orderId });
        if (existingReview) {
            return res.status(400).json({ message: 'Order already reviewed' });
        }

        const review = new Review({
            order: orderId,
            product: order.product,
            farmer: order.farmer,
            buyer: req.user._id,
            rating,
            comment,
            isRecommended,
            images: req.files ? req.files.map(file => `/uploads/reviews/${file.filename}`) : []
        });

        await review.save();
        await review.populate('buyer', 'name profilePicture');

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

        const reviews = await Review.find({ product: productId })
            .populate('buyer', 'name profilePicture')
            .sort({ [sortBy]: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalReviews = await Review.countDocuments({ product: productId });

        res.json({
            reviews,
            totalPages: Math.ceil(totalReviews / limit),
            currentPage: page,
            totalReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markReviewHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.helpfulVotes += 1;
        await review.save();

        res.json({ message: 'Review marked as helpful', helpfulVotes: review.helpfulVotes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    markReviewHelpful
};