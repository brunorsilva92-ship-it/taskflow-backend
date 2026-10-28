const prisma = require('../database/prisma');

const semSenha = {
    id: true,
    nome: true,
    email: true,
};

const usuarioModel = {
    listar: async () => {
        return prisma.usuarios.findMany({
            select: semSenha,
            orderBy: { id: 'asc' },
        });
    },

    buscar: async (id) => {
        return prisma.usuarios.findUnique({
            where: { id: Number(id) },
            select: semSenha,
        });
    },

    buscarPorEmail: async (email) => {
        return prisma.usuarios.findUnique({
            where: { email },
        });
    },

    adicionar: async ({ nome, email, senha }) => {
        return prisma.usuarios.create({
            data: { nome, email, senha_hash: senha },
            select: semSenha,
        });
    },

    atualizar: async (id, dados) => {
        const { nome, email, senha } = dados;

        try {
            return await prisma.usuarios.update({
                where: { id: Number(id) },
                data: {
                    ...(nome !== undefined && { nome }),
                    ...(email !== undefined && { email }),
                    ...(senha !== undefined && { senha_hash: senha }),
                },
                select: semSenha,
            });
        } catch (erro) {
            if (erro.code === 'P2025') {
                return null;
            }
            throw erro;
        }
    },

    remover: async (id) => {
        try {
            return await prisma.usuarios.delete({
                where: { id: Number(id) },
                select: semSenha,
            });
        } catch (erro) {
            if (erro.code === 'P2025') {
                return null;
            }
            throw erro;
        }
    },

    contarTarefas: async (id) => {
        return prisma.tarefas.count({
            where: { usuario_id: Number(id) },
        });
    },
};

module.exports = usuarioModel;