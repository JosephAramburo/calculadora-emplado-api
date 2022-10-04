const { Sequelize, Model }   = require("sequelize");
var sequelize                = require('../configs/db.config');

class Role extends Model {}

Role.init({
    name: {
        type      : Sequelize.STRING(100),
        allowNull : false
    },
    status: {
        type        : Sequelize.CHAR(1),
        defaultValue: 1
    },
},{ 
    sequelize,
    modelName       : 'role',
    freezeTableName : true,
    timestamps      : false 
});

module.exports = Role;