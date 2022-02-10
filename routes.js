const router = require('express').Router();
const { getAllChallenges,
        addChallenge,
        writeFile,
        getSingleChallenge,
        peoplePassed} = require('./funcs');


router.route('/users');
router.route('/challenges').get(getAllChallenges).post(addChallenge);
router.route('/challenges/:id').get(getSingleChallenge);

// increase people that passed specific challenge // 
router.route('/challenges/passed/:id').put(peoplePassed);


// test customer code //
router.route('/test/:id').post(writeFile);

module.exports = router;