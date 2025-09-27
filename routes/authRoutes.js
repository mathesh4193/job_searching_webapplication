const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/getMe', isAuthenticated, getMe);
authRouter.post('/logout', isAuthenticated, logout);

authRouter.post('/upload/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // file exists, so, we need to update the user profile
        const user = await User.findByIdAndUpdate(req.userId, { profilePicture: req.file.path }, { new: true }).select('-password');

        res.status(200).json({ success: true, message: 'Profile picture uploaded successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

authRouter.post('/upload/resume', isAuthenticated, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // file exists, so, we need to update the user profile
        const user = await User.findByIdAndUpdate(req.userId, { resume: req.file.path }, { new: true }).select('-password');

        res.status(200).json({ success: true, message: 'Resume uploaded successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

module.exports = authRouter;