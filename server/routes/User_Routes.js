const express = require('express');
const router = express.Router();

const { register, login, logout, updatePassword } = require('../controllers/User_Controller');
const isAuthenticated = require('../middlewares/Auth');
const { followUser } = require('../controllers/Follows');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/update').patch(updatePassword);

router.route('/follows/:user_id').get(isAuthenticated, followUser)

module.exports = router;