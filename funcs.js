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
    const { name, description, type, testing, solution, forbidden } = req.body;

    const newChallenge = new Challenge({
        name,
        description,
        type,
        testing,
        solution,
        forbidden
    });

    newChallenge.save()
    .then(() => res.send("new challenge added !"))
    .catch(err => res.status(400).json(`error: ${err}`));
}


const writeFile = (req, res) => {
    const { code } = req.body;

    Challenge.findById(req.params.id)
        .then(challenges => {

            fs.writeFileSync('./testFuncs.js', `${code} 
module.exports = func;`);
            const func = require('./testFuncs');

            let arr = JSON.parse(challenges.testing);

            let resultArr =  arr.map((obj, index) => {
                return { yourResult: func(...obj.input), expectedResult: obj.result[0] };
            });
            


            if (challenges.forbidden.length > 0) {
                challenges.forbidden.forEach((a, index) => {
                    if (code.includes(a)) {
                        resultArr.push(`your code shouldn’t contain ${a}`);
                    }
                })
            }

            res.json(resultArr);

        })
        .catch(err => res.status(400).json(`error: ${err}`));

}

const getSingleChallenge = (req, res) => {
    const { id } = req.params;
    Challenge.findById(id)
        .then(challenges => res.json(challenges))
        .catch(err => res.status(400).json(`error: ${err}`));
}

const peoplePassed = (req, res) => {
    Challenge.findById(req.params.id)
    .then(challenges => {
            challenges.peoplePassed = challenges.peoplePassed + 1;

            challenges.save()
                .then(() => res.json("some one passed this challenge"))
                .catch(err => res.status(400).json(`error: ${err}`));
        })
        .catch(err => res.status(400).json(`error: ${err}`));
}

module.exports = {
    getAllChallenges,
    addChallenge,
    writeFile,
    getSingleChallenge,
    peoplePassed
};