const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');

function pegarErro(funcao) {
    try {
        funcao();
    } catch (erro) {
        return erro;
    }
}

function tarefaValida() {
    return {
        texto: 'Revisar o plano de teste',
        coluna: 'afazer',
        usuarioId: 1,
        projetoId: 1,
        prioridadeId: 2,
    };
}

describe('validar', () => {
    test('chama o next quando os dados estão certos', () => {
        const middleware = validar(schemas.tarefa);
        const req = { body: tarefaValida() };
        const next = jest.fn();

        middleware(req, {}, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
    });

    test('sem body: 400 com um detalhe por campo obrigatório', () => {
        const middleware = validar(schemas.tarefa);
        const req = {};
        const next = jest.fn();

        const erro = pegarErro(() => middleware(req, {}, next));

        expect(erro.status).toBe(400);
        expect(erro.message).toBe('Dados inválidos');
        expect(erro.detalhes).toEqual([
            "O campo 'texto' é obrigatório.",
            "O campo 'coluna' é obrigatório.",
            "O campo 'usuarioId' é obrigatório.",
            "O campo 'prioridadeId' é obrigatório.",
            "O campo 'projetoId' é obrigatório.",
        ]);
        expect(next).not.toHaveBeenCalled();
    });

    test('coluna fora da lista: 400 com um detalhe sobre a coluna', () => {
        const middleware = validar(schemas.tarefa);
        const req = { body: { ...tarefaValida(), coluna: 'feito' } };
        const next = jest.fn();

        const erro = pegarErro(() => middleware(req, {}, next));

        expect(erro).toBeDefined();
        expect(erro.status).toBe(400);
        expect(erro.detalhes).toHaveLength(1);
        expect(erro.detalhes[0]).toContain("'coluna'");
        expect(next).not.toHaveBeenCalled();
    });

    test('id da URL: aceita "7" e barra "abc"', () => {
        const middleware = validar(schemas.id, 'params');
        const nextBom = jest.fn();
        const nextRuim = jest.fn();

        middleware({ params: { id: '7' } }, {}, nextBom);
        const erro = pegarErro(() =>
            middleware({ params: { id: 'abc' } }, {}, nextRuim)
        );

        expect(nextBom).toHaveBeenCalledTimes(1);
        expect(erro.detalhes).toEqual([
            "O campo 'id' deve ser do tipo inteiro.",
        ]);
        expect(nextRuim).not.toHaveBeenCalled();
    });

    test('campo opcional não enviado não gera erro', () => {
        const middleware = validar(schemas.projeto);
        const req = { body: { nome: 'TaskFlow' } };
        const next = jest.fn();

        middleware(req, {}, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});