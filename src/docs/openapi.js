const comum = require('./comum');
const tarefas = require('./tarefas.docs');
const usuarios = require('./usuarios.docs');
const projetos = require('./projetos.docs');

module.exports = {
  openapi: '3.0.3',

  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'API do TaskFlow · SENAI CTGAS-ER',
  },

  servers: [{ url: '/', description: 'Servidor atual' }],

  security: [{ bearerAuth: [] }],

  paths: { ...tarefas.paths, ...usuarios.paths, ...projetos.paths },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...comum.schemas,
      ...tarefas.schemas,
      ...usuarios.schemas,
      ...projetos.schemas,
    },
  },
};