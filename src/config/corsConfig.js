const cors = require('cors');

// 🛡️ Allowed origins
const allowedOrigins = ["http://localhost:3000", "https://treechat.com"];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("🚫 CORS Policy: Not allowed byy CORS!"));
        }
    },
    credentials: true, // Allow cookies & authentication headers
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);