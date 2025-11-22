import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center py-12">
                        <div className="spinner border-green-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading orders...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            My Orders
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Manage and track your orders
                        </p>
                    </div>

                    <div className="p-6">
                        {orders.length > 0 ? (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <img 
                                                        src={order.product?.images?.[0] || '/default-product.jpg'} 
                                                        alt={order.product?.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                            {order.product?.name}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300">
                                                            Quantity: {order.quantity} • Total: ${order.totalPrice}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        order.paymentStatus === 'paid' 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    }`}>
                                                        Payment: {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex space-x-3 mt-4 md:mt-0">
                                                <Link 
                                                    to={`/product/${order.product?._id}`}
                                                    className="btn-outline text-sm"
                                                >
                                                    View Product
                                                </Link>
                                                <button className="btn-primary text-sm">
                                                    Track Order
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {order.deliveryAddress && (
                                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    <strong>Delivery to:</strong> {order.deliveryAddress}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No orders yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Start shopping to see your orders here
                                </p>
                                <Link to="/products" className="btn-primary">
                                    Browse Products
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;