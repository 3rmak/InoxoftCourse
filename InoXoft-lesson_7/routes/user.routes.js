const router = require('express').Router();

const {
  isEmailUsed,
  isObjectId,
  getUserByDynamicParams,
  hasUserRoleAccess
} = require('../middlewares/user.middleware');

const { isTokenBelongsUser, tokenVerification } = require('../middlewares/auth.middleware');

const {
  createUser,
  deleteUser,
  getAll,
  getById,
  updateUser,
} = require('../controllers/user.controllers');

const isReqBodyValid = require('../hooks/ReqDataValidator');

const { userValidator } = require('../validators');
const { userRoleEnum, userFieldsEnum } = require('../config');

router.get('/', getAll);

router.post('/', [
  isReqBodyValid(userValidator.UserCreateValidator),
  isEmailUsed,
  tokenVerification(),
  hasUserRoleAccess([
    userRoleEnum.Admin,
    userRoleEnum.SuperAdmin
  ])
], createUser);

router.use('/:userId', [
  isObjectId,
  getUserByDynamicParams(userFieldsEnum.ID, 'params', '_id')
]);

router.get('/:userId', getById);

router.patch('/:userId',
  [
    isReqBodyValid(userValidator.UserPatchValidator),
    tokenVerification(),
    isTokenBelongsUser
  ], updateUser);

router.delete('/:userId',
  [
    tokenVerification(),
    isTokenBelongsUser
  ],
  deleteUser);

module.exports = router;
