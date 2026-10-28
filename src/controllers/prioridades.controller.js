const prioridadesModel = require('../models/prioridades.model');

const prioridadesController = {
    async listar(req, res, next) {
        try {
            const prioridades = await prioridadesModel.listar();
            return res.json(prioridades);
        } catch (erro) {
            next(erro);
        }
    }
};

module.exports = prioridadesController;