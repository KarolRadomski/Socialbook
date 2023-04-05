// route:   /API/auth
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers.js');
const {protect} = require('../middleware/authMiddleware.js');

router.post('/', authController.register);  // register
router.post('/login', authController.login);  // login
router.post('/resend', authController.resend);  // resend activation email
router.post('/change', protect, authController.changePassword);  // change password

module.exports = router;
