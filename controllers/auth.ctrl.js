const { Users: usersModel } = require('../models');
const bcrypt = require('../managers/bcrypt');
const { sequelize, Sequelize } = require('../config/db');
const Users = require('../models/users')(sequelize, Sequelize);
const Op = Sequelize.Op;
const AppError = require('../managers/app-error');
const TokenManager = require('../managers/token-manager');
const UserCtrl = require('./users.ctrl');
const email = require('../managers/email-manager');

class Auth {
    async login(data) {
        console.log(data);
        const { username, password } = data;
        const user = await usersModel.findOne({
            where: {
                username: username
                    // username: {
                    //     [Op.like]: `%${username}%`
                    // }
                    // password: bcrypt.compare(data.password

            }
        });
        console.log(user);
        // console.log(user !== null);
        // console.log(user.length > 0);
        // console.log(typeof(user.dataValues) !== undefined);
        // console.log(typeof(user.dataValues) !== 'undefined');
        // console.log(user.dataValues.length > 0);
        // console.log(user.dataValues);
        if (user !== null && typeof(user.dataValues) !== undefined) {
            console.log('username exists');
            // console.log(user.dataValues.password);
            //console.log(await bcrypt.compare(password, user.dataValues.password));
            if (bcrypt.compare(data.password, user.dataValues.password)) {
                if (!user.dataValues.isActive) {
                    throw new AppError('Username profile is not active', 403);
                }
                console.log('password is true');
                return TokenManager.encode({
                    userId: user.dataValues.id
                });
            }
            console.log('password is false');
            throw new AppError('Username or password is wrong', 403);
        } else {
            console.log('username doesnt exists');
            return false;
        }
        return true;
        return user.dataValues && typeof(user.dataValues) !== undefined && user.dataValues.length > 0 ? user : false;



    }
    async register(data) {
        const user = UserCtrl.add(data);
        const token = TokenManager.encode({
            email: data.email,
            action: 'register'
        });
        console.log(data.email);
        console.log(token);
        try {
            await email(data.email, 'Register', `<a href="http://localhost:3000/activate?code=${token}">Activate Profile</a>`);
        } catch (e) { console.log(e); }


        return user;


    }
    async forgotPassword(_email) {
        const user = UserCtrl.findOne({ email: _email });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const token = TokenManager.encode({
            email: _email,
            action: 'forgot'
        });
        console.log(token);
        try {
            await email(_email, 'Reset Password', `<a href="http://localhost:3000/reset-password?code=${token}">Reset Password</a>`);
        } catch (e) { console.log(e); }


        // return user;


    }
    async activate(code) {
        try {
            const decoded = await TokenManager.decode(code);
            console.log(decoded);
            if (decoded.email) {
                console.log(decoded.email);
                const user = await UserCtrl.findOne({ email: decoded.email });
                console.log(user);
                if (!user || user.isActive) {
                    throw new AppError('Invalid code!', 403);
                }
                user.isActive = true;
                user.update({ isActive: true }, { where: { email: decoded.email } })
                    .then(user => {
                        return user;
                    }).catch(e => console.log(e.message));


            } else {
                throw new AppError('Invalid code!', 403);
            }
        } catch (e) { console.log(e); }

    }
    async resetPassword(data) {
        try {
            const decoded = await TokenManager.decode(data.code);
            console.log(decoded);
            if (decoded.email && decoded.action === 'forgot') {

                const user = await UserCtrl.findOne({ email: decoded.email });

                if (!user) {
                    throw new AppError('Invalid code!', 403);
                }
                user.password = data.password;
                user.update({ password: await bcrypt.hash(data.password) }, { where: { email: decoded.email } })
                    .then(user => {
                        return user;
                    }).catch(e => console.log(e.message));


            } else {
                throw new AppError('Invalid code!', 403);
            }
        } catch (e) { console.log(e); }

    }
}

module.exports = new Auth();