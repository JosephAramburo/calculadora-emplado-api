const TypeEmployer = require('../models/typeEmployer.model');

function get(req, res, next){
    let filtersQuery    = req.query || null;
    let filters         = { status: 1 };

    if(filtersQuery != null && filtersQuery.status){
        filters.status = filtersQuery.status;
    }

    TypeEmployer.findAll(filters).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(409).json({message: 'Problemas al consultar los tipos de empleados'})
    });
}

module.exports = { get }