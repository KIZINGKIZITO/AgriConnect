import React, { useState } from 'react';
import api from '../lib/api';
import ImageUpload from './ImageUpload';

const VerificationForm = ({ onVerificationSubmit }) => {
    const [formData, setFormData] = useState({
        documentType: '',
        documents: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const documentTypes = [
        { value: 'id_card', label: 'National ID Card', description: 'Government-issued identification card' },
        { value: 'business_license', label: 'Business License', description: 'Official business registration document' },
        { value: 'farm_certificate', label: 'Farm Certificate', description: 'Agricultural business certification' },
        { value: 'tax_document', label: 'Tax Document', description: 'Recent tax filing or registration' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.documentType) {
            setError('Please select a document type');
            return;
        }

        if (formData.documents.length === 0) {
            setError('Please upload at least one document');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('documentType', formData.documentType);
            
            formData.documents.forEach((doc, index) => {
                if (doc.file) {
                    submitData.append('documents', doc.file);
                }
            });

            await api.post('/users/verification', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onVerificationSubmit();
            setFormData({ documentType: '', documents: [] });
            
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit verification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Farmer Verification
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Get verified to build trust with buyers and increase your sales potential.
                </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Verification Benefits
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Verified badge on your profile and products</li>
                                <li>Higher trust and credibility with buyers</li>
                                <li>Increased product visibility in search results</li>
                                <li>Priority support from AgriConnect team</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Document Type Selection */}
                <div>
                    <label className="form-label">Document Type *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentTypes.map((docType) => (
                            <div
                                key={docType.value}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                    formData.documentType === docType.value
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                                }`}
                                onClick={() => setFormData(prev => ({ ...prev, documentType: docType.value }))}
                            >
                                <div className="flex items-start">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 ${
                                        formData.documentType === docType.value
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-400'
                                    }`}>
                                        {formData.documentType === docType.value && (
                                            <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {docType.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                            {docType.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Document Upload */}
                <div>
                    <label className="form-label">
                        Upload Documents *
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (2-3 documents recommended for faster verification)
                        </span>
                    </label>
                    <ImageUpload
                        onImagesChange={(documents) => setFormData(prev => ({ ...prev, documents }))}
                        multiple={true}
                        maxFiles={3}
                        type="verification"
                    />
                </div>

                {/* Requirements */}
                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        📋 Document Requirements
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>• Documents must be clear and readable</li>
                        <li>• File size should not exceed 5MB per document</li>
                        <li>• Accepted formats: JPG, PNG, PDF</li>
                        <li>• Ensure all information is visible and not cropped</li>
                        <li>• Verification typically takes 2-3 business days</li>
                    </ul>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !formData.documentType || formData.documents.length === 0}
                        className="btn-primary px-8"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="spinner border-white mr-2"></div>
                                Submitting...
                            </div>
                        ) : (
                            'Submit for Verification'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerificationForm;