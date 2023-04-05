// route:   /activate

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers.js');
// handle route with id using params

router.get('/:id', authController.confirm);

module.exports = router;
