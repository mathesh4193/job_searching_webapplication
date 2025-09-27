const User = require('../models/user');
const bcrypt = require('bcryptjs'); // bcryptjs works on all systems
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.status(200).json({
            message: 'User logged in successfully',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { register, login };
