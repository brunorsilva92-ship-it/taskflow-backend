const { json, parametroId } = require('./comum');

const paths = {
  '/projetos': {
    get: {
      tags: ['Projetos'],
      summary: 'Lista todos os projetos',
      responses: {
        '200': {
          description: 'Lista de projetos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Projeto' },
              },
            },
          },
        },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
      },
    },

    post: {
      tags: ['Projetos'],
      summary: 'Cria um projeto',
      requestBody: { required: true, content: json('ProjetoEntrada') },
      responses: {
        '201': { description: 'Projeto criado', content: json('Projeto') },
        '400': { description: 'Dados inválidos ou usuário inexistente', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
      },
    },
  },

  '/projetos/{id}': {
    get: {
      tags: ['Projetos'],
      summary: 'Busca um projeto pelo id',
      parameters: [parametroId],
      responses: {
        '200': { description: 'Projeto encontrado', content: json('Projeto') },
        '400': { description: 'Id inválido', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
      },
    },

    put: {
      tags: ['Projetos'],
      summary: 'Atualiza um projeto',
      parameters: [parametroId],
      requestBody: { required: true, content: json('ProjetoAtualizacao') },
      responses: {
        '200': { description: 'Projeto atualizado', content: json('Projeto') },
        '400': { description: 'Id ou dados inválidos', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
      },
    },

    delete: {
      tags: ['Projetos'],
      summary: 'Exclui um projeto',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Projeto excluído',
          content: { 'application/json': { schema: {
            type: 'object',
            properties: {
              mensagem: { type: 'string', example: 'Projeto removido' },
              projeto: { $ref: '#/components/schemas/Projeto' },
            },
          } } },
        },
        '400': { description: 'Id inválido', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Projeto não encontrado', content: json('Erro') },
        '409': { description: 'Projeto possui tarefas associadas', content: json('Erro') },
      },
    },
  },
};

const schemas = {
  Projeto: { type: 'object', properties: {
    id:         { type: 'integer', example: 1 },
    nome:       { type: 'string', example: 'Site novo' },
    descricao:  { type: 'string', example: 'Redesign do site institucional', nullable: true },
    usuario_id: { type: 'integer', example: 1, nullable: true },
  } },

  ProjetoEntrada: { type: 'object', required: ['nome'], properties: {
    nome:      { type: 'string', example: 'Site novo' },
    descricao: { type: 'string', example: 'Redesign do site institucional' },
    usuarioId: { type: 'integer', example: 1, description: 'Se omitido, usa o id do usuário autenticado' },
  } },

  ProjetoAtualizacao: { type: 'object', properties: {
    nome:      { type: 'string', example: 'Site novo v2' },
    descricao: { type: 'string', example: 'Redesign e novo blog' },
  } },
};

module.exports = { paths, schemas };