const criarErro = require('../utils/criarErro');
const schemas = require('./schemas');

// src/middlewares/validar.js
function validar(schema, origem = 'body') {
    return function (req, res, next) {
        const dados = req[origem] || {};
        const erros = [];

        for (const [campo, regras] of Object.entries(schema)) {
            const valor = dados[campo];
            const ausente = valor === undefined || valor === null || valor === '';

            if (regras.obrigatorio && ausente) {
                erros.push(`O campo '${campo}' é obrigatório.`);
                continue;
            }

            if (ausente) continue;

            if (regras.tipo === 'inteiro') {
                const numero = Number(valor);
                if (isNaN(numero) || !Number.isInteger(numero)) {
                    erros.push(`O campo '${campo}' deve ser do tipo inteiro.`);
                }
            } else if (regras.tipo && typeof valor !== regras.tipo) {
                erros.push(`O campo '${campo}' deve ser do tipo ${regras.tipo}.`);
            }

            if (regras.maxLength && valor.length > regras.maxLength) {
                erros.push(`O campo '${campo}' deve ter no máximo ${regras.maxLength} caracteres.`);
            }
        }

        if (erros.length > 0) {
            throw criarErro(400, 'Dados inválidos', erros);
        }

        next();
    };
}

module.exports = validar;