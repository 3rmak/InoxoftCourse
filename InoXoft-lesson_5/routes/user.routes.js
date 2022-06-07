const router = require('express').Router();
const {
  isEmailUsed,
  isObjectId,
  isPostDataValid,
  isPatchDataValid,
  isPasswordMatch,
  isUserById
} = require('../middlewares/user.middleware');
const {
  createUser,
  deleteUser,
  getAll,
  getById,
  loginUser,
  updateUser,
} = require('../controllers/user.controllers');

router.get('/', getAll);

router.get('/:userId', [
  isObjectId,
  isUserById
], getById);

router.post('/', [
  isPostDataValid,
  isEmailUsed
], createUser);

router.patch('/:userId', [
  isObjectId,
  isPatchDataValid,
  isUserById
], updateUser);

router.delete('/:userId', [
  isObjectId,
  isUserById
], deleteUser);

router.post('/login', isPasswordMatch, loginUser);

module.exports = router;
