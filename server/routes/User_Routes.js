const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/User_Controller');
const isAuthenticated = require('../middlewares/Auth');
const followUser = require('../models/FollowUser');


router.route('/register').post(register);

router.route('/login').post(login);

router.route('/follows/:user_id').get(isAuthenticated, followUser)

module.exports = router;