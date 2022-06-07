const router = require('express').Router();

// const {  } = require('../middlewares/auth.middleware');

const {
  loginUser, logoutUser, refreshToken
} = require('../controllers/auth.controller');

const { getUserByDynamicParams } = require('../middlewares/user.middleware');
const { accessTokenVerification, refreshTokenVerification } = require('../middlewares/auth.middleware');

const { userFieldsEnum } = require('../config');

router.post('/login', getUserByDynamicParams(userFieldsEnum.EMAIL), loginUser);

router.post('/logout', accessTokenVerification, logoutUser);

router.post('/refresh_token', refreshTokenVerification, refreshToken);

module.exports = router;
