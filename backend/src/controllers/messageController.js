const Message = require('../models/Message');
const Notification = require('../models/Notification');

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        const messages = await Message.find({ conversationId })
            .populate('sender', 'name profilePicture')
            .populate('receiver', 'name profilePicture')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { receiver, content, conversationId } = req.body;

        const message = new Message({
            sender: req.user._id,
            receiver,
            content,
            conversationId
        });

        const savedMessage = await message.save();
        await savedMessage.populate('sender', 'name profilePicture');

        // Create notification for receiver
        await Notification.create({
            user: receiver,
            type: 'message',
            title: 'New Message',
            message: `You have a new message from ${req.user.name}`,
            relatedId: conversationId
        });

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { receiver: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$conversationId",
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ["$receiver", req.user._id] },
                                    { $eq: ["$read", false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'lastMessage.sender',
                    foreignField: '_id',
                    as: 'senderInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'lastMessage.receiver',
                    foreignField: '_id',
                    as: 'receiverInfo'
                }
            }
        ]);

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    getConversations
};