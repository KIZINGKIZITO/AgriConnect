import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({});
    const [recentProducts, setRecentProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);

            // Fetch products
            const productsResponse = await api.get('/products');
            setRecentProducts(productsResponse.data.slice(0, 5));

            // Fetch orders if user is farmer or buyer
            const ordersResponse = await api.get('/orders');
            setRecentOrders(ordersResponse.data.slice(0, 5));

            // Calculate stats
            if (userData.role === 'farmer') {
                const myProducts = productsResponse.data.filter(p => p.farmer._id === userData._id);
                const myOrders = ordersResponse.data;
                
                setStats({
                    totalProducts: myProducts.length,
                    totalOrders: myOrders.length,
                    pendingOrders: myOrders.filter(o => o.status === 'pending').length,
                    availableStock: myProducts.reduce((sum, p) => sum + p.quantity, 0)
                });
            } else {
                setStats({
                    totalOrders: ordersResponse.data.length,
                    pendingOrders: ordersResponse.data.filter(o => o.status === 'pending').length,
                    completedOrders: ordersResponse.data.filter(o => o.status === 'delivered').length
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Welcome back, {user?.name}!
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {user?.role === 'farmer' ? (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Products</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.totalProducts || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Orders</h3>
                                <p className="text-3xl font-bold text-orange-600">{stats.totalOrders || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Pending Orders</h3>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Available Stock</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.availableStock || 0}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Orders</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.totalOrders || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Pending Orders</h3>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Completed Orders</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.completedOrders || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <Link to="/" className="block text-center text-green-600 hover:text-green-700">
                                    <h3 className="text-lg font-semibold">Browse Products</h3>
                                    <p className="text-sm mt-2">Shop fresh farm produce</p>
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Products */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Recent Products
                            </h2>
                        </div>
                        <div className="p-6">
                            {recentProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {recentProducts.map(product => (
                                        <div key={product._id} className="flex items-center space-x-4">
                                            <img 
                                                src={product.images?.[0] || '/default-product.jpg'} 
                                                alt={product.name}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    ${product.price}/{product.unit}
                                                </p>
                                            </div>
                                            <Link 
                                                to={`/product/${product._id}`}
                                                className="text-green-600 hover:text-green-700 text-sm"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">No products found</p>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Recent Orders
                            </h2>
                        </div>
                        <div className="p-6">
                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map(order => (
                                        <div key={order._id} className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {order.product?.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Qty: {order.quantity} • ${order.totalPrice}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-300">No orders found</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {user?.role === 'farmer' ? (
                            <>
                                <Link 
                                    to="/profile?tab=products"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Add New Product
                                </Link>
                                <Link 
                                    to="/orders"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                                >
                                    View All Orders
                                </Link>
                                <Link 
                                    to="/profile?tab=verification"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Get Verified
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Browse Products
                                </Link>
                                <Link 
                                    to="/messages"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                                >
                                    Messages
                                </Link>
                                <Link 
                                    to="/profile"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Update Profile
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;