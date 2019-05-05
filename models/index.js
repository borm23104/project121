const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db ={};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Room = require('./room')(sequelize, Sequelize);
db.Building = require('./building')(sequelize, Sequelize);
db.Reservation = require('./reservation')(sequelize, Sequelize);
db.Favorite = require('./favorite')(sequelize, Sequelize);
db.Admin = require('./admin')(sequelize, Sequelize);

//1:N관계
db.Building.hasMany(db.Room, {foreignKey:'buildingId'});
db.Room.belongsTo(db.Building, {foreignKey:'buildingId'});

//N:M
db.User.belongsToMany(db.Room, {through:'Reservations', foreignKey:'roomId'});
db.Room.belongsToMany(db.User, {through:'Reservations', foreignKey:'userId'});


module.exports = db;

