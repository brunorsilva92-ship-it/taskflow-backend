const prisma = require('../database/prisma');

const incluirNomes = {
    projetos: { select: { nome: true } },
    usuarios: { select: { nome: true } },
    prioridades: { select: { descricao: true, cor: true } },
};

function formatarTarefa(tarefa) {
    if (!tarefa) return null;

    const { projetos, usuarios, prioridades, ...resto } = tarefa;
    return {
        ...resto,
        projeto: projetos?.nome || null,
        usuario: usuarios?.nome || null,
        prioridade: prioridades?.descricao || null,
        prioridade_cor: prioridades?.cor || null,
    };
}

const tarefaModel = {
    listar: async () => {
        const lista = await prisma.tarefas.findMany({
            include: incluirNomes,
            orderBy: { id: 'asc' },
        });
        return lista.map(formatarTarefa);
    },

    buscar: async (id) => {
        const tarefa = await prisma.tarefas.findUnique({
            where: { id: Number(id) },
            include: incluirNomes,
        });
        return tarefa ? formatarTarefa(tarefa) : null;
    },

    adicionar: async ({ texto, coluna, usuarioId, prioridadeId, projetoId }) => {
        const novaTarefa = await prisma.tarefas.create({
            data: {
                texto,
                coluna: coluna || 'afazer',
                usuario_id: usuarioId ? Number(usuarioId) : null,
                prioridade_id: prioridadeId ? Number(prioridadeId) : 2,
                projeto_id: projetoId ? Number(projetoId) : null,
            },
        });

        return tarefaModel.buscar(novaTarefa.id);
    },

    atualizar: async (id, dados) => {
        const tarefaAtual = await prisma.tarefas.findUnique({
            where: { id: Number(id) },
        });

        if (!tarefaAtual) {
            return null;
        }

        // Só mexe nas datas quando a coluna vier no body
        const datas = {};
        if (dados.coluna !== undefined) {
            datas.concluida_em = dados.coluna === 'concluido' ? new Date() : null;
            datas.iniciada_em = dados.coluna === 'andamento'
                ? (tarefaAtual.iniciada_em || new Date())
                : null;
        }

        const tarefaAtualizada = await prisma.tarefas.update({
            where: { id: Number(id) },
            data: {
                ...(dados.texto !== undefined && { texto: dados.texto }),
                ...(dados.coluna !== undefined && { coluna: dados.coluna }),
                ...(dados.usuarioId !== undefined && { usuario_id: dados.usuarioId ? Number(dados.usuarioId) : null }),
                ...(dados.prioridadeId !== undefined && { prioridade_id: dados.prioridadeId ? Number(dados.prioridadeId) : null }),
                ...(dados.projetoId !== undefined && { projeto_id: dados.projetoId ? Number(dados.projetoId) : null }),
                ...datas,
            },
            include: incluirNomes,
        });

        return formatarTarefa(tarefaAtualizada);
    },

    remover: async (id) => {
        try {
            const resultado = await prisma.tarefas.delete({
                where: { id: Number(id) },
                include: incluirNomes,
            });
            return formatarTarefa(resultado);
        } catch (erro) {
            if (erro.code === 'P2025') {
                return null; // Id não existe, controller vai tratar como 404
            }
            //console.error('Erro ao remover tarefa:', {erro});
            throw erro; // Relançar outros erros inesperados
        }
    },

};

module.exports = tarefaModel;