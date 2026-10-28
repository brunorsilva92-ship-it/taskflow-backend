const prisma = require('../database/prisma');

const prioridadesModel = {
    listar: async () => {
        return prisma.prioridades.findMany({
            where: { ativo: true },
            select: { id: true, descricao: true, cor: true, ativo: true },
            orderBy: { id: 'asc' },
        });
    }
};

module.exports = prioridadesModel;