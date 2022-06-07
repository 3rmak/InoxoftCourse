const router = require('express').Router();

// const {  } = require('../middlewares/auth.middleware');

const {
  loginUser, logoutUser, refreshToken
} = require('../controllers/auth.controller');

const { getUserByDynamicParams } = require('../middlewares/user.middleware');
const { tokenVerification } = require('../middlewares/auth.middleware');

const { userFieldsEnum } = require('../config');

router.post('/login', getUserByDynamicParams(userFieldsEnum.EMAIL), loginUser);

router.post('/logout', tokenVerification(), logoutUser);

router.post('/refresh_token', tokenVerification('refresh'), refreshToken);

module.exports = router;
