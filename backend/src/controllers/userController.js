const User = require('../models/User');
const Product = require('../models/Product');
const Verification = require('../models/Verification');
const Notification = require('../models/Notification');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) {
            updates.profilePicture = req.file.path;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getFarmerProducts = async (req, res) => {
    try {
        const products = await Product.find({ 
            farmer: req.params.farmerId,
            isAvailable: true 
        }).populate('farmer', 'name farmName profilePicture location');
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitVerification = async (req, res) => {
    try {
        const { documentType } = req.body;
        const documentImages = req.files.map(file => file.path);

        const verification = new Verification({
            farmer: req.user._id,
            documentType,
            documentImages
        });

        await verification.save();

        res.status(201).json({ message: 'Verification submitted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getFarmerProducts,
    submitVerification,
    getNotifications,
    markNotificationAsRead
};


const updateProfileWithImage = async (req, res) => {
    try {
        const updates = req.body;
        
        if (req.file) {
            updates.profilePicture = `/uploads/profiles/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};