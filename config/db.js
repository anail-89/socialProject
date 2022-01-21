// const creds = {
//     development: {
//         username: 'postgres',
//         password: 'postgres',
//         database: 'test8',
//         host: 'localhost',
//         dialect: 'postgresql'
//     },
//     test: {
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         host: process.env.DB_HOSTNAME,
//         dialect: 'postgresql'
//     },
//     production: {
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         host: process.env.DB_HOSTNAME,
//         dialect: 'postgresql'
//     }
// };

// module.exports = creds;

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// //Models/tables
// db.users = require('../models/users.js')(sequelize, Sequelize);
// //db.comments = require('../models/comments.js')(sequelize, Sequelize);
// db.posts = require('../models/posts.js')(sequelize, Sequelize);

// //Relations 
// //db.comments.belongsTo(db.posts);
// //db.posts.hasMany(db.comments);
// db.posts.belongsTo(db.users);
// db.users.hasMany(db.posts);

// Object.keys(db).forEach((modelName) => {
//     if ('associate' in db[modelName]) {
//         db[modelName].associate(db);
//     }
// });
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('test8', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgresql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
module.exports = db;