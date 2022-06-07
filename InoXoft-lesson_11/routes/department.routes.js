const router = require('express').Router();
const {
  isDepartmentById,
  isDepartmentNameUsed,
  isObjectId
} = require('../middlewares/department.middleware');

const departmentController = require('../controllers/department.controller');

const isReqBodyValid = require('../hooks/ReqDataValidator');

const { departmentValidator } = require('../validators');

router.use('/:departmentId', [
  isObjectId,
  isDepartmentById
]);

router.get('/', departmentController.getAll);

router.get('/:departmentId', departmentController.getById);

router.post('/', [
  isReqBodyValid(departmentValidator.DepartmentPostValidator),
  isDepartmentNameUsed
], departmentController.createDepartment);

router.patch(
  '/:departmentId',
  isReqBodyValid(departmentValidator.DepartmentPatchValidator),
  departmentController.updateDepartment
);

router.delete('/:departmentId', departmentController.deleteDepartment);

module.exports = router;
