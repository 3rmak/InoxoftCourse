const { Department } = require('../models');
const ErrorHandler = require('../errors/ErrorHandler');

const httpStatusCodes = require('../config/httpStatusCodes');

module.exports = {
  isDepartmentById: async (req, res, next) => {
    try {
      const { departmentId } = req.params;
      const department = await Department.findById(departmentId);

      if (!department) {
        throw new ErrorHandler(httpStatusCodes.Conflict, 'Department with id not found');
      }

      req.locals = {
        department
      };

      next();
    } catch (error) {
      next(error);
    }
  },

  isDepartmentNameUsed: async (req, res, next) => {
    try {
      const { name } = req.body;
      const department = await Department.findOne({ name: name.trim() });

      if (department) {
        throw new ErrorHandler(httpStatusCodes['Bad Request'], 'Department with such name already exist');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
};
