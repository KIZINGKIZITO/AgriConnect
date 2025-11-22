import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img 
                src={product.images?.[0] || '/default-product.jpg'} 
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description.substring(0, 100)}...</p>
                
                <div className="flex justify-between items-center mb-3">
                    <span className="text-green-600 font-bold">${product.price}/{product.unit}</span>
                    <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                </div>

                <div className="flex justify-between items-center">
                    <Link 
                        to={`/product/${product._id}`}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                        View Details
                    </Link>
                    <Link 
                        to={`/farmer/${product.farmer._id}`}
                        className="text-orange-600 text-sm hover:text-orange-700"
                    >
                        View Farmer
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;