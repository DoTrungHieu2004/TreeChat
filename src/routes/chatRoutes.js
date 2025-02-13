const express = require('express');
const ArborMind = require('../services/chatbot');
const { authenticateUser } = require('../middlewares/authMiddleware');
const Message = require('../models/Message');

const router = express.Router();

// 📩 Handle user chat input & store messages
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ message: '❌ Message cannot be empty!' });
        }

        // 📝 Save user messages
        await Message.create({ user: userId, sender: "user", text: message });

        // 🤖 Get chatbot response
        const botResponse = await ArborMind.getResponse(userId, message);

        // 📝 Save bot response
        await Message.create({ user: userId, sender: "bot", text: botResponse });

        res.json({ response: botResponse });
    } catch (error) {
        console.error('🔥 Chatbot error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 📜 Fetch chat history
router.get('/history', authenticateUser, async (req, res) => {
    try {
        const messages = await Message.find({ user: req.user.id }).sort("timestamp");
        res.json(messages);
    } catch (error) {
        console.error('🔥 History fetch error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;