const { httpStatusCodes } = require('../config');

const ErrorHandler = require('../errors/ErrorHandler');

module.exports = async (file, itemId, userId, destinationType = 'other') => {
  const { s3Service } = require('../services');

  const bucketAvatar = await s3Service.upload(file, itemId, userId, destinationType);

  // console.log(bucketAvatar);

  if (!bucketAvatar) {
    throw new ErrorHandler(httpStatusCodes.Internal_Server_Error, 'Error while avatar uploading. Try more later.');
  }

  const { Key, Location } = bucketAvatar;

  return { Key, Location };
};
