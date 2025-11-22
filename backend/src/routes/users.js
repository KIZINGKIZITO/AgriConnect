const express = require('express');
const { submitVerification, getVerificationStatus, reviewVerification } = require('../controllers/verificationController');
const { protect } = require('../middleware/auth');
const { uploadDocuments } = require('../middleware/upload');
const router = express.Router();

router.route('/')
    .post(protect, uploadDocuments, submitVerification)
    .get(protect, getVerificationStatus);

router.route('/:id/review')
    .put(protect, reviewVerification);

module.exports = router;