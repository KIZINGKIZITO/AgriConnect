import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';

const Profile = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [productForm, setProductForm] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        unit: '',
        description: '',
        quality: 'standard',
        images: []
    });

    useEffect(() => {
        fetchUserData();
        if (activeTab === 'products') {
            fetchUserProducts();
        } else if (activeTab === 'notifications') {
            fetchNotifications();
        }
    }, [activeTab]);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/users/profile');
            setUser(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProducts = async () => {
        try {
            const response = await api.get('/products');
            const userProducts = response.data.filter(p => p.farmer._id === user?._id);
            setProducts(userProducts);
        } catch (error) {
            console.error('Error fetching user products:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/users/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', formData);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile');
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', productForm);
            setProductForm({
                name: '',
                category: '',
                price: '',
                quantity: '',
                unit: '',
                description: '',
                quality: 'standard',
                images: []
            });
            fetchUserProducts();
            alert('Product added successfully!');
        } catch (error) {
            alert('Error adding product');
        }
    };

    const deleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${productId}`);
                fetchUserProducts();
                alert('Product deleted successfully!');
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await api.put(`/users/notifications/${notificationId}/read`);
            setNotifications(notifications.map(n => 
                n._id === notificationId ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    {/* Profile Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={user?.profilePicture || '/default-avatar.png'} 
                                alt={user?.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.name}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 capitalize">
                                    {user?.role} • {user?.specialization}
                                </p>
                                {user?.farmName && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {user.farmName} • {user.location}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {['profile', 'products', 'notifications', 'verification'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                        activeTab === tab
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 dark:text-gray-300"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber || ''}
                                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Specialization
                                        </label>
                                        <select
                                            value={formData.specialization || ''}
                                            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Select specialization</option>
                                            <option value="cereals">Cereals</option>
                                            <option value="vegetables">Vegetables</option>
                                            <option value="fruits">Fruits</option>
                                            <option value="livestock">Livestock Products</option>
                                            <option value="crops">Mixed Crops</option>
                                        </select>
                                    </div>
                                    {user?.role === 'farmer' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Farm Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.farmName || ''}
                                                    onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.location || ''}
                                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio || ''}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        rows="4"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Update Profile
                                </button>
                            </form>
                        )}

                        {activeTab === 'products' && user?.role === 'farmer' && (
                            <div className="space-y-8">
                                {/* Add Product Form */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
                                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Product Name"
                                            value={productForm.name}
                                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                        <select
                                            value={productForm.category}
                                            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="crops">Crops</option>
                                            <option value="livestock">Livestock</option>
                                            <option value="vegetables">Vegetables</option>
                                            <option value="fruits">Fruits</option>
                                            <option value="cereals">Cereals</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            value={productForm.quantity}
                                            onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Unit (kg, lb, piece, etc.)"
                                            value={productForm.unit}
                                            onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                            required
                                        />
                                        <select
                                            value={productForm.quality}
                                            onChange={(e) => setProductForm({...productForm, quality: e.target.value})}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                        >
                                            <option value="standard">Standard</option>
                                            <option value="premium">Premium</option>
                                            <option value="economy">Economy</option>
                                        </select>
                                        <div className="md:col-span-2">
                                            <textarea
                                                placeholder="Product Description"
                                                value={productForm.description}
                                                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                            >
                                                Add Product
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Products List */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">My Products</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map(product => (
                                            <div key={product._id} className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                                                <img 
                                                    src={product.images?.[0] || '/default-product.jpg'} 
                                                    alt={product.name}
                                                    className="w-full h-32 object-cover rounded mb-3"
                                                />
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {product.name}
                                                </h4>
                                                <p className="text-green-600 font-bold">
                                                    ${product.price}/{product.unit}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    Qty: {product.quantity} • {product.quality}
                                                </p>
                                                <div className="mt-3 flex space-x-2">
                                                    <button
                                                        onClick={() => deleteProduct(product._id)}
                                                        className="text-red-600 hover:text-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-4">
                                {notifications.map(notification => (
                                    <div 
                                        key={notification._id}
                                        className={`p-4 rounded-lg border ${
                                            notification.isRead 
                                                ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                                : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    {notification.message}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markNotificationAsRead(notification._id)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {notifications.length === 0 && (
                                    <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                                        No notifications yet
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === 'verification' && user?.role === 'farmer' && (
                            <div className="max-w-2xl">
                                <h3 className="text-lg font-semibold mb-4">Farmer Verification</h3>
                                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                                    <p className="text-yellow-800 dark:text-yellow-200">
                                        Get verified to build trust with buyers. Submit your farm documentation for review.
                                    </p>
                                </div>
                                
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Document Type
                                        </label>
                                        <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white">
                                            <option value="">Select document type</option>
                                            <option value="id_card">National ID Card</option>
                                            <option value="business_license">Business License</option>
                                            <option value="farm_certificate">Farm Certificate</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Upload Documents
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <div className="flex text-sm text-gray-600 dark:text-gray-300">
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                                                        <span>Upload files</span>
                                                        <input type="file" className="sr-only" multiple />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PNG, JPG, PDF up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Submit for Verification
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;