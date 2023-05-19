// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create an Express app
const app = express();

// Set up JSON parsing for request bodies
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost/social-network', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// Define Reaction schema
const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp).toISOString()
        }
    },
    {
        id: false
    }
);

// Define Thought model
const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp).toISOString()
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: { virtuals: true },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Define User model
const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

UserSchema.pre('remove', async function (next) {
    try {
        await Thought.deleteMany({ username: this.username });
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

const User = mongoose.model('User', UserSchema);

// API Routes

// Users routes

// GET all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
            .populate('thoughts')
            .populate('friends');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving users' });
    }
});

// GET a single user by its _id and populated thought and friend data
app.get('/api/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('thoughts')
            .populate('friends');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving the user' });
    }
});

