const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Welcome to Job Searching Web App API');
});

// Routes
app.use('/api/v1/auth', authRouter);

module.exports = app;
