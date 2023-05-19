const express = require('express');
const router = express.Router();
const { User } = require('../models');

// POST to add a new friend to a user's friend list
router.post('/users/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { friends: friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'No user found with the provided ID' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the friend' });
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'No user found with the provided ID' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while removing the friend' });
    }
});

module.exports = router;
