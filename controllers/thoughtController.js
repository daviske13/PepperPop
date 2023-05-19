const User = require('../models/User');
const Thought = require('../models/Thought');

const thoughtController = {
    getAllThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching thoughts' });
    }
},

    getThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } 

        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching thought' });
        }
    },

    createThought: async (req, res) => {
        const { thoughtText, username, userId } = req.body;
            try {
                const thought = await Thought.create({ thoughtText, username });

                const user = await User.findByIdAndUpdate(
                userId,
                { $push: { thoughts: thought._id } },
                { new: true }
                );

                res.status(201).json(thought);
            } 
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred while creating thought' });
            }
    },

    updateThought: async (req, res) => {
        const { thoughtId } = req.params;
        const { thoughtText } = req.body;
        try {
            const thought = await Thought.findByIdAndUpdate(thoughtId, { thoughtText }, { new: true });
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
            res.json(thought);
        } 

        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while updating thought' });
        }
    },

    deleteThought: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const thought = await Thought.findByIdAndDelete(thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        await User.findByIdAndUpdate(thought.username, { $pull: { thoughts: thoughtId } });
            res.json({ message: 'Thought deleted successfully' });
        }

        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while deleting thought' });
        }
    },

    addReaction: async (req, res) => {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: { reactionBody, username } } },
                { new: true }
            );

        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        res.json(updatedThought);
        } 
    
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while adding reaction' });
        }
    },

removeReaction: async (req, res) => {
    const { thoughtId, reactionId } = req.params;
    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId,
            { $pull: { reactions: { _id: reactionId } } },
            { new: true }
        );
        if (!updatedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(updatedThought);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while removing reaction' });
    }
}

