const { Sequelize, Model }   = require("sequelize");
const EmployerModel          = require('./employer.model');
const sequelize              = require('../configs/db.config');

class Movement extends Model {}

Movement.init({
    employerId: {
        type      : Sequelize.INTEGER,
        allowNull : false
    },
    quantityDeliveries: {
        type      : Sequelize.INTEGER,
        allowNull : false
    },
    quantityDaysShifts  :  Sequelize.INTEGER,
    coverShifts         : Sequelize.CHAR(1),
    dateMovement        : Sequelize.DATE,
    createdAt           : Sequelize.DATE
},{ 
    sequelize,
    modelName       : 'movements',
    freezeTableName : true,
    timestamps      : false 
});

Movement.hasOne(EmployerModel, { foreignKey: 'id', sourceKey: "employerId"});

module.exports = Movement;