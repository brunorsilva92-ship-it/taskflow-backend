const formatarTarefa = require('../utils/formatarTarefa');

function tarefaDoPrisma() {
    return {
        id: 1,
        texto: 'Tarefa 1',
        coluna: 'afazer',
        projetos: { nome: 'TaskFlow' },
        usuarios: { nome: 'Bruno Rafael' },
        prioridades: { descricao: 'Alta', cor: '#FF0000' }
    };
}

test('achata as relações no formato que o front espera', () => {
    const resultado = formatarTarefa(tarefaDoPrisma());
    expect(resultado).toEqual({
        id: 1,
        texto: 'Tarefa 1',
        coluna: 'afazer',
        projeto: 'TaskFlow',
        usuario: 'Bruno Rafael',
        prioridade: 'Alta',
        prioridade_cor: '#FF0000',
    });
});

test('deixa o campo undefined quando a relação não veio', () => {
    const tarefa = tarefaDoPrisma();
    delete tarefa.prioridades;

    const resultado = formatarTarefa(tarefa);
    expect(resultado.prioridade).toBeNull();
    expect(resultado.projeto).toBe('TaskFlow');
});

test('não altera a tarefa original', () => {
    const tarefa = tarefaDoPrisma();
    const resultado = formatarTarefa(tarefa);
    expect(resultado).not.toBe(tarefa);
    expect(tarefa).toHaveProperty('projetos', { nome: 'TaskFlow' });
});

test('lança o TypeError se receber null', () => {
    expect(() => formatarTarefa(null)).toThrow(TypeError);
});