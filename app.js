// import express
const express = require('express');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const errorRoute = require('./utils/errorRoute');

// create an express application
const app = express();

// enable serving static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// middleware to parse JSON request bodies
app.use(express.json());

// middleware to parse cookies
app.use(cookieParser());

// add the logger middleware
app.use(logger);

// define the routes -- routers
app.use('/api/v1/auth', authRouter);

// handle undefined routes
app.use(errorRoute);

// export the app
module.exports = app;