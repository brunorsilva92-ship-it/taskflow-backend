const criarErro = require('../utils/criarErro');
const projetoModel = require('../models/projetos.model');

const projetosController = {

  // GET /projetos — listar todos
  async listar(req, res) {
    res.json(await projetoModel.listar());
  },

  // GET /projetos/:id — buscar por ID
  async buscarPorId(req, res) {
    const projeto = await projetoModel.buscar(parseInt(req.params.id));
    if (!projeto)
      throw criarErro(404, 'Projeto não encontrado');
    res.json(projeto);
  },

  // POST /projetos — criar novo projeto
  async criar(req, res) {
    const { nome, descricao, usuarioId } = req.body;
    const idUsuario = usuarioId || req.usuario?.id;

    if (!nome)
      throw criarErro(400, 'O campo nome é obrigatório');

    if (!idUsuario)
      throw criarErro(400, 'O campo usuarioId é obrigatório para vincular o projeto a um usuário');

    const novoProjeto = await projetoModel.adicionar({
      nome,
      descricao,
      usuarioId: Number(idUsuario),
    });
    res.status(201).json(novoProjeto);
  },

  // PUT /projetos/:id — atualizar projeto
  async atualizar(req, res) {
    const id = parseInt(req.params.id);
    const { nome, descricao } = req.body;

    const atualizado = await projetoModel.atualizar(id, { nome, descricao });
    if (!atualizado)
      throw criarErro(404, 'Projeto não encontrado');
    res.json(atualizado);
  },

  // DELETE /projetos/:id — remover projeto
  async remover(req, res) {
    const id = parseInt(req.params.id);

    const projeto = await projetoModel.buscar(id);
    if (!projeto)
      throw criarErro(404, 'Projeto não encontrado');

    const totalTarefas = await projetoModel.contarTarefas(id);
    if (totalTarefas > 0)
      throw criarErro(409, 'O projeto possui tarefas associadas. Remova as tarefas antes de excluí-lo.');

    const removido = await projetoModel.remover(id);
    res.json({ mensagem: 'Projeto removido', projeto: removido });
  },

};

module.exports = projetosController;