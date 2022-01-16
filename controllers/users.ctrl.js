const {
    Users: usersModel
} = require('../models');
const db = require('../models');

const bcrypt = require('../managers/bcrypt');
const { sequelize, Sequelize } = require('../config/db');
// const Users = require('../models/users')(sequelize, Sequelize);
const Op = Sequelize.Op;
const AppError = require('../managers/app-error');

class UsersCtrl {
    async getById(userId) {
        const user = await usersModel.findByPk(userId);
        return user;
    }
    async findOne(where) {
        return await usersModel.findOne({ where: where });
    }
    async getAllWithFriends(data) {
        const { userId } = data;
        if (data.name || data.username || data.limit) {

            let options = {};

            options.where = {};
            // options.attributes = {};
            options.attributes = ['id', 'name'];


            options.include = [{
                    model: usersModel,
                    as: 'Friend',
                    through: {
                        where: {
                            [Op.or]: {
                                user_id: userId,
                                friend_id: userId,
                            }
                            // user_id: {
                            //     [Op.in]: [to, from]
                            // },
                            // friend_id: {
                            //     [Op.in]: [to, from]
                            // }

                        }
                    },
                    // limit: 10,
                    // attributes: ['UserId', 'title', 'description'],
                    order: [
                        ['UserId', 'DESC']
                    ]
                },
                {
                    model: usersModel,
                    as: 'User',
                    through: {
                        where: {
                            [Op.or]: {
                                user_id: userId,
                                friend_id: userId,
                            }
                            // user_id: {
                            //     [Op.in]: [to, from]
                            // },
                            // friend_id: {
                            //     [Op.in]: [to, from]
                            // }

                        }
                    },
                    // limit: 10,
                    // attributes: ['UserId', 'title', 'description'],
                    order: [
                        ['UserId', 'DESC']
                    ]
                }, {
                    model: usersModel,
                    as: 'sendFriendRequest',
                    // through: { where: { from: to, to: from } }
                }
            ];

            if (data.limit) {
                options.limit = {};
                options.limit = Number(data.limit);
            }
            if (data.name) {
                options.where.name = {
                    [Op.iLike]: `%${data.name}%`
                }
            }
            //get all users without yourself
            options.where.id = {
                [Op.ne]: userId ? userId : null
            };

            if (data.username) {
                options.where.username = {
                    [Op.iLike]: `%${data.username}%`
                }
            }

            return usersModel.findAll(options);

        } else {
            return usersModel.findAll({ where: { attributes: ['id', ['name', 'username']] } });

        }
    }
    async getAll(data) {
        if (data.name || data.username || data.limit) {

            let options = {};

            options.where = {};
            // options.attributes = {};
            options.attributes = ['name', 'username'];


            // options.include = [{
            //     model: postsModel,
            //     as: 'userPosts',
            //     // limit: 10,
            //     attributes: ['id', 'title', 'description'],
            //     order: [
            //         ['id', 'DESC']
            //     ]
            // }];

            if (data.limit) {
                options.limit = {};
                options.limit = Number(data.limit);
            }
            if (data.name) {
                options.where.name = {
                    [Op.iLike]: `%${data.name}%`
                }
            }
            if (data.username) {
                options.where.username = {
                    [Op.iLike]: `%${data.username}%`
                }
            }

            return usersModel.findAll(options);

        } else {
            return usersModel.findAll();

        }
    }
    async add(data) {
        const users = await usersModel.findAll({
            where: {
                username: data.username
                    // username: {
                    //     [Op.like]: `%${data.username}%`
                    // }
            }
        });

        if (users.length > 0) {
            console.log('ka');
            throw new AppError('User exists');
            //res.json({ success: false, data: null, message: 'User exists' })

        } else {

            console.log(data);
            // console.log(req.file);
            let user = await usersModel.create({
                name: data.name,
                username: data.username,
                path: data.file.path,
                password: await bcrypt.hash(data.password),
                email: data.email,


            });

            return user;
        }


    }
    async friendRequest(data) {



        const { to, from } = data;
        //1.if from does not sent friend request to 
        const condition1 = await usersModel.findAll({
            include: [{
                    model: usersModel,
                    as: 'sendFriendRequest',
                    through: { where: { from: to, to: from } }
                },

                // {
                //     model: usersModel,
                //     as: 'sendFriendRequest',
                //     through: { where: { from: to } }
                // },
            ],
            where: {
                id: to
            }
        });
        console.log('send-friend request');
        //console.log(condition1);
        if (condition1 && condition1[0].dataValues.sendFriendRequest && condition1[0].dataValues.sendFriendRequest.length > 0) {
            console.log(condition1[0].dataValues.sendFriendRequest.length);
            throw new AppError('bad request!!', 403);
        } else {
            console.log('nman request chka');
        }
        return await db.sequelize.models.FriendsRequests.create({ to: parseInt(to), from: from });

    }
    async getFriendsRequests(data) {
        try {

            // const query = {
            //     include: [{
            //         model: usersModel,
            //         as: 'postsWithUsers'
            //     }]
            // };

            // return postsModel.findAll(query);
            /** {
                                model: usersModel,
                                as: 'User',
                                through: {
                                    where: {

                                        user_id: {
                                            [Op.in]: [to, from]
                                        },
                                        friend_id: {
                                            [Op.in]: [to, from]
                                        }

                                    }
                                }
                            }, */





            let options = {};
            options.where = {};
            if (data.to) {
                options.where.id = parseInt(data.to);
            }

            //options.attributes = ['id', 'name'];
            options.include = [{ model: usersModel, as: 'FriendRequest' }]
                // options.include = [{
                //     // model: db.sequelize.models.FriendsRequests,
                //     as: 'followers',
                //     // limit: 10,
                //     // attributes: ['UserId', 'title', 'description'],
                //     // order: [
                //     //     ['UserId', 'DESC']
                //     // ]
                // }];
            console.log(options);
            return usersModel.findAll(options);




            // return await db.sequelize.models.FriendsRequests.findAll(options);
        } catch (e) { console.log(e.message); }
    }
    async acceptRequest(data) {
        const { from, to } = data;
        await db.sequelize.models.FriendsRequests.destroy({ where: { to: to, from: from } });
        return await db.sequelize.models.Friends.create({ friend_id: parseInt(to), user_id: from });


    }
    async getFriends(data) {
        const { userId } = data;


        let options = {};

        options.where = { id: userId };
        // options.attributes = {};
        options.attributes = ['id', 'name'];


        options.include = [{
                model: usersModel,
                as: 'Friend',
                // through: {
                //     where: {


                //         friend_id: userId

                //         // user_id: {
                //         //     [Op.in]: [to, from]
                //         // },
                //         // friend_id: {
                //         //     [Op.in]: [to, from]
                //         // }

                //     }
                // },
                // limit: 10,
                // attributes: ['UserId', 'title', 'description'],
                // order: [
                //     ['UserId', 'DESC']
                // ]
            },
            {
                model: usersModel,
                as: 'User',
            },
            // through: {
            //     where: {

            //         user_id: userId


            //         // user_id: {
            //         //     [Op.in]: [to, from]
            //         // },
            //         // friend_id: {
            //         //     [Op.in]: [to, from]
            //         // }

            //     }
            // },
            // limit: 10,
            // attributes: ['UserId', 'title', 'description'],
            //     order: [
            //         ['UserId', 'DESC']
            //     ]
            // }
        ];


        //get all users without yourself
        // options.where.id = {
        //     [Op.ne]: userId ? userId : null
        // };



        return usersModel.findAll(options);


    }
    update() {

    }
    delete() {

    }
}
module.exports = new UsersCtrl();