const fs = require('fs');
const util = require('util');

const ErrorHandler = require('../errors/ErrorHandler');

const { httpStatusCodes } = require('../config');

const fsReadFile = util.promisify(fs.readFile);

module.exports = {
  readFile: async (filePath) => {
    try {
      const buffer = await fsReadFile(filePath);

      return buffer;
    } catch (error) {
      throw new ErrorHandler(httpStatusCodes.Internal_Server_Error, 'File reading error');
    }
  }
};
