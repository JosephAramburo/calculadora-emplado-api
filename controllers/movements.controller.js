const Movement  = require('../models/movements.model');
const Employer  = require('../models/employer.model');
var moment      = require('moment-timezone');

const HOUR_BY_DAY       = 8;
const PRICE_BY_HOUR     = 30;
const PRICE_BY_DELIVERY = 5;

function getById(req, res, next){
    const { id } = req.params;
    Movement.findByPk(id).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: "No se encontró registro"});
    });
}

function paginated(req, res, next){
    var query   = req.query;
    let limit   = parseInt(query.limit) || 10;
    let page    = query.currentPage     || 1;
    let queryF  = query.filter          || '';

    let options = {
        offset      : (page * limit) - limit,
        limit       : limit,
        order       : [['id', 'DESC']],
        include     : [
            // {model: Role,           attributes: ['name'], required: false},
            {model: Employer,   attributes: ['name','lastName'], required: false}
        ]
    };

    if(queryF != ''){
        // options.where = {
        //     [Op.or]:{
        //         id                  :{[Op.like] : `%${queryF}%`},
        //         name                :{[Op.like] : `%${queryF}%`},
        //     }
        // };
    }

    Movement.findAndCountAll(options).then(response => {
        return res.status(200).json(response);
    }).catch(error => {
        console.log('error', error)
        return res.status(409).json({message : 'No se encontraron datos'});
    });
}

async function post(req, res, next){
    let body = req.body;
    delete body.id;

    let find = await Employer.findByPk(body.employerId);

    if(find == null){
        return res.status(409).json({message : 'El empleado no existe'});
    }

    let date            = new Date(`${body.dateMovement}-01`);
    let exitsMovement   = await Movement.findOne({ where: { dateMovement: date.toISOString(), employerId : body.employerId } });

    if(exitsMovement != null){
        return res.status(409).json({message : 'Ya existe movimiento del empleado para esta fecha'});
    }

    if(find.roleId != 3){
        delete body.daysCovered;
        delete body.roleCoveredId;
    }

    let payments    = calculatePayments(body, find);
    let params      = {...body, ...payments};

    Movement.create(params).then(response => {
        return res.status(201).json(response);
    }).catch(err => {
        console.log(err)
        return res.status(409).json({message : 'Problemas para crear el movimiento'});
    });
}

async function put(req, res, next){
    const { id } = req.params;
    let body     = req.body;

    let find = await Movement.findByPk(id);

    if(find == null){
        return res.status(409).json({message : 'El movimiento no existe'});
    }

    let findEmp = await Employer.findByPk(body.employerId);

    if(findEmp == null){
        return res.status(409).json({message : 'El empleado no existe'});
    }

    delete body.id;

    if(find.roleId != 3){
        delete body.daysCovered;
        delete body.roleCoveredId;
    }

    let newPayments = calculatePayments(body, findEmp);
    let params      = {...body, ...newPayments};

    find.update(params).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: "No se encontró registro"});
    });
}

function calculatePayments(dataMov, employer){
    let daysForMonth        = moment(dataMov.dateMovement, "YYYY-MM").daysInMonth();
    let hoursByMonth        = daysForMonth * HOUR_BY_DAY;
    let amountByMonth       = hoursByMonth * PRICE_BY_HOUR;
    let amountByDelivery    = PRICE_BY_DELIVERY * parseInt(dataMov.quantityDeliveries);
    let bonus               = getBonusByRole(employer.roleId, hoursByMonth);

    if(employer.roleId == 3 && (dataMov.coverShifts == '1' || dataMov.coverShifts)){
        bonus = getBonusByRole(dataMov.roleCoveredId, (dataMov.daysCovered * HOUR_BY_DAY));
    }

    const sumAmounts    = amountByMonth + amountByDelivery + bonus;
    let iva             = sumAmounts > 16000 ? 12 : 9;
    let amountToPayment = sumAmounts - (sumAmounts * (iva/100));
    let amountVouchers  = employer.typeEmployerId == 1 ? sumAmounts * (4/100) : 0;

    return {
        amountByMonth   : amountByMonth,
        amountByDelivery: amountByDelivery,
        bonus           : bonus,
        amountToPayment : amountToPayment,
        sumAmounts      : sumAmounts,
        amountVouchers  : amountVouchers,
        total           : amountToPayment + amountVouchers
    };
}

function getBonusByRole(roleId, hours){
    let bonus  = 0;

    if(roleId == 1){//CHOFER
        bonus = hours * 10;
    }

    if(roleId == 2){//CARGADORES
        bonus = hours * 5;
    }

    return bonus;
}

module.exports = { getById, paginated, post, put }