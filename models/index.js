const { Sequelize } = require('sequelize');
//const config = require('../config/db')['development'];
// const sequelize = new Sequelize(config.database, config.username, config.password, {
//     host: config.host,
//     dialect: config.dialect
// });
const sequelize = new Sequelize('test8', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgresql'
});
const db = {};

db.Sequelize = Sequelize;


db.sequelize = sequelize;

// console.log(sequelize);
//Models/tables
db.Users = require('./users.js')(sequelize, Sequelize);
db.Posts = require('./posts.js')(sequelize, Sequelize);
db.Messages = require('./messages.js')(sequelize, Sequelize);

// console.log(db.Users);
// console.log(db.Users);
Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

//Relationships

db.Users.hasMany(db.Posts, {
    as: 'userPosts',
    foreignKey: 'author_id'
});

db.Posts.belongsTo(db.Users, {
    as: 'postsWithUsers',
    foreignKey: 'author_id'
});

//new relationship for friends model
db.Users.belongsToMany(db.Users, {
    as: 'User',
    foreignKey: 'user_id',
    through: 'Friends'
});
db.Users.belongsToMany(db.Users, {
    as: 'Friend',
    foreignKey: 'friend_id',
    through: 'Friends'
});
//new relationship for friends requests model
db.Users.belongsToMany(db.Users, {
    as: 'sendFriendRequest',
    foreignKey: 'from',
    through: 'FriendsRequests'
});
db.Users.belongsToMany(db.Users, {
    as: 'FriendRequest',
    foreignKey: 'to',
    through: 'FriendsRequests'
});
//messages associate
db.Users.hasMany(db.Messages, {
    foreignKey: 'senderId',
});

db.Users.hasMany(db.Messages, {
    foreignKey: 'receiverId',
});
db.Messages.belongsTo(db.Users, {
    as: "Sender",
    foreignKey: "senderId",
    allowNull: false
});

db.Messages.belongsTo(db.Users, {
    as: "Receiver",
    foreignKey: "receiverId",
    allowNull: false
});
// db.Users.belongsToMany(
//     db.Users, {
//         through: 'users_followers',
//         foreignKey: 'follower_id',
//         otherKey: 'following_id',
//         as: 'followers',
//     }
// );

// db.Users.belongsToMany(
//     db.Users, {
//         through: 'users_followers',
//         foreignKey: 'following_id',
//         otherKey: 'follower_id',
//         as: 'following',
//     }
// );
module.exports = db;