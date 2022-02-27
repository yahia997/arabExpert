const router = require('express').Router();
const { getAllChallenges,
        addChallenge,
        getSingleChallenge,
        peoplePassed,
        getSingleUser,
        addNewUser,
        getTops,
        deleteUser,
        editChallenge,
        deleteChallenge,
        increase} = require('./funcs');

router.route("/users/login").post(getSingleUser);
router.route('/users').post(addNewUser);
router.route('/users/:id').delete(deleteUser);
router.route('/challenges').get(getAllChallenges).post(addChallenge);
router.route('/challenges/:id').get(getSingleChallenge).put(editChallenge).delete(deleteChallenge);

// increase people that passed specific challenge // 
router.route('/challenges/passed/:id').put(increase);
router.route('/users/passed/:id').put(peoplePassed);

// tops
router.route('/toper').get(getTops);

module.exports = router;