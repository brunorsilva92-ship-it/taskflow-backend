const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const pool = require('./src/database/db');
const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');

const tarefasRoutes = require('./src/routes/tarefas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const projetosRoutes = require('./src/routes/projetos.routes');
const prioridadesRoutes = require('./src/routes/prioridades.routes');

const authRoutes = require('./src/routes/auth.routes');

const autenticar = require('./src/middlewares/autenticar');
const tratarErros = require('./src/middlewares/erro');
const criarErro = require('./src/utils/criarErro');

const app = express();
const PORTA = process.env.PORT || 3000;

pool.query('select now()', (err, res) => {
    if (err) console.error('erro ao conectar', err.message);
    else
       console.log('Banco conectado', res.rows[0].now)
})

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

app.use(express.json());
app.use(validarContentType);
app.use(logger);

app.use('/auth', authRoutes);

app.use('/tarefas', autenticar, tarefasRoutes);
app.use('/usuarios', autenticar, usuariosRoutes);
app.use('/projetos', autenticar, projetosRoutes);
app.use('/prioridades', autenticar, prioridadesRoutes);

app.use((req, res) => {
    const rota = `${req.method} ${req.originalUrl}`;
    throw criarErro(404, `Rota ${rota} não encontrada`);
});

app.use(tratarErros);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORTA, () => {
        console.log(`Servidor rodando em http://localhost:${PORTA}`);
    });
}

module.exports = app;