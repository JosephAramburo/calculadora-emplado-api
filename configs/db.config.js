const Sequelize = require('sequelize');

var sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        dialectOptions:{
            host: process.env.DB_HOST
        }
    }
);

module.exports = sequelize;