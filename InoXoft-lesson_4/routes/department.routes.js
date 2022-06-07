const router = require('express').Router();
const { isDepartmentById, isDepartmentNameUsed } = require('../middlewares/department.middleware');
const departmentController = require('../controllers/department.controller');

router.get('/', departmentController.getAll);
router.get('/:departmentId', isDepartmentById, departmentController.getById);
router.post('/', isDepartmentNameUsed, departmentController.createDepartment);
router.patch('/:departmentId', isDepartmentById, departmentController.updateDepartment);
router.delete('/:idepartmentIdd', isDepartmentById, departmentController.deleteDepartment);

module.exports = router;
