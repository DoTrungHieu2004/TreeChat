const express = require('express');
const ArborMind = require('../services/chatbot');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// 📩 Handle user chat input
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ message: '❌ Message cannot be empty!' });
        }

        const botResponse = await ArborMind.getResponse(userId, message);
        res.json({ response: botResponse });
    } catch (error) {
        console.error('🔥 Chatbot error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;