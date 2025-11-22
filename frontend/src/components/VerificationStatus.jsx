import React from 'react';

const VerificationStatus = ({ verification }) => {
    if (!verification) {
        return (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Not Verified
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Complete verification to build trust with buyers.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const statusConfig = {
        pending: {
            color: 'yellow',
            icon: '⏳',
            title: 'Verification Pending',
            message: 'Your verification request is under review. This usually takes 2-3 business days.'
        },
        approved: {
            color: 'green',
            icon: '✅',
            title: 'Verified Farmer',
            message: 'Your account has been successfully verified. Buyers can now see your verified status.'
        },
        rejected: {
            color: 'red',
            icon: '❌',
            title: 'Verification Rejected',
            message: verification.reviewNotes || 'Please check the requirements and submit again.'
        }
    };

    const config = statusConfig[verification.status];
    const colorClasses = {
        yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
        green: 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800 text-green-800 dark:text-green-200',
        red: 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800 text-red-800 dark:text-red-200'
    };

    return (
        <div className={`border rounded-lg p-4 ${colorClasses[config.color]}`}>
            <div className="flex items-start">
                <span className="text-2xl mr-3">{config.icon}</span>
                <div className="flex-1">
                    <h3 className="font-medium">{config.title}</h3>
                    <p className="text-sm mt-1">{config.message}</p>
                    
                    {verification.status === 'rejected' && verification.reviewNotes && (
                        <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border text-sm">
                            <strong>Review Notes:</strong> {verification.reviewNotes}
                        </div>
                    )}

                    <div className="mt-3 text-xs opacity-75">
                        Submitted: {new Date(verification.createdAt).toLocaleDateString()}
                        {verification.reviewedAt && (
                            <span className="ml-4">
                                Reviewed: {new Date(verification.reviewedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationStatus;