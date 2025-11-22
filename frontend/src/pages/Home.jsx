import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AdvancedSearch from '../components/AdvancedSearch';
import api from '../lib/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredCategories] = useState([
    { name: 'Fresh Vegetables', icon: '🥦', count: '150+', color: 'bg-agri-100 text-agri-800' },
    { name: 'Organic Fruits', icon: '🍎', count: '120+', color: 'bg-sunset-100 text-sunset-800' },
    { name: 'Quality Cereals', icon: '🌾', count: '80+', color: 'bg-earth-100 text-earth-800' },
    { name: 'Livestock Products', icon: '🥩', count: '60+', color: 'bg-sky-100 text-sky-800' },
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.slice(0, 8)); // Show only 8 products on home page
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen agriculture-gradient">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-agri-600 to-agri-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Connect Directly with{' '}
              <span className="text-earth-300">African Farmers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-agri-100 leading-relaxed">
              Fresh farm produce straight from the source. No middlemen, better prices, quality guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Start Trading Now
              </Link>
              <Link 
                to="/about" 
                className="btn-outline border-white text-white hover:bg-white hover:text-agri-600 text-lg px-8 py-4 font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <AdvancedSearch />
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover fresh produce across various agricultural categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => (
              <div 
                key={index}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{category.count} Products</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Fresh from the Farm
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Handpicked quality produce from verified farmers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="spinner border-agri-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading fresh products...</span>
            </div>
          ) : (
            <>
              <div className="grid-responsive">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {products.length > 0 && (
                <div className="text-center mt-12">
                  <Link 
                    to="/products" 
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-agri-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="fade-in">
              <div className="stat-number text-white">500+</div>
              <div className="stat-label text-agri-100">Farmers Connected</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="stat-number text-white">1,200+</div>
              <div className="stat-label text-agri-100">Active Buyers</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="stat-number text-white">2,500+</div>
              <div className="stat-label text-agri-100">Products Listed</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="stat-number text-white">800+</div>
              <div className="stat-label text-agri-100">Successful Orders</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-sunset-500 to-sunset-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Transform Agricultural Trade?
            </h2>
            <p className="text-xl mb-8 text-sunset-100 max-w-2xl mx-auto">
              Join thousands of farmers and buyers who are already benefiting from direct connections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register?role=farmer" 
                className="bg-white text-sunset-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
              >
                I'm a Farmer
              </Link>
              <Link 
                to="/register?role=buyer" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-sunset-600 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
              >
                I'm a Buyer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;