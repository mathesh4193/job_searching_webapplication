const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/config');
const app = require('./app');

// connect to MongoDB
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        // run the server
        app
            .listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            })
            .on('error', (err) => {
                console.error('Error starting server:', err.message);
            });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });