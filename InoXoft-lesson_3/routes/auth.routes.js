const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.get('/register', authController.getRegisterPage);
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;
