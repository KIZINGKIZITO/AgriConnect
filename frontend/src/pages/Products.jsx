import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import EnhancedSearch from '../components/EnhancedSearch';
import api from '../lib/api';

const Products = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Use the basic products endpoint for now
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <EnhancedSearch />
                
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="spinner border-green-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading products...</span>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                All Products
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                {products.length} product{products.length !== 1 ? 's' : ''} available
                            </p>
                        </div>

                        <div className="grid-responsive">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                        
                        {products.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Try adjusting your search filters or check back later for new products
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;