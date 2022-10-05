const Employer      = require('../models/employer.model');
const Role          = require('../models/role.model');
const TypeEmployer  = require('../models/typeEmployer.model');

function get(req, res, next){
    Employer.findAll({}).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: 'Problemas al consultar empleados'})
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
            {model: Role,           attributes: ['name'], required: false},
            {model: TypeEmployer,   attributes: ['name'], required: false}
        ]
    };

    if(queryF != ''){
        options.where = {
            // estatus: 1,
            [Op.or]:{
                id                  :{[Op.like] : `%${queryF}%`},
                name                :{[Op.like] : `%${queryF}%`},
            }
        };
    }

    Employer.findAndCountAll(options).then(response => {
        return res.status(200).json(response);
    }).catch(error => {
        console.log('error', error)
        return res.status(409).json({message : 'No se encontraron datos'});
    });
}

async function post(req, res, next){
    let body        = req.body;

    delete body.id;

    let find = await Employer.findOne({ where : { name : body.name, lastName: body.lastName } });

    if(find){
        return res.status(409).json({message: 'El empleado ya se encuentra dado de alta'});
    }

    Employer.create(body).then(response => {
        return res.status(201).json(response);
    }).catch(err => {
        return res.status(409).json({message: 'Problemas para guardar un empleado'});
    });
}

module.exports = { get, paginated, post }