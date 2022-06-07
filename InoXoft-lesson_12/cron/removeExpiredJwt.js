const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');
const util = require('util');

const fsAppendFile = util.promisify(fs.appendFile);

const { OAuth } = require('../models');

module.exports = {
  removeByExpiredRefresh: async () => {
    try {
      const previousMonth = dayjs().subtract(1, 'month');

      await OAuth.deleteMany({ createdAt: { $lte: previousMonth } });
    } catch (e) {
      const logFile = path.resolve(__dirname, 'cron_error_log.txt');

      await fsAppendFile(logFile, `${new Date().toISOString()} Error while cron job: ${e}`);
    }
  }
};
