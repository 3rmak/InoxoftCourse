const router = require('express').Router();
const {
  isDepartmentById,
  isDepartmentNameUsed,
  isObjectId,
  isPostDataValid,
  isPatchDataValid
} = require('../middlewares/department.middleware');
const departmentController = require('../controllers/department.controller');

router.get('/', departmentController.getAll);

router.get('/:departmentId', [
  isObjectId,
  isDepartmentById
], departmentController.getById);

router.post('/', [
  isPostDataValid,
  isDepartmentNameUsed
], departmentController.createDepartment);

router.patch('/:departmentId', [
  isObjectId,
  isDepartmentById,
  isPatchDataValid
], departmentController.updateDepartment);

router.delete('/:idepartmentIdd', [
  isObjectId,
  isDepartmentById
], departmentController.deleteDepartment);

module.exports = router;
