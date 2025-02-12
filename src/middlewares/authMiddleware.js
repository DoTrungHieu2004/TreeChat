require('dotenv').config();
const jwt = require('jsonwebtoken');

// 🔑 Verify JWT token
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: '🚫 Unauthorized! No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(403).json({ message: '❌ Invalid token!' });
    }
};

// 👑 Check user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: '🚫 Access denied!' });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRoles };