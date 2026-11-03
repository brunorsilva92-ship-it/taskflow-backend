const { json, parametroId } = require('./comum');

const paths = {
  '/usuarios': {
    get: {
      tags: ['Usuários'],
      summary: 'Lista todos os usuários',
      responses: {
        '200': {
          description: 'Lista de usuários',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
        },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
      },
    },

    post: {
      tags: ['Usuários'],
      summary: 'Cria um usuário',
      requestBody: { required: true, content: json('UsuarioEntrada') },
      responses: {
        '201': { description: 'Usuário criado', content: json('Usuario') },
        '400': { description: 'Dados inválidos', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '409': { description: 'E-mail já cadastrado', content: json('Erro') },
      },
    },
  },

  '/usuarios/{id}': {
    get: {
      tags: ['Usuários'],
      summary: 'Busca um usuário pelo id',
      parameters: [parametroId],
      responses: {
        '200': { description: 'Usuário encontrado', content: json('Usuario') },
        '400': { description: 'Id inválido', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Usuário não encontrado', content: json('Erro') },
      },
    },

    put: {
      tags: ['Usuários'],
      summary: 'Atualiza um usuário',
      parameters: [parametroId],
      requestBody: { required: true, content: json('UsuarioAtualizacao') },
      responses: {
        '200': { description: 'Usuário atualizado', content: json('Usuario') },
        '400': { description: 'Id ou dados inválidos', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Usuário não encontrado', content: json('Erro') },
        '409': { description: 'E-mail já está em uso por outro usuário', content: json('Erro') },
      },
    },

    delete: {
      tags: ['Usuários'],
      summary: 'Exclui um usuário',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Usuário excluído',
          content: { 'application/json': { schema: {
            type: 'object',
            properties: {
              mensagem: { type: 'string', example: 'Usuário removido' },
              usuario: { $ref: '#/components/schemas/Usuario' },
            },
          } } },
        },
        '400': { description: 'Id inválido', content: json('Erro') },
        '401': { description: 'Token ausente ou inválido', content: json('Erro') },
        '404': { description: 'Usuário não encontrado', content: json('Erro') },
        '409': { description: 'Usuário possui tarefas vinculadas', content: json('Erro') },
      },
    },
  },
};

const schemas = {
  Usuario: { type: 'object', properties: {
    id:    { type: 'integer', example: 1 },
    nome:  { type: 'string', example: 'Maria Souza' },
    email: { type: 'string', format: 'email', example: 'maria@teste.com' },
  } },

  UsuarioEntrada: { type: 'object', required: ['nome', 'email', 'senha'], properties: {
    nome:  { type: 'string', example: 'Maria Souza' },
    email: { type: 'string', format: 'email', example: 'maria@teste.com' },
    senha: { type: 'string', format: 'password', example: '123456' },
  } },

  UsuarioAtualizacao: { type: 'object', properties: {
    nome:  { type: 'string', example: 'Maria Souza Lima' },
    email: { type: 'string', format: 'email', example: 'maria.lima@teste.com' },
    senha: { type: 'string', format: 'password', example: 'novaSenha123' },
  } },
};

module.exports = { paths, schemas };