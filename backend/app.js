const express = require("express");
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
    console.error('PORT environment variable is not defined');
    process.exit(1); // Exit the process with an error code
}

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = ['https://expensetrackerfullstack-ol1o.vercel.app'];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Absolute path to the routes directory
const routesPath = path.resolve(__dirname, 'routes');

// Debugging the path
console.log(`Routes directory path: ${routesPath}`);

// Check if the directory exists
const fs = require('fs');
if (!fs.existsSync(routesPath)) {
    console.error('Routes directory does not exist');
    process.exit(1);
}

// Routes
readdirSync(routesPath).forEach(route => {
    app.use('/api/v1', require(path.join(routesPath, route)));
});

// Test route
app.get('/', (req, res) => {
    res.send("Hello world");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app; // Export the Express app

// Start the server (remove this block from here)
// const startServer = async () => {
//     try {
//         await db(); // Ensure the database connection is established before starting the server
//         app.listen(PORT, () => {
//             console.log('Listening to port:', PORT);
//         });
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1); // Exit the process with an error code
//     }
// };

// startServer(); // Remove this line
