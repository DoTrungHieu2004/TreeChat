require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const corsConfig = require('./config/corsConfig');
const { globalLimiter } = require('./middlewares/rateLimiter');
const logger = require('./config/logger');
const sessionMiddleware = require('./config/sessionConfig');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { setupChatRoutes } = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

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
app.use('/api/chat', setupChatRoutes(io));

// 🌐 Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("🔌 User connected: ", socket.id);

    // 📡 Join a room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`🏠 User ${socket.id} joined room: ${room}`);
        io.to(room).emit("message", {
            sender: "system",
            text: `📢 A user joined ${room}`
        });
    });

    // ✍️ Typing indicator
    socket.on("typing", (data) => {
        socket.to(data.room).emit("userTyping", data.username);
    });

    socket.on("stopTyping", (room) => {
        socket.to(room).emit("userStoppedTyping");
    });

    // ❌ Handle disconnection
    socket.on("disconnect", () => {
        console.log("❌ User disconnected: ", socket.id);
    });
});

// 🚀 Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger.info(`✅ Server running on port ${PORT} 🚀`);
});