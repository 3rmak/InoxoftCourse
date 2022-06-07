const router = require('express').Router();
const userController = require('../controllers/users.controller');

// router.get('/', userController.getAllUsers)
router.get('/userPage/:userId', userController.getUserById);

module.exports = router;
