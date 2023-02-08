const express = require('express');
const { register, login } = require('../controllers/User_Controller');
const isAuthenticated = require('../middlewares/Auth');
const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(isAuthenticated, login)

module.exports = router;