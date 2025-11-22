const express = require('express');
const { createReview, getProductReviews, markReviewHelpful } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');
const router = express.Router();

router.route('/')
    .post(protect, uploadMultiple, createReview);

router.route('/product/:productId')
    .get(getProductReviews);

router.route('/:id/helpful')
    .put(protect, markReviewHelpful);

module.exports = router;