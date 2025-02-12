require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const connectDB = require('./config/db');
const corsConfig = require('./config/corsConfig');
const { globalLimiter } = require('./middlewares/rateLimiter');
const logger = require('./config/logger');
const sessionMiddleware = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// 🔗 Connect to MongoDB
connectDB();

// 🛡️ Security & performance middlewares
app.use(helmet());
app.use(corsConfig);
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(globalLimiter);
app.use(sessionMiddleware);

// 🏠 Base route
app.get('/', (req, res) => {
    res.send('🌲 Welcome to TreeChat API 🌲');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// 🚀 Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`✅ Server running on port ${PORT} 🚀`);
});