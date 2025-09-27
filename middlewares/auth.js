const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const isAuthenticated = async (req, res, next) => {
    // check if the token is present in the cookies
    const token = req.cookies && req.cookies.token;

    // If there is no token, return an unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // if the token is present, verify it
        const decoded = await jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;

        // call the next middleware
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    isAuthenticated
}