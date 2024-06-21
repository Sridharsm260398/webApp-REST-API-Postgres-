const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');
const checkAuth =require('../middleware/check.auth')
router.route('/login').post(loginController.loginUser);

module.exports = router;
