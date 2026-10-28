const express = require('express');
const router = express.Router();

const projetosController = require('../controllers/projetos.controller');
const schemas = require('../middlewares/schemas');
const validar = require('../middlewares/validar');

const idValido = validar(schemas.id, 'params');

router.get('/', projetosController.listar);
router.post('/', projetosController.criar);
router.get('/:id', idValido, projetosController.buscarPorId);
router.put('/:id', idValido, projetosController.atualizar);
router.delete('/:id', idValido, projetosController.remover);

module.exports = router;