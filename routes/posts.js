const express = require('express');
const router = express.Router();
const { sequelize, Sequelize } = require('../config/db');

const { Users: usersModel } = require('../models');
const { Posts: postsModel } = require('../models');

const { body, query, param } = require('express-validator');
const ResponseManager = require('../managers/response-managers');
const AppError = require('../managers/app-error');

const PostsCtrl = require('../controllers/posts.ctrl');
const Op = Sequelize.Op;
const validationResult = require('../middlewares/validation-result');
router.route('/:id').get(
    param('id').exists(),
    validationResult,
    async(req, res) => {
        const responseHandler = ResponseManager.getResponseHandler(res);
        try {
            const post = await PostsCtrl.getById(req.params.id);
            console.log(post);
            responseHandler.onSuccess(post, '');
        } catch (e) {
            responseHandler.onError(e, e.message);
        }


    });
router.route('/').get(
    async(req, res) => {
        const responseHandler = ResponseManager.getResponseHandler(res);
        try {
            const posts = await PostsCtrl.getAll();
            responseHandler.onSuccess(posts, '');
        } catch (e) {
            responseHandler.onError(e, e.message);
        }

    }).post(
    body('userId').custom(value => {
        return usersModel.findByPk(value).then(user => {
            if (!user) {
                return Promise.reject('User not exists!');
            }
        })
    }),
    validationResult,
    async(req, res) => {
        const responseHandler = ResponseManager.getResponseHandler(res);

        try {
            //call controller function
            const post = await PostsCtrl.add({
                title: req.body.title,
                description: req.body.description,
                userId: req.body.userId
            });
            responseHandler.onSuccess(post, 'Post successfully created!');



            //res.json({ success: true, data: JSON.stringify(post), message: 'Post successfully created' });
        } catch (e) {
            responseHandler.onError(e, e.message);
            // "res.json({ success: false, data: null, message: err.message });"
        }
    });

router.route('/:id').delete((req, res) => {
    res.end('DELETE method');
});





module.exports = router;