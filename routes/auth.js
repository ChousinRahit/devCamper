const express = require('express');
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
  updatedetails,
  updatepassword,
  logout
} = require('../controllers/auth');
const { protectRoutes } = require('../middleware/auth');

const router = express.Router();

router.route('/resetpassword/:resettoken').post(resetPassword);

router.route('/forgetpassword').post(forgetPassword);

router.route('/updatedetails').post(protectRoutes, updatedetails);

router.route('/updatepassword').post(protectRoutes, updatepassword);

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/me').get(protectRoutes, getMe);

module.exports = router;
