const router = require('express').Router();
const {
  isEmailUsed,
  isObjectId,
  isPasswordMatch,
  // isUserById,
  getUserByDynamicParams,
  hasUserAccess
} = require('../middlewares/user.middleware');
const {
  createUser,
  deleteUser,
  getAll,
  getById,
  loginUser,
  updateUser,
} = require('../controllers/user.controllers');

const isReqBodyValid = require('../hooks/ReqDataValidator');

const { userValidator } = require('../validators');
const { userRoleEnum, userFieldsEnum } = require('../config');

router.get('/', getAll);

router.get('/perevirka', getUserByDynamicParams(userFieldsEnum.EMAIL), getById);

router.post('/login', isPasswordMatch, loginUser);

router.post('/', [
  isReqBodyValid(userValidator.UserCreateValidator),
  isEmailUsed,
  hasUserAccess([userRoleEnum.Admin])
], createUser);

router.use('/:userId', [
  isObjectId,
  getUserByDynamicParams(userFieldsEnum.ID, 'params', '_id')
]);

router.get('/:userId', getById);

router.patch('/:userId', isReqBodyValid(userValidator.UserPatchValidator), updateUser);

router.delete('/:userId', deleteUser);

module.exports = router;
