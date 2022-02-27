const mongoose = require('mongoose');

// Users //
const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true, unique: false },
    passedChallenges: [String],
    points: {type: Number, required: false, unique: false, default: 0}
}, {
    timestamps: true,
});

// Challenges //
const challengeSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true, unique: false},
    type: {type: String, required: true, unique: false},
    testing: {type: String, required: true, unique: false},
    peoplePassed: {type: Number, required: false, unique: false, default: 0},
    solution: { type: String, required: false, unique: false },
    forbidden: [String],
    funcName: { type: String, required: true, unique: false },
}, {
    timestamps: true,
});

const User = mongoose.model('users', userSchema);

const Challenge = mongoose.model('challenges', challengeSchema);

module.exports = { User , Challenge};

