const router = require('express').Router();
const { getAllChallenges,
        addChallenge,
        getSingleChallenge,
        peoplePassed,
        getSingleUser,
        addNewUser,
        increase} = require('./funcs');


router.route('/users').post(addNewUser).get(getSingleUser);
router.route('/challenges').get(getAllChallenges).post(addChallenge);
router.route('/challenges/:id').get(getSingleChallenge);

// increase people that passed specific challenge // 
router.route('/challenges/passed/:id').put(increase);
router.route('/users/passed/:id').put(peoplePassed);


module.exports = router;