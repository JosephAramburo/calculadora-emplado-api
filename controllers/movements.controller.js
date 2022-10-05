const Movement = require('../models/movements.model');

const HOUR_BY_DAY       = 8;
const PRICE_BY_HOUR     = 30;
const PRICE_BY_DELIVERY = 5;

async function post(req, res, next){
    let body = req.body;
    delete body.id;

    let find = await Employer.findByPk(body.employerId);

    if(find == null){
        return res.status(409).json({message : 'El empleado no existe'});
    }


    let amountByDay         = HOUR_BY_DAY * PRICE_BY_HOUR;
    let amountByDelivery    = PRICE_BY_DELIVERY * parseInt(body.quantityDeliveries);
    let bonus               = getBonusByRole(find.roleId);

    if(find.roleId == 3 && body.coverShifts == '1'){
        bonus =  getBonusByRole(find.roleId);
    }


    Movement.create(body).then(response => {

    }).catch(err => {

    });
}

function getBonusByRole(roleId){
    let bonus  = 0;

    if(roleId == 1){//CHOFER
        bonus = HOUR_BY_DAY * 10;
    }

    if(roleId == 2){//CARGADORES
        bonus = HOUR_BY_DAY * 5;
    }

    return bonus;
}

module.exports = { post }