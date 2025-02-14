const express = require('express');
const ArborMind = require('../services/chatbot');
const { authenticateUser } = require('../middlewares/authMiddleware');
const Message = require('../models/Message');

const router = express.Router();

function setupChatRoutes(io) {
    // 📩 Handle user chat input & store messages
    router.post('/', authenticateUser, async (req, res) => {
        try {
            const { message, room } = req.body;
            const userId = req.user.id;

            if (!message) {
                return res.status(400).json({ message: '❌ Message cannot be empty!' });
            }

            // 📝 Save user messages
            const userMessage = await Message.create({ user: userId, sender: "user", text: message });
            io.to(room).emit("message", userMessage);

            // 🤖 Get chatbot response
            const botResponse = await ArborMind.getResponse(userId, message);
            const botMessage = await Message.create({ user: userId, sender: "bot", text: botResponse });

            io.to(room).emit("message", botMessage);

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

    return router;
}

module.exports = { setupChatRoutes };