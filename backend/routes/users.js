const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');

router.get('/', authenticate, authorize(['admin', 'manager']), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;