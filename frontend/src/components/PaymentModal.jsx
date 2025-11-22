import React from 'react';
import PaymentForm from './PaymentForm';

const PaymentModal = ({ isOpen, onClose, order, onPaymentSuccess }) => {
    if (!isOpen) return null;

    const handleSuccess = () => {
        onPaymentSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Complete Payment
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <PaymentForm
                        order={order}
                        onSuccess={handleSuccess}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;