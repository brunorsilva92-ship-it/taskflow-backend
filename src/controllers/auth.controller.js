const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarios.model');

const authController = {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
            }

            const usuario = await usuarioModel.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            if (usuario.senha_hash !== senha) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { id: usuario.id, nome: usuario.nome },
                process.env.JWT_SECRET || 'chave_secreta_padrao',
                { expiresIn: '8h' }
            );

            return res.json({ token, usuario: { id: usuario.id, nome: usuario.nome } });
        } catch (erro) {
            console.error('Erro ao realizar login:', erro);
            return res.status(500).json({ erro: 'Erro interno no servidor' });
        }
    }
};

module.exports = authController;