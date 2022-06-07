const S3Client = require('aws-sdk/clients/s3');

// const fs = require('fs');
const path = require('path');

const { fileUtils } = require('../utils');

const { aws } = require('../config');

const bucket = new S3Client({
  region: aws.AWS_S3_REGION,
  accessKeyId: aws.AWS_S3_ACCESS_KEY,
  secretAccessKey: aws.AWS_S3_SECRET_KEY
});

module.exports = {
  upload: async (file, itemId, userId, destinationType = 'other') => {
    const fileData = await fileUtils.readFile(file.path);
    const destinationPath = _pathBuilder(file.name, itemId, userId, destinationType);

    return bucket.upload({
      Bucket: aws.AWS_S3_BUCKET,
      Body: fileData,
      Key: destinationPath,
      ContentType: file.type
    })
      .promise();
  },

  delete: (key) => bucket.deleteObject({
    Bucket: aws.AWS_S3_BUCKET,
    Key: key
  })
    .promise()
};

function _pathBuilder(fileName, itemId, userId, destinationType = 'other') {
  const extName = path.extname(fileName);
  const baseName = path.basename(fileName, extName);

  return path.join(destinationType, userId, `${baseName}-${itemId}${extName}`);
}
