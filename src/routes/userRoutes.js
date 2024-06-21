const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth =require('../middleware/check.auth')
router.route('/create_profile').post(userController.createProfile);
router.route('/get_profile_all').get(userController.getAllUser,checkAuth);
router.route('/update_profile=ID').patch(userController.updateUserProfile);
router.route('/delete_profile=ID').delete(userController.deleteUser);
router.route('/get_profile=ID').get(checkAuth,userController.getSingleUser);

module.exports = router;
