const { Users: usersModel, Posts: postsModel } = require('../models');
const { sequelize, Sequelize } = require('../config/db');

const ResponseManager = require('../managers/response-managers');
const AppError = require('../managers/app-error');

const Op = Sequelize.Op;
class PostsCtrl {
    async getById(postId) {
        console.log(postId);
        const post = await postsModel.findByPk(postId);
        if (post === null) throw new Error('Post not exists!');
        return post;

    }
    getAll() {

        const query = {
            include: [{
                model: usersModel,
                as: 'postsWithUsers'
            }]
        };

        return postsModel.findAll(query);
    }
    async add(data) {
        let title = data.title;

        //find posts like a new post
        const regexp = new RegExp('\([1-9]\)', 'g');
        const where = regexp.test(title.trim()) ? `%${title.slice(0,title.trim().length-3)}%` : title;

        await postsModel.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${where}%`
                },
                author_id: [data.userId]

            },
            order: [
                ['id', 'DESC']
            ],
            limit: 1
        }).then(async(post) => {

            if (post.length > 0) {

                const regexp = new RegExp('\([1-9]\)', 'g');

                if (regexp.test(post[0].title.trim())) {
                    let newValue = +post[0].title.trim().charAt(post[0].title.length - 2) + 1;
                    title = post[0].title.trim().slice(0, post[0].title.trim().length - 2) + newValue + ')';
                } else {
                    title = post[0].title.trim() + '(1)';
                }

            }

        });
        let post = {
            title: title,
            description: data.description,
            author_id: data.userId

        };
        return postsModel.create(post);

    }
    update() {

    }
    delete() {

    }
}
module.exports = new PostsCtrl();