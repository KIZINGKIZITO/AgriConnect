const express = require('express');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/create-intent')
    .post(protect, createPaymentIntent);

// Webhook route is handled directly in server.js

module.exports = router;