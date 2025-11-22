const Product = require('../models/Product');
const fs = require('fs');

// Your existing functions...
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            farmer: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createProductWithImages = async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
        
        const product = new Product({
            ...req.body,
            farmer: req.user._id,
            images: imagePaths
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        // Delete uploaded files if product creation fails
        if (req.files) {
            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
        }
        res.status(400).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const { category, search, farmer } = req.query;
        let filter = { isAvailable: true };

        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (farmer) filter.farmer = farmer;

        const products = await Product.find(filter)
            .populate('farmer', 'name farmName profilePicture')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const advancedSearch = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            quality,
            location,
            farmer,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12
        } = req.query;

        let filter = { isAvailable: true };

        // Text search
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'farmer.farmName': { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) filter.category = category;

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Quality filter
        if (quality) filter.quality = quality;

        // Location filter
        if (location) {
            filter['farmer.location'] = { $regex: location, $options: 'i' };
        }

        // Farmer filter
        if (farmer) filter.farmer = farmer;

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Pagination
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .populate('farmer', 'name farmName profilePicture location rating')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add your other existing functions (getProductById, updateProduct, deleteProduct, addRating)...

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('farmer', 'name farmName profilePicture location phoneNumber email')
            .populate('ratings.user', 'name');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product && product.farmer.toString() === req.user._id.toString()) {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product && product.farmer.toString() === req.user._id.toString()) {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addRating = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyRated = product.ratings.find(
                r => r.user.toString() === req.user._id.toString()
            );

            if (alreadyRated) {
                res.status(400).json({ message: 'Product already rated' });
            } else {
                product.ratings.push({
                    user: req.user._id,
                    rating,
                    comment
                });

                product.averageRating = product.ratings.reduce((acc, item) => item.rating + acc, 0) / product.ratings.length;
                await product.save();
                res.status(201).json({ message: 'Rating added' });
            }
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Make sure ALL functions are exported
module.exports = {
    createProduct,
    createProductWithImages, // Make sure this is exported
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addRating,
    advancedSearch // Make sure this is exported
};