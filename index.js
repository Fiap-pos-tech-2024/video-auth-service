require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const MysqlUserRepository = require('./src/adapters/outbound/mysql/MysqlUserRepository');
const { metricsMiddleware, register } = require('./src/config/prometheus');
const verifyToken = require('./src/adapters/inbound/http/middlewares/verifyToken');

const app = express();
const PORT = process.env.PORT || 3000;
const SWAGGER_URL = process.env.SWAGGER_URL || `http://localhost:${PORT}`;

// Middleware Prometheus
app.use(metricsMiddleware);

// Middleware para JSON
app.use(express.json());

// Rotas protegidas
app.use('/api/usuarios', verifyToken, require('./src/adapters/inbound/http/routes/userRoutes'));

// Rotas públicas
app.use('/api/auth', require('./src/adapters/inbound/http/routes/authRoutes'));

// Swagger/OpenAPI
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Video Auth Service API',
    version: '1.0.0',
    description: 'API de autenticação com AWS Cognito e MySQL',
  },
  servers: [
    {
      url: `${SWAGGER_URL}`,
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/adapters/inbound/http/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/auth-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Healthcheck & métricas
app.get('/health', (_req, res) => res.status(200).send('OK'));

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Inicialização do servidor
app.listen(PORT, async () => {
  console.log(`✅ Auth Service rodando na porta ${PORT}`);
  console.log(`📄 Swagger disponível em: ${SWAGGER_URL}/auth-docs`);

  // Conexão com o banco e sync de modelo
  const repo = new MysqlUserRepository();
  let attempts = 0;
  const maxAttempts = 10;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  while (attempts < maxAttempts) {
    try {
      const conn = await repo.pool.getConnection();
      await conn.ping();
      conn.release();

      console.log('🟢 Conectado ao banco de dados MySQL com sucesso');

      const { UserModel } = require('./src/adapters/outbound/cognito/repositories/UserModel');
      await UserModel.sync({ alter: true });

      break;
    } catch (err) {
      attempts++;
      console.log(`🔁 Tentativa ${attempts}/${maxAttempts} falhou: ${err.message}`);
      await delay(2000);
    }
  }

  if (attempts === maxAttempts) {
    console.error('❌ Não foi possível conectar ao MySQL após várias tentativas. Finalizando...');
    process.exit(1);
  }
});
