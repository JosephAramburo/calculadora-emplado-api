const { Sequelize, Model }  = require("sequelize");
const EmployerModel         = require('./employer.model');
const RoleModel             = require('./role.model');
const sequelize             = require('../configs/db.config');

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
    coverShifts         : Sequelize.CHAR(1),
    dateMovement        : Sequelize.DATE,
    daysCovered         : Sequelize.INTEGER,
    roleCoveredId       : Sequelize.INTEGER,
    amountByMonth       : Sequelize.DECIMAL(16,4),
    amountByDelivery    : Sequelize.DECIMAL(16,4),
    bonus               : Sequelize.DECIMAL(16,4),
    amountToPayment     : Sequelize.DECIMAL(16,4),
    sumAmounts          : Sequelize.DECIMAL(16,4),
    amountVouchers      : Sequelize.DECIMAL(16,4),
    total               : Sequelize.DECIMAL(16,4),
    createdAt           : Sequelize.DATE
},{ 
    sequelize,
    modelName       : 'movements',
    freezeTableName : true,
    timestamps      : false 
});

Movement.hasOne(EmployerModel,  { foreignKey: 'id', sourceKey: "employerId"});
Movement.hasOne(RoleModel,      { foreignKey: 'id', sourceKey: "roleCoveredId"});

module.exports = Movement;