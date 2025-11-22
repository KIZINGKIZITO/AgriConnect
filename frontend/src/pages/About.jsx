import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            About AgriConnect
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Connecting Farmers Directly with Buyers
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Our Mission
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            AgriConnect is dedicated to revolutionizing agricultural trade in Africa by creating 
                            a direct connection between farmers and buyers. We eliminate middlemen, ensure fair 
                            prices for farmers, and provide buyers with access to fresh, quality farm produce 
                            directly from the source.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                For Farmers
                            </h3>
                            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                                <li>• Direct market access</li>
                                <li>• Fair pricing</li>
                                <li>• Business growth opportunities</li>
                                <li>• Digital presence</li>
                                <li>• Customer reviews and ratings</li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🛒</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                For Buyers
                            </h3>
                            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                                <li>• Fresh farm produce</li>
                                <li>• Direct from farmers</li>
                                <li>• Competitive prices</li>
                                <li>• Quality assurance</li>
                                <li>• Easy ordering process</li>
                            </ul>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                            How AgriConnect Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create Profile</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Farmers and buyers create detailed profiles with their specializations
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    2
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Connect & Trade</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Browse products, communicate directly, and place orders
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Grow Together</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Build lasting business relationships with reviews and ratings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="bg-green-600 text-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-6">Our Impact</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-3xl font-bold mb-2">500+</div>
                                <div className="text-green-100">Farmers Connected</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-2">1,200+</div>
                                <div className="text-green-100">Active Buyers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-2">2,500+</div>
                                <div className="text-green-100">Products Listed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-2">800+</div>
                                <div className="text-green-100">Successful Orders</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;