const router = require('express').Router();
const { isEmailUsed, isUserById } = require('../middlewares/user.middleware');
const {
  getAll,
  getById,
  updateUser,
  createUser,
  deleteUser
} = require('../controllers/user.controllers');

router.get('/', getAll);
router.get('/:userId', isUserById, getById);
router.post('/', isEmailUsed, createUser);
router.patch('/:userId', isUserById, updateUser);
router.delete('/:userId', isUserById, deleteUser);

module.exports = router;
