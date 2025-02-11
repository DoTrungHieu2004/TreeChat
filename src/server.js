require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// 🛡️ Security & performance middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

// 🏠 Base route
app.get('/', (req, res) => {
    res.send('🌲 Welcome to TreeChat API 🌲');
});

// 🚀 Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} 🚀`);
});