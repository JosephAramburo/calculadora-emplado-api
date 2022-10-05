const { Sequelize, Model }   = require("sequelize");
var sequelize                = require('../configs/db.config');

class TypeEmployer extends Model {}

TypeEmployer.init({
    name: {
        type      : Sequelize.STRING(100),
        allowNull : false,
        unique    : true
    },
    status: {
        type        : Sequelize.CHAR(1),
        defaultValue: 1
    },
},{ 
    sequelize,
    modelName       : 'typeEmployer',
    freezeTableName : true,
    timestamps      : false 
});

module.exports = TypeEmployer;