const { Department } = require('../models');
const ErrorHandler = require('../errors/ErrorHandler');

const httpStatusCodes = require('../config/httpStatusCodes');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const departments = await Department.find();

      res.json(departments);
    } catch (error) {
      next(error);
    }
  },

  // eslint-disable-next-line no-unused-vars
  getById: (req, res, next) => {
    try {
      const { department } = req.locals;

      res.json(department);
    } catch (error) {
      next(error);
    }
  },

  updateDepartment: async (req, res, next) => {
    try {
      const { departmentId } = req.params;
      const { owner } = req.body;

      if (!owner) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Not fully requested data');
      }

      await Department.findByIdAndUpdate(departmentId, {
        owner
      });

      res.json({
        message: 'Updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  createDepartment: async (req, res, next) => {
    try {
      const { name, owner } = req.body;

      if (!name || !owner) {
        throw new ErrorHandler(httpStatusCodes.Bad_Request, 'Not fully requested data');
      }

      const department = await Department.create(req.body);

      res.status(httpStatusCodes.Created).json(department);
    } catch (error) {
      next(error);
    }
  },

  deleteDepartment: async (req, res, next) => {
    try {
      const { departmentId } = req.params;

      await Department.findByIdAndRemove(departmentId);

      res.json({
        message: 'Deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
