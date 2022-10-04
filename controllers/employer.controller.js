const Employer = require('../models/employer.model');

function get(req, res, next){
    Employer.findAll({}).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: 'Problemas al consultar empleados'})
    });
}

module.exports = { get }