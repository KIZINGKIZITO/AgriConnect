import React, { useState } from 'react';
import api from '../lib/api';

const ReviewList = ({ reviews, productId, onReviewUpdate }) => {
    const [sortBy, setSortBy] = useState('helpful');
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    const sortedReviews = [...reviews].sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'rating':
                return b.rating - a.rating;
            case 'helpful':
            default:
                return b.helpfulVotes - a.helpfulVotes;
        }
    });

    const paginatedReviews = sortedReviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const markHelpful = async (reviewId) => {
        try {
            await api.put(`/reviews/${reviewId}/helpful`);
            onReviewUpdate();
        } catch (error) {
            console.error('Failed to mark review as helpful:', error);
        }
    };

    const getRatingStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const reviewDate = new Date(date);
        const diffInHours = Math.floor((now - reviewDate) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return reviewDate.toLocaleDateString();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Customer Reviews
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input-primary w-full md:w-auto"
                    >
                        <option value="helpful">Most Helpful</option>
                        <option value="recent">Most Recent</option>
                        <option value="rating">Highest Rating</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {paginatedReviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                        <div className="flex items-start space-x-4">
                            {/* User Avatar */}
                            <img
                                src={review.buyer?.profilePicture || '/default-avatar.png'}
                                alt={review.buyer?.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            
                            {/* Review Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {review.buyer?.name}
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {getTimeAgo(review.createdAt)}
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-yellow-500">
                                        {getRatingStars(review.rating)}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {review.rating}/5
                                    </span>
                                    {review.isRecommended && (
                                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                                            Recommended
                                        </span>
                                    )}
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    {review.comment}
                                </p>

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                                        {review.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Review ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80"
                                                onClick={() => window.open(image, '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Helpful Button */}
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => markHelpful(review._id)}
                                        className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        <span>Helpful ({review.helpfulVotes})</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-4">💬</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Reviews Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Be the first to review this product!
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewList;