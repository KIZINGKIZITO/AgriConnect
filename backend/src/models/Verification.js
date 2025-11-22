const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentType: {
        type: String,
        enum: ['id_card', 'business_license', 'farm_certificate', 'tax_document'],
        required: true
    },
    documentImages: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Update user verification status when verification is approved
verificationSchema.post('save', async function(doc) {
    if (doc.status === 'approved') {
        const User = mongoose.model('User');
        await User.findByIdAndUpdate(doc.farmer, { 
            isVerified: true,
            verifiedAt: new Date()
        });
    }
});

module.exports = mongoose.model('Verification', verificationSchema);