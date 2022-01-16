const express = require('express');
const router = express.Router();
const multer = require('multer');
const mimeType = require('mime-types');
const fs = require('fs').promises;
const path = require('path');
const usersJsonPath = path.join(__homedir, './users.json');
const UsersCtrl = require('../controllers/users.ctrl');
const { body, query, param } = require('express-validator');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mimeType.extension(file.mimetype));
    }
});

let upload = multer({ storage: storage });
const { sequelize, Sequelize } = require('../config/db');
const Users = require('../models/users')(sequelize, Sequelize);
const { Users: usersModel, Posts: postsModel } = require('../models');

const ResponseManager = require('../managers/response-managers');
const AppError = require('../managers/app-error');


const Op = Sequelize.Op;
const validationResult = require('../middlewares/validation-result');
const validateToken = require('../middlewares/validate-token');
const responseManager = require('../middlewares/response-handler');
//const { Sequelize } = require('sequelize');
router.route('/getFriends').get(

    responseManager,
    validateToken,
    async(req, res) => {
        try {
            console.log('router');

            const requests = await UsersCtrl.getFriends({ userId: req.decoded.userId });
            if (requests.length > 0) {
                res.onSuccess(requests['0'].dataValues, 'get friends');
            } else {
                res.onSuccess({}, 'User does not have a friend!');
            }


        } catch (e) { res.onError(e, e.message); }
    });
router.route('/getFriendRequests').get(

    responseManager,
    validateToken,
    async(req, res) => {
        try {
            console.log('router');

            const requests = await UsersCtrl.getFriendsRequests({ to: req.decoded.userId });
            if (requests.length > 0) {
                res.onSuccess(requests['0'].dataValues.FriendRequest, 'get some friend requests');
            } else {
                res.onSuccess({}, 'User does not have friend requests!');
            }


        } catch (e) { res.onError(e, e.message); }
    });
router.route('/accept-request').post(

    responseManager,
    validateToken,
    async(req, res) => {
        try {
            console.log('router');

            const requests = await UsersCtrl.acceptRequest({ from: req.body.from, to: req.decoded.userId });
            if (requests.length > 0) {
                res.onSuccess({}, 'Friend Request has been accepted!');
            }


        } catch (e) { res.onError(e, e.message); }
    });
router.post('/current',
    responseManager,
    validateToken,
    async(req, res) => {
        try {

            const user = await UsersCtrl.getById(req.decoded.userId);
            res.onSuccess(user, '');
        } catch (e) {
            res.onError(e);
        }
    }
);
router.route('/friend-request').post(
    validateToken,
    responseManager,
    body('to').exists(),
    async(req, res) => {
        try {
            console.log('routeeeeeeeeee');
            console.log(req.body);
            console.log(req.decoded.userId);
            const friend = await UsersCtrl.friendRequest({ from: req.decoded.userId, to: req.body.to });

            res.onSuccess(friend, 'Friend request successfully send');
        } catch (e) { res.onError(e, e.message); }
    });
router.route('/:id').get(
    param('id').exists(),
    responseManager,
    validationResult,
    async(req, res) => {
        try {
            const responseHandler = ResponseManager.getResponseHandler(res);
            const user = UsersCtrl.getById(req.params.id);
            responseHandler.onSuccess(user, '');
        } catch (e) {
            responseHandler.onError(e, e.message);
        }

    });
router.route('/').get(
    responseManager,
    validateToken,

    async(req, res) => {

        try {
            console.log(req.decoded.userId);
            const users = await UsersCtrl.getAllWithFriends({
                'name': req.query.name ? req.query.name : null,
                'username': req.query.username ? req.query.username : null,
                'limit': req.query.limit ? req.query.limit : null,
                'userId': req.decoded.userId ? req.decoded.userId : null
            });
            res.onSuccess(users, '');

        } catch (e) {
            res.onError(e, e.message);
        }


    }).post(

    upload.single('image'),
    body('name').exists().bail().isLength({ min: 6 }),
    body('password').exists().bail().isLength({ min: 6 }),
    validationResult,
    responseManager,

    async(req, res) => {

        try {

            let user = await UsersCtrl.add({
                name: req.body.name,
                username: req.body.username,
                file: req.file,
                email: req.body.email,
                password: req.body.password
            });

            delete user.dataValues.password;
            res.onSuccess(user, 'User successfully created');

        } catch (e) {
            //await fs.unlink(path.join(__homedir,req.file.path));
            res.onError(e);

        }

    });

router.route('/:username').get(async(req, res) => {
    console.log(req.params.username);
    if (req.params && req.params.username) {
        await Users.findOne({ where: { username: req.params.username } }).then(user => {
            if (user) {
                res.json({
                    success: true,
                    data: user
                });
            } else {
                throw new Error('User not found');
            }


        }).catch(err => res.json({ success: false, data: null, message: 'User not exists!' }));
    } else {
        res.json({ success: false, data: null, message: 'User not exists!' })
    }

}).put(upload.single('image'), async(req, res) => {
    try {
        if (req.body && req.body.username) {
            await Users.findOne({ where: { username: req.params.username } }).then(user => {
                user.path = req.file.path;
                user.name = req.body.name;
                // await fs.unlink(path.join(__homedir, user.path));
                Users.update(user, { where: { username: req.params.username } });
                res.json({
                    success: true,
                    message: 'User successfully updated!',
                    data: user
                });

            }).catch(err => res.json({ success: false, data: null, message: 'User not exists!' }));
        } else {
            throw new Error('User not found!');
        }

    } catch (e) {
        res.json({ success: false, data: null, message: e.message });
    }
}).delete(async(req, res) => {
    try {
        if (req.params && req.params.username) {
            Users.destroy({ where: { username: req.params.username } }).then(() => res.json({
                success: true,
                message: 'User successfully deleted!'
            })).catch(err =>
                res.json({ success: false, data: null, message: 'User not exists!' }));

        } else {
            throw new Error('User not found!');
        }

    } catch (e) {
        res.json({ success: false, data: null, message: e.message });
    }
});



module.exports = router;