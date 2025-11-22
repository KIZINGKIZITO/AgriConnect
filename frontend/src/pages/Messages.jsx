import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../lib/api';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        fetchConversations();
        fetchUsers();

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && activeConversation) {
            socket.emit('join_conversation', activeConversation._id);
            
            socket.on('receive_message', (message) => {
                if (message.conversationId === activeConversation._id) {
                    setMessages(prev => [...prev, message]);
                }
            });

            return () => {
                socket.off('receive_message');
            };
        }
    }, [socket, activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/messages/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            // This would typically come from an API endpoint
            // For now, we'll simulate it
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await api.get(`/messages/conversations/${conversationId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const selectConversation = (conversation) => {
        setActiveConversation(conversation);
        fetchMessages(conversation._id);
    };

    const startNewConversation = async (userId) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const conversationId = [currentUser._id, userId].sort().join('_');
        
        const conversation = {
            _id: conversationId,
            lastMessage: { content: 'Conversation started' },
            otherUser: users.find(u => u._id === userId)
        };

        setConversations(prev => [conversation, ...prev]);
        selectConversation(conversation);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const currentUser = JSON.parse(localStorage.getItem('user'));
        const otherUserId = activeConversation.otherUser?._id || 
            activeConversation.lastMessage.sender._id === currentUser._id 
                ? activeConversation.lastMessage.receiver._id
                : activeConversation.lastMessage.sender._id;

        const messageData = {
            receiver: otherUserId,
            content: newMessage,
            conversationId: activeConversation._id
        };

        try {
            const response = await api.post('/messages', messageData);
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');

            if (socket) {
                socket.emit('send_message', {
                    ...response.data,
                    conversationId: activeConversation._id
                });
            }

            // Update conversations list
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getOtherUser = (conversation) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (conversation.otherUser) {
            return conversation.otherUser;
        }
        return conversation.lastMessage.sender._id === currentUser._id 
            ? conversation.lastMessage.receiverInfo[0]
            : conversation.lastMessage.senderInfo[0];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex h-[600px]">
                    {/* Conversations Sidebar */}
                    <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
                        </div>
                        
                        {/* New Conversation */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <select 
                                onChange={(e) => startNewConversation(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Start new conversation...</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            {conversations.map(conversation => {
                                const otherUser = getOtherUser(conversation);
                                return (
                                    <div
                                        key={conversation._id}
                                        onClick={() => selectConversation(conversation)}
                                        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                            activeConversation?._id === conversation._id ? 'bg-green-50 dark:bg-green-900' : ''
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <img 
                                                src={otherUser?.profilePicture || '/default-avatar.png'} 
                                                alt={otherUser?.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {otherUser?.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                                    {conversation.lastMessage?.content}
                                                </p>
                                            </div>
                                            {conversation.unreadCount > 0 && (
                                                <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {conversation.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src={getOtherUser(activeConversation)?.profilePicture || '/default-avatar.png'} 
                                            alt={getOtherUser(activeConversation)?.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {getOtherUser(activeConversation)?.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map(message => {
                                        const currentUser = JSON.parse(localStorage.getItem('user'));
                                        const isOwnMessage = message.sender._id === currentUser._id;

                                        return (
                                            <div
                                                key={message._id}
                                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        isOwnMessage
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                    }`}
                                                >
                                                    <p>{message.content}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        isOwnMessage ? 'text-green-100' : 'text-gray-500'
                                                    }`}>
                                                        {new Date(message.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Select a conversation to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;