const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefas.controller');

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
const autenticar = require('../middlewares/autenticar');

const idValido = validar(schemas.id, "params");

router.get('/', tarefasController.listar);
router.post('/', autenticar, validar(schemas.tarefa), tarefasController.criar);
router.get('/:id', idValido, tarefasController.buscarPorId);
router.put('/:id', idValido, validar(schemas.tarefa), tarefasController.atualizar);
router.delete('/:id', idValido, tarefasController.remover);

module.exports = router;