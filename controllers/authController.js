const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = require('../utils/config');

const register = async (req, res) => {
    try {
        // get the user details from the request body
        const { name, email, password } = req.body;

        // check if the user already exists
        const existingUser = await User.find({ email });

        // if the user already exists, return an error
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user object
        const newUser = new User({ name, email, password: hashedPassword });

        // save the user to the database
        const savedUser = await newUser.save();

        // check if the user was saved successfully
        if (!savedUser) {
            return res.status(500).json({ message: 'Failed to register user' });
        }

        // return a success response
        return res.status(201).json({
            message: 'User registered successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const login = async (req, res) => {
    try {
        // get the email and password from the request body
        const { email, password } = req.body;

        // check if the user exists
        const user = await User.find({ email });

        // if the user does not exist, return an error
        if (user.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        // compare the password with the hashed password
        const isPasswordMatch = await bcrypt.compare(password, user[0].password);

        // if the password does not match, return an error
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // generate a JWT token
        const token = jwt.sign({ userId: user[0]._id }, JWT_SECRET, { expiresIn: '24h' });

        // set the token in the response header for httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production', // set secure flag in production
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // return a success response
        return res.status(200).json({
            message: 'User logged in successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getMe = async (req, res) => {
    try {
        // get the userId from the request object
        const userId = req.userId;

        // get the user details from the database
        const user = await User.findById(userId).select('-password');

        // if the user does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // return the user details
        return res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return res.status(200).json({
            message: 'User logged out successfully'
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    register,
    login,
    getMe,
    logout
}