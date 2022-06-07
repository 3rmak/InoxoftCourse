const path = require('path');

const uuid = require('uuid');

const { User } = require('../models');
const { passwordService, s3Service, selectUsersFromQuery } = require('../services');

const mailServise = require('../email-service/app');

const { db, httpStatusCodes, mailNameTemplatesEnum } = require('../config');

const { uploadAvatar, userNormalizator } = require('../utils');
const ErrorHandler = require('../errors/ErrorHandler');

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const userId = uuid.v1();
      const { email, name, password } = req.body;
      const hashedPassword = await passwordService.hashPass(password);

      // avatar
      const { avatar } = req.files;
      const { Key, Location } = avatar ? uploadAvatar(avatar, uuid.v1(), userId, 'userPhotos')
        : console.log('nothing to upload');

      // new user
      const user = await User.create({
        ...req.body,
        id: userId,
        password: hashedPassword,
        avatar: {
          link: Location,
          Key
        }
      });

      if (!user && Key) {
        await s3Service.delete(Key);

        throw new ErrorHandler(httpStatusCodes.Internal_Server_Error, 'Error while creating user. Try more later.');
      }

      // email
      const buttonLink = path.join(db.BACKEND_IP, `activate_user?email=${email}`);
      await mailServise.sendBroadcastMail(email, mailNameTemplatesEnum.SUBMIT_REG,
        {
          userName: name,
          buttonLink
        });

      const normalizedUser = userNormalizator.normalization(user);

      res.status(httpStatusCodes.Created).json(normalizedUser);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      await User.findByIdAndRemove(userId);

      res.json({
        message: 'Deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const users = await selectUsersFromQuery(req.query);

      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  getById: (req, res, next) => {
    try {
      const { user } = req.locals;

      const normalizedUser = userNormalizator.normalization(user);

      res.json(normalizedUser);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const { avatar } = req.files;
      const { Key, Location } = avatar ? await uploadAvatar(avatar, uuid.v1(), userId, 'userPhotos')
        : console.log('nothing to upload');

      const user = await User.findByIdAndUpdate(
        userId,
        {
          ...req.body,
          avatar: {
            link: Location,
            Key
          }
        },
        {
          new: true
        }
      );

      if (!user && Key) {
        await s3Service.delete(Key);

        throw new ErrorHandler(httpStatusCodes.Internal_Server_Error, 'Error while updating user. Try more later.');
      }

      res.json({
        message: 'Updated successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }
};
