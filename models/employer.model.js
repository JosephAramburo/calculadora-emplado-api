const { Sequelize, Model }   = require("sequelize");
const RoleModel              = require('./role.model');
const TypeEmployerModel      = require('./typeEmployer.model');
const sequelize              = require('../configs/db.config');

class Employer extends Model {}

Employer.init({
    name: {
        type      : Sequelize.STRING(60),
        allowNull : false
    },
    lastName: {
        type      : Sequelize.STRING(60),
        allowNull : false
    },
    typeEmployerId: {
        type      : Sequelize.INTEGER,
        allowNull : false
    },
    roleId: {
        type      : Sequelize.INTEGER,
        allowNull : false
    },
    createdAt   : Sequelize.DATE,
    updatedAt   : Sequelize.DATE,
    status: {
        type        : Sequelize.CHAR(1),
        defaultValue: 1
    },
},{ 
    sequelize,
    modelName       : 'employer',
    freezeTableName : true,
    timestamps      : false 
});

Employer.hasOne(RoleModel,          { foreignKey: 'id', sourceKey: "roleId"});
Employer.hasOne(TypeEmployerModel,  { foreignKey: 'id', sourceKey: "typeEmployerId"});

module.exports = Employer;