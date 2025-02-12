require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// 📝 Register user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: '❌ All fields required!' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: '🚫 User already exists!' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: '✅ Registered successfully!' });
    } catch (error) {
        console.error('🔥 Registration error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔑 Login user
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: '❌ Invalid credentials!' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: '✅ Login successful!', token });
    } catch (error) {
        console.error('🔥 Login error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🔃 Forgot password (dummy route)
router.post('/forgot-password', (req, res) => {
    res.json({ message: '📨 Password reset link sent (mock)' });
});

module.exports = router;