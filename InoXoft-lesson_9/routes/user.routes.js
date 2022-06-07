const router = require('express').Router();

const {
  isCreatesManager,
  isEmailUsed,
  isObjectId,
  getUserByDynamicParams,
  hasUserAccess
} = require('../middlewares/user.middleware');

const {
  createUser,
  deleteUser,
  getAll,
  getById,
  updateUser,
} = require('../controllers/user.controllers');

const { tokenVerification } = require('../middlewares/auth.middleware');

const isReqBodyValid = require('../hooks/ReqDataValidator');

const { userValidator } = require('../validators');
const { userRoleEnum, userFieldsEnum } = require('../config');

router.get('/', getAll);

router.get('/perevirka', getUserByDynamicParams(userFieldsEnum.EMAIL), getById);

router.post('/', [
  isReqBodyValid(userValidator.UserCreateValidator),
  isEmailUsed,
  isCreatesManager
], createUser);

router.post('/admin', [
  isReqBodyValid(userValidator.UserCreateValidator),
  isEmailUsed,
  tokenVerification(),
  hasUserAccess([
    userRoleEnum.Admin,
    userRoleEnum.SuperAdmin
  ])
], createUser);

router.use('/:userId', [
  isObjectId,
  getUserByDynamicParams(userFieldsEnum.ID, 'params', '_id')
]);

router.get('/:userId', getById);

router.patch('/:userId', isReqBodyValid(userValidator.UserPatchValidator), updateUser);

router.delete('/:userId', deleteUser);

module.exports = router;
