import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const getQualityColor = (quality) => {
        switch (quality) {
            case 'premium':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'economy':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            default:
                return 'bg-agri-100 text-agri-800 dark:bg-agri-900 dark:text-agri-200';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'vegetables':
                return '🥦';
            case 'fruits':
                return '🍎';
            case 'cereals':
                return '🌾';
            case 'livestock':
                return '🥩';
            case 'crops':
                return '🌽';
            default:
                return '🌱';
        }
    };

    return (
        <div className="product-card group">
            <div className="relative overflow-hidden">
                <img 
                    src={product.images?.[0] || '/default-product.jpg'} 
                    alt={product.name}
                    className="product-card-image"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(product.quality)}`}>
                        {product.quality}
                    </span>
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                        {getCategoryIcon(product.category)} {product.category}
                    </span>
                </div>
                {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>
            
            <div className="product-card-content">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-agri-600 dark:group-hover:text-agri-400 transition-colors">
                        {product.name}
                    </h3>
                    <span className="text-agri-600 dark:text-agri-400 font-bold text-lg">
                        ${product.price}
                    </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {product.quantity} {product.unit} available
                    </span>
                    {product.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {product.averageRating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 mb-3">
                    <img 
                        src={product.farmer?.profilePicture || '/default-avatar.png'} 
                        alt={product.farmer?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {product.farmer?.farmName || product.farmer?.name}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <Link 
                        to={`/product/${product._id}`}
                        className="btn-primary text-sm px-4 py-2"
                    >
                        View Details
                    </Link>
                    <Link 
                        to={`/farmer/${product.farmer?._id}`}
                        className="text-sunset-600 hover:text-sunset-700 text-sm font-medium flex items-center space-x-1"
                    >
                        <span>👨‍🌾</span>
                        <span>View Farmer</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;