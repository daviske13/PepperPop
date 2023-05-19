const User = require('../models/User');

const friendController = {
    addFriend: async (req, res) => {
        const { userId, friendId } = req.params;

        try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { friends: friendId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
            res.json(user);
    } 
    
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while adding friend' });
        }
},

removeFriend: async (req, res) => {
    const { userId, friendId } = req.params;

    try {
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
    } 

    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while removing friend' });
    }
}
