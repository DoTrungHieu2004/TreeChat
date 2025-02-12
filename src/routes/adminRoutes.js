const express = require('express');
const User = require('../models/User');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// 📜 Get all users (admin only)
router.get('/users', authenticateUser, authorizeRoles("admin"), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('🔥 Admin fetch error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ⚠️ Delete user (admin or moderator)
router.delete('/user/:id', authenticateUser, authorizeRoles("admin", "moderator"), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: '✅ User deleted successfully!' });
    } catch (error) {
        console.error('🔥 Delete user error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;