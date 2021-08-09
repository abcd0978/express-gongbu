const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');
const Room = require('./room');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password,config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Room = Room;
db.Comment = Comment;

User.init(sequelize);
Room.init(sequelize);
Comment.init(sequelize);

module.exports = db;