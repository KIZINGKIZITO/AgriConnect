const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addRating,
    advancedSearch, // NEW
    createProductWithImages // NEW
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload'); // NEW
const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, uploadMultiple, createProductWithImages); // UPDATED

router.route('/search')
    .get(advancedSearch); // NEW

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

router.route('/:id/ratings')
    .post(protect, addRating);

module.exports = router;