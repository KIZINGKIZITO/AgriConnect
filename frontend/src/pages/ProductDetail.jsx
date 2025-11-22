import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderData, setOrderData] = useState({
        deliveryAddress: '',
        paymentMethod: 'cash'
    });
    const [rating, setRating] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders', {
                productId: product._id,
                quantity: orderQuantity,
                deliveryAddress: orderData.deliveryAddress,
                paymentMethod: orderData.paymentMethod
            });
            alert('Order placed successfully!');
            setShowOrderModal(false);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Error placing order');
        }
    };

    const handleRating = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/products/${id}/ratings`, rating);
            alert('Rating submitted successfully!');
            setRating({ rating: 5, comment: '' });
            fetchProduct(); // Refresh product data
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting rating');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading product...</div>;
    }

    if (!product) {
        return <div className="container mx-auto px-4 py-8">Product not found</div>;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const isBuyer = user?.role === 'buyer';
    const canOrder = isBuyer && product.isAvailable && product.quantity > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Images */}
                        <div>
                            <img 
                                src={product.images?.[0] || '/default-product.jpg'} 
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {product.images?.map((image, index) => (
                                    <img 
                                        key={index}
                                        src={image} 
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-2xl font-bold text-green-600">
                                    ${product.price}/{product.unit}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    product.isAvailable 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Product Specifications */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                        {product.category}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Quality</span>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                                        {product.quality}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Available Quantity</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {product.quantity} {product.unit}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Average Rating</span>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        ⭐ {product.averageRating?.toFixed(1) || 'No ratings yet'}
                                    </p>
                                </div>
                            </div>

                            {/* Farmer Info */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <img 
                                        src={product.farmer?.profilePicture || '/default-avatar.png'} 
                                        alt={product.farmer?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {product.farmer?.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {product.farmer?.farmName}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p>📍 {product.farmer?.location}</p>
                                    <p>📞 {product.farmer?.phoneNumber}</p>
                                    <p>✉️ {product.farmer?.email}</p>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                    <Link 
                                        to={`/farmer/${product.farmer?._id}`}
                                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                                    >
                                        View Farmer Profile
                                    </Link>
                                    <Link 
                                        to={`/messages`}
                                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                    >
                                        Message Farmer
                                    </Link>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {canOrder && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Quantity:
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Max: {product.quantity}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setShowOrderModal(true)}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                                    >
                                        Place Order - ${(product.price * orderQuantity).toFixed(2)}
                                    </button>
                                </div>
                            )}

                            {!isBuyer && user && (
                                <p className="text-gray-600 dark:text-gray-300 text-center">
                                    Only buyers can place orders
                                </p>
                            )}

                            {!user && (
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        Please login as a buyer to place an order
                                    </p>
                                    <Link 
                                        to="/login"
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ratings and Reviews Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            Ratings & Reviews
                        </h2>

                        {/* Add Rating Form */}
                        {isBuyer && (
                            <form onSubmit={handleRating} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rating
                                        </label>
                                        <select
                                            value={rating.rating}
                                            onChange={(e) => setRating({...rating, rating: parseInt(e.target.value)})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                        >
                                            {[5, 4, 3, 2, 1].map(num => (
                                                <option key={num} value={num}>
                                                    {num} ⭐
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Comment
                                        </label>
                                        <textarea
                                            value={rating.comment}
                                            onChange={(e) => setRating({...rating, comment: e.target.value})}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                            placeholder="Share your experience with this product..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {product.ratings?.map((review, index) => (
                                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <img 
                                            src={review.user?.profilePicture || '/default-avatar.png'} 
                                            alt={review.user?.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {review.user?.name}
                                            </h4>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                            
                            {(!product.ratings || product.ratings.length === 0) && (
                                <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                                    No reviews yet. Be the first to review this product!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Modal */}
            {showOrderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Place Order
                        </h2>
                        <form onSubmit={handleOrder}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Product
                                    </label>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {product.name} - {orderQuantity} {product.unit}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Total Price
                                    </label>
                                    <p className="text-green-600 font-bold text-lg">
                                        ${(product.price * orderQuantity).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Delivery Address
                                    </label>
                                    <textarea
                                        required
                                        value={orderData.deliveryAddress}
                                        onChange={(e) => setOrderData({...orderData, deliveryAddress: e.target.value})}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter your complete delivery address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={orderData.paymentMethod}
                                        onChange={(e) => setOrderData({...orderData, paymentMethod: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="cash">Cash on Delivery</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowOrderModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;