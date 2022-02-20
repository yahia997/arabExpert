const { User, Challenge } = require('./db');
const fs = require('fs');

const getAllChallenges = (req, res) => {
    const { skip, hardness } = req.query;
    if (hardness === "all") {
        Challenge.find().limit(20).skip(parseInt(skip))
            .then(challenges => res.json(challenges))
            .catch(err => res.status(400).json(`error: ${err}`));
    } else {
        Challenge.find().limit(20).skip(parseInt(skip)).where("type").equals(hardness)
            .then(challenges => res.json(challenges))
            .catch(err => res.status(400).json(`error: ${err}`));        
    }
}

const addChallenge = (req, res) => {
    const { name, description, type, testing, solution, forbidden, funcName } = req.body;

    const newChallenge = new Challenge({
        name,
        description,
        type,
        testing,
        solution,
        forbidden,
        funcName
    });

    newChallenge.save()
    .then(() => res.send("new challenge added !"))
    .catch(err => res.status(400).json(`error: ${err}`));
}


const getSingleChallenge = (req, res) => {
    const { id } = req.params;
    Challenge.findById(id)
        .then(challenges => res.json(challenges))
        .catch(err => res.status(400).json(`error: ${err}`));
}

const peoplePassed = (req, res) => {
    const { points, challengeName } = req.body;
    
    User.findById(req.params.id)
        .then(users => {
            users.passedChallenges = [...users.passedChallenges, challengeName];
            users.points = parseInt(users.points) + parseInt(points);

            users.save()
                .then(() => res.json("some one passed this challenge"))
                .catch(err => res.status(400).json(`error: ${err}`));
        })
        .catch(err => res.status(400).json(`error: ${err}`));
}

const increase = (req, res) => {
    
    Challenge.findById(req.params.id)
    .then(challenges => {
        challenges.peoplePassed = challenges.peoplePassed + 1;
        
        challenges.save()
        .then(() => res.json("some one passed this challenge"))
        .catch(err => res.json(`error: ${err}`));
    })
        .catch(err => res.status(400).json(`error: ${err}`));
}

const addNewUser = (req, res) => {
    const { userName, email, password } = req.body;

    var points = 0;
                
    const newUser = new User({
        userName,
        email,
        password,
        points
    });
    newUser.save()
    .then(() => res.send("new user added !"))
    .catch(err => res.status(400).json(err));
}

const getSingleUser = (req, res) => {
    const { userName, password } = req.query;

    User.where("userName").equals(userName)
        .where("password").equals(password).limit(1)
        .then(users => res.status(200).json(users))
        .catch(err => res.status(400).json(err));
    
}


module.exports = {
    getAllChallenges,
    addChallenge,
    getSingleChallenge,
    peoplePassed,
    addNewUser,
    getSingleUser,
    increase
};