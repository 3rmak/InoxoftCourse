const router = require('express').Router();

const {
  activateUser, forgotPass, loginUser, logoutUser, refreshToken, resetPass
} = require('../controllers/auth.controller');

const { isUserActive, getUserByDynamicParams } = require('../middlewares/user.middleware');
const { tokenVerification } = require('../middlewares/auth.middleware');

const { reqFieldsEnum, userFieldsEnum } = require('../config');

router.get('/activate_user', getUserByDynamicParams(userFieldsEnum.EMAIL, reqFieldsEnum.QUERY), activateUser);

router.post('/forgot_password', getUserByDynamicParams(userFieldsEnum.EMAIL), forgotPass);

router.post('/reset_password', tokenVerification('access', reqFieldsEnum.QUERY), resetPass);

router.post('/login',
  [
    getUserByDynamicParams(userFieldsEnum.EMAIL),
    isUserActive,
  ], loginUser);

router.post('/logout', tokenVerification(), logoutUser);

router.post('/refresh_token', tokenVerification('refresh'), refreshToken);

module.exports = router;
