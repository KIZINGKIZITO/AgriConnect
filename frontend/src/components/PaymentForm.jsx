import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ order, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (order) {
            createPaymentIntent();
        }
    }, [order]);

    const createPaymentIntent = async () => {
        try {
            const response = await api.post('/payments/create-intent', {
                orderId: order._id
            });
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            setError('Failed to initialize payment');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setLoading(false);
            return;
        }

        const { error: confirmationError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders/success`,
            },
            redirect: 'if_required',
        });

        if (confirmationError) {
            setError(confirmationError.message);
        } else {
            onSuccess();
        }

        setLoading(false);
    };

    if (!clientSecret) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="spinner border-green-600"></div>
                <span className="ml-3 text-gray-600">Initializing payment...</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Product:</span>
                        <span className="font-medium">{order.product?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{order.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="text-green-600 font-bold">${order.totalPrice}</span>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <PaymentElement />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="spinner border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        `Pay $${order.totalPrice}`
                    )}
                </button>
            </div>
        </form>
    );
};

const PaymentForm = ({ order, onSuccess, onCancel }) => {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (order) {
            createPaymentIntent();
        }
    }, [order]);

    const createPaymentIntent = async () => {
        try {
            const response = await api.post('/payments/create-intent', {
                orderId: order._id
            });
            setClientSecret(response.data.clientSecret);
        } catch (error) {
            console.error('Failed to create payment intent:', error);
        }
    };

    if (!clientSecret) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="spinner border-green-600"></div>
                <span className="ml-3 text-gray-600">Loading payment form...</span>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
                order={order} 
                onSuccess={onSuccess} 
                onCancel={onCancel} 
            />
        </Elements>
    );
};

export default PaymentForm;