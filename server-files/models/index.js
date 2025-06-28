const Sequelize = require('sequelize');
const creds = require("../Config")


const sequelize = new Sequelize(creds.DB, creds.USER, creds.PASSWORD, {
    host: creds.HOST,
    dialect: "mysql",
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Connection error:', err));

const db = {};
db.sequelize = sequelize;
db.models = {};


module.exports = {db};

