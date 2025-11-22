import React from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Checkout
                        </h1>
                        
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Checkout Feature
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                This feature will be implemented with payment integration.
                            </p>
                            <button
                                onClick={() => navigate('/products')}
                                className="btn-primary"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;