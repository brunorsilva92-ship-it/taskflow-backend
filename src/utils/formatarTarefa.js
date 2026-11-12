function formatarTarefa(tarefa) {
    const { projetos, usuarios, prioridades, ...resto } = tarefa;
    
    return {
        ...resto,
        projeto: projetos?.nome || null,
        usuario: usuarios?.nome || null,
        prioridade: prioridades?.descricao || null,
        prioridade_cor: prioridades?.cor || null,
    };
}

module.exports = formatarTarefa;