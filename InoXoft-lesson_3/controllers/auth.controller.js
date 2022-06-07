/* eslint-disable array-callback-return */
const fs = require('fs');
const path = require('path');
const util = require('util');
const { v4 } = require('uuid');

const users_db = require('../database/users.json');
const statusCodes = require('../configs/httpStatusCodes');

const fsWriteFile = util.promisify(fs.writeFile);

let authorized = false;

module.exports = {
    getRegisterPage: (req, res) => {
        res.render('Register', { authorized });
    },

    getLoginPage: (req, res) => {
        res.render('Login', { authorized });
    },

    register: async (req, res) => {
        try {
            const user = { ...req.body, id: v4() };
            const userFromDB = (users_db.find((val) => {
                if (val.email === user.email) {
                    return val;
                }
            }));
            if (userFromDB) {
                return res.status(statusCodes.Conflict).json({
                    message: `User can not be created. User with email ${user.email} already exists`
                });
            }

            const dbFilePath = path.resolve(__dirname, 'database', 'users.json');
            users_db.push(user);

            await fsWriteFile(dbFilePath, Buffer.from(JSON.stringify(users_db)));

            res.status(statusCodes.Created).render('Login', { authorized });
        } catch (error) {
            res.status(statusCodes['Internal Server Error']).json({
                message: 'error while writing to file'
            }).render('Register');
        }
    },

    login: (req, res) => {
        const { login, password } = req.body;
        const user = (users_db.find((val) => {
            if (val.email === login) {
                return val;
            }
        })
        );

        if (!user) {
            return res.status(statusCodes['Not Found']).json({
                message: 'User with email not found'
            });
        }
        if (user.password !== password) {
            return res.status(statusCodes['Not Found']).json({
                message: 'Password is incorrect'
            });
        }
        authorized = true;
        return res.render('AllUsers', { users: users_db });
    },

    logout: (req, res) => {
        authorized = false;

        res.render('Login', { authorized });
    }
};
