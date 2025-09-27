// import express
const express = require('express');

// create an express application
const app = express();

// add a test route
app.use('/api/v1/auth',register);

// export the app
module.exports = app;