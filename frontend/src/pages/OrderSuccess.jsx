import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <div className="text-green-500 text-6xl mb-4">✅</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Order Successful!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Thank you for your order. Your order has been confirmed and will be processed soon.
                        </p>
                        
                        <div className="space-y-4">
                            <Link to="/orders" className="btn-primary w-full">
                                View My Orders
                            </Link>
                            <Link to="/products" className="btn-outline w-full">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;