const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("postgres", "postgres", "fork1122gg", {
  host: "localhost",
  dialect: "postgres",
  logging:false
});

module.exports = sequelize;
