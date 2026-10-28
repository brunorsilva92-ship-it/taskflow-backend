const prisma = require('../database/prisma');

const projetoModel = {
    listar: async () => {
        return prisma.projetos.findMany({
            select: {
                id: true,
                nome: true,
                descricao: true,
            },
            orderBy: { id: 'asc' },
        });
    },

    buscar: async (id) => {
        return prisma.projetos.findUnique({
            where: { id: Number(id) },
        });
    },

    adicionar: async ({ nome, descricao, usuarioId }) => {
        return prisma.projetos.create({
            data: {
                nome,
                descricao: descricao ?? null,
                usuario_id: usuarioId ? Number(usuarioId) : null,
            },
        });
    },

    atualizar: async (id, dados) => {
        const { nome, descricao, usuarioId } = dados;

        try {
            return await prisma.projetos.update({
                where: { id: Number(id) },
                data: {
                    ...(nome !== undefined && { nome }),
                    ...(descricao !== undefined && { descricao }),
                    ...(usuarioId !== undefined && { usuario_id: usuarioId ? Number(usuarioId) : null }),
                },
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
            return await prisma.projetos.delete({
                where: { id: Number(id) },
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
            where: { projeto_id: Number(id) },
        });
    },
};

module.exports = projetoModel;