const Employer      = require('../models/employer.model');
const Role          = require('../models/role.model');
const TypeEmployer  = require('../models/typeEmployer.model');
const { Op }        = require('sequelize');

function get(req, res, next){
    Employer.findAll({}).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: 'Problemas al consultar empleados'})
    });
}

function getById(req, res, next){
    const { id } = req.params;
    Employer.findByPk(id).then(response => {
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
            {model: Role,           attributes: ['name'], required: false},
            {model: TypeEmployer,   attributes: ['name'], required: false}
        ]
    };

    if(queryF != ''){
        options.where = {
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

function autocomplete(req, res, next){
    const queryParams = req.query;

    let filter = queryParams.filter || '';

    if(filter == ''){
        return res.status(200).json([]);
    }

    Employer.findAll({
        attributes: ['id','name', 'lastName'],
        where: { 
            status: 1,
            [Op.or]:{
                id      : {[Op.like] : `%${filter}%`},
                name    : {[Op.like] : `%${filter}%`},
                lastName: {[Op.like] : `%${filter}%`},
            }
        },
        offset      : 0,
        limit       : 20
    }).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        console.log(err)
        return res.status(409).json({message : 'Problemas para buscar al empleado, verificar la información por favor'});
    });
}

function getByIdDetail(req, res, next){
    const { id } = req.params;
    Employer.findByPk(id,{
        include     : [
            {model: Role,           attributes: ['name'], required: false},
            {model: TypeEmployer,   attributes: ['name'], required: false}
        ]
    }).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: "No se encontró registro"});
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

async function put(req, res, next){
    const { id } = req.params;
    let body     = req.body;

    let find = await Employer.findByPk(id);

    if(find == null){
        return res.status(409).json({message : 'El empleado no existe'});
    }

    delete body.id;

    find.update(body).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: "No se encontró registro"});
    });
}

async function deleted(req, res, next){
    const { id } = req.params;

    let find = await Employer.findByPk(id);

    if(find == null){
        return res.status(409).json({message : 'El empleado no existe'});
    }

    find.update({status: '0'}).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: "No se encontró registro"});
    });
}

module.exports = { get, getById, getByIdDetail, autocomplete, paginated, post, put, deleted }