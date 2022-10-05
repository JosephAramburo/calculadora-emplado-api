const Movement = require('../models/movements.model');

async function post(req, res, next){
    let body = req.body;
    delete body.id;

    let find = await Employer.findByPk(body.employerId);

    if(find == null){
        return res.status(409).json({message : 'El empleado no existe'});
    }


    let hourByDay           = 8;
    let amountByDay         = hourByDay * 30;
    let amountByDelivery    = 5 * parseInt(body.quantityDeliveries);
    let bonus               = 0;

    if(find.roleId == 1){//CHOFER
        bonus = hourByDay * 10;
    }

    if(find.roleId == 1){//CARGADORES
        bonus = hourByDay * 5;
    }


    Movement.create(body).then(response => {

    }).catch(err => {

    });
}

module.exports = { post }