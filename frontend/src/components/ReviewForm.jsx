import React from 'react';

const OrderTracking = ({ order }) => {
    const statusSteps = [
        { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
        { key: 'confirmed', label: 'Confirmed', description: 'Farmer has confirmed your order' },
        { key: 'preparing', label: 'Preparing', description: 'Farmer is preparing your order' },
        { key: 'shipped', label: 'Shipped', description: 'Order is on its way to you' },
        { key: 'delivered', label: 'Delivered', description: 'Order successfully delivered' }
    ];

    const cancelledStep = { key: 'cancelled', label: 'Cancelled', description: 'Order was cancelled' };

    const getCurrentStepIndex = () => {
        if (order.status === 'cancelled') return -1;
        return statusSteps.findIndex(step => step.key === order.status);
    };

    const currentStepIndex = getCurrentStepIndex();
    const isCancelled = order.status === 'cancelled';

    const getStatusColor = (stepIndex, currentIndex) => {
        if (isCancelled) return 'gray';
        if (stepIndex < currentIndex) return 'green';
        if (stepIndex === currentIndex) return 'blue';
        return 'gray';
    };

    const getTimelineEvent = (event, index) => {
        const eventConfig = {
            pending: { icon: '📦', color: 'blue' },
            confirmed: { icon: '✅', color: 'green' },
            preparing: { icon: '👨‍🌾', color: 'orange' },
            shipped: { icon: '🚚', color: 'purple' },
            delivered: { icon: '🏠', color: 'green' },
            cancelled: { icon: '❌', color: 'red' }
        };

        const config = eventConfig[event.status] || { icon: '●', color: 'gray' };

        return (
            <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-${config.color}-500`}>
                    {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.timestamp).toLocaleString()}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Order Tracking
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Order # {order._id}
                </p>
            </div>

            {/* Progress Bar */}
            {!isCancelled && (
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {statusSteps.map((step, index) => (
                            <div
                                key={step.key}
                                className={`text-xs font-medium ${
                                    index <= currentStepIndex
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {step.label}
                            </div>
                        ))}
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Current Status */}
            <div className={`rounded-lg p-4 mb-6 ${
                isCancelled 
                    ? 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800'
            }`}>
                <div className="flex items-center">
                    <span className="text-2xl mr-3">
                        {isCancelled ? '❌' : currentStepIndex >= 0 ? statusSteps[currentStepIndex].icon : '📦'}
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {isCancelled ? cancelledStep.label : statusSteps[currentStepIndex].label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {isCancelled ? cancelledStep.description : statusSteps[currentStepIndex].description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delivery Information</h4>
                    <div className="space-y-1 text-sm">
                        <p><strong>Address:</strong> {order.deliveryAddress}</p>
                        {order.trackingNumber && (
                            <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                        )}
                        {order.estimatedDelivery && (
                            <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Information</h4>
                    <div className="space-y-1 text-sm">
                        <p><strong>Status:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                order.paymentStatus === 'paid' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                                {order.paymentStatus}
                            </span>
                        </p>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        {order.paidAt && (
                            <p><strong>Paid:</strong> {new Date(order.paidAt).toLocaleDateString()}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Timeline */}
            <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Order Timeline</h4>
                <div className="space-y-4">
                    {order.orderTimeline && order.orderTimeline.length > 0 ? (
                        order.orderTimeline.map((event, index) => getTimelineEvent(event, index))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No timeline events yet.</p>
                    )}
                </div>
            </div>

            {/* Contact Farmer */}
            {!isCancelled && order.farmer && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-green-800 dark:text-green-200">
                                Need help with your order?
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Contact the farmer directly for any questions.
                            </p>
                        </div>
                        <button className="btn-outline border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                            Message Farmer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;