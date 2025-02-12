const express = require('express');
const User = require('../models/User');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// 👤 Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: '❌ User not found!' });
        }
        res.json(user);
    } catch (error) {
        console.error('🔥 Profile fetch error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;