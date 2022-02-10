const mongoose = require('mongoose');

// Users //
const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    FirstName: {type: String, required: true, unique: false},
    lastName: {type: String, required: true, unique: false},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true, unique: false },
    passedChallenges: [String],
    lovedChallenges: [String]
}, {
    timestamps: true,
});

// Challenges //
const challengeSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true, unique: false},
    type: {type: String, required: true, unique: false},
    testing: {type: String, required: true, unique: false},
    peoplePassed: { type: Number },
    solution: { type: String, required: false, unique: false },
    forbidden: [String],
    next: mongoose.SchemaTypes.ObjectId,
}, {
    timestamps: true,
});

const User = mongoose.model('users', userSchema);

const Challenge = mongoose.model('challenges', challengeSchema);

module.exports = { User , Challenge};

