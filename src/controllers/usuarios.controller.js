const criarErro = require('../utils/criarErro');
const usuarioModel = require('../models/usuarios.model');

const usuariosController = {

  // GET /usuarios — listar todos
  async listar(req, res) {
    res.json(await usuarioModel.listar());
  },

  // GET /usuarios/:id — buscar por ID
  async buscarPorId(req, res) {
    const usuario = await usuarioModel.buscar(parseInt(req.params.id));
    if (!usuario)
      throw criarErro(404, 'Usuário não encontrado');
    res.json(usuario);
  },

  // POST /usuarios — criar novo usuário
  async criar(req, res) {
    const { nome, email, senha } = req.body;
    res.status(201).json(await usuarioModel.adicionar({ nome, email, senha }));
  },

  // PUT /usuarios/:id — atualizar usuário
  async atualizar(req, res) {
    const atualizado = await usuarioModel.atualizar(parseInt(req.params.id), req.body);
    if (!atualizado)
      throw criarErro(404, 'Usuário não encontrado');
    res.json(atualizado);
  },

  // DELETE /usuarios/:id — remover usuário
  async remover(req, res) {
    const id = parseInt(req.params.id);

    const usuario = await usuarioModel.buscar(id);
    if (!usuario)
      throw criarErro(404, 'Usuário não encontrado');

    const totalTarefas = await usuarioModel.contarTarefas(id);
    if (totalTarefas > 0)
      throw criarErro(409, 'Usuário possui tarefas vinculadas. Remova as tarefas antes de deletar o usuário.');

    const removido = await usuarioModel.remover(id);
    res.json({ mensagem: 'Usuário removido', usuario: removido });
  },

};

module.exports = usuariosController;