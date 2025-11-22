const Verification = require('../models/Verification');
const User = require('../models/User');

const submitVerification = async (req, res) => {
    try {
        const { documentType } = req.body;
        const documentImages = req.files ? req.files.map(file => `/uploads/verification/${file.filename}`) : [];

        // Check if user already has a pending verification
        const existingVerification = await Verification.findOne({
            farmer: req.user._id,
            status: 'pending'
        });

        if (existingVerification) {
            return res.status(400).json({ 
                message: 'You already have a pending verification request' 
            });
        }

        const verification = new Verification({
            farmer: req.user._id,
            documentType,
            documentImages
        });

        await verification.save();

        res.status(201).json({ 
            message: 'Verification submitted successfully',
            verification 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getVerificationStatus = async (req, res) => {
    try {
        const verification = await Verification.findOne({ farmer: req.user._id })
            .sort({ createdAt: -1 });

        res.json(verification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reviewVerification = async (req, res) => {
    try {
        const { status, reviewNotes } = req.body;

        const verification = await Verification.findById(req.params.id)
            .populate('farmer');

        if (!verification) {
            return res.status(404).json({ message: 'Verification not found' });
        }

        verification.status = status;
        verification.reviewNotes = reviewNotes;
        verification.reviewedBy = req.user._id;
        verification.reviewedAt = new Date();

        await verification.save();

        // Update user verification status
        if (status === 'approved') {
            await User.findByIdAndUpdate(verification.farmer._id, {
                isVerified: true,
                verifiedAt: new Date()
            });
        }

        res.json({ 
            message: `Verification ${status}`,
            verification 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    submitVerification,
    getVerificationStatus,
    reviewVerification
};