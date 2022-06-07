const fs = require('fs');
const path = require('path');
const util = require('util');

const fsAppendFile = util.promisify(fs.appendFile);

const OAuth = require('../models/OAuth');

const { tokenService } = require('../services');

module.exports = {
  removeByExpiredRefresh: async () => {
    try {
      const jwts = await OAuth.find();

      await jwts.filter(async (val) => {
        const isExpired = await tokenService.cronJobVerifyToken(val.refresh_token);

        if (isExpired) {
          await OAuth.deleteOne({ refresh_token: val.refresh_token });
        }
      });
    } catch (e) {
      const logFile = path.resolve(__dirname, 'cron_error_log.txt');

      await fsAppendFile(logFile, `${new Date().toISOString()} Error while cron job: ${e}`);
    }
  }
};
