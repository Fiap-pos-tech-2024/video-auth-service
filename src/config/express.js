const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../adapters/inbound/http/routes/authRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(bodyParser.json());

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Video Auth Service API',
      version: '1.0.0',
      description: 'Autenticação de usuários com Cognito',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server'
      }
    ]
  },
  apis: ['./src/adapters/inbound/http/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/auth-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/auth', authRoutes);

// Healthcheck
app.get('/health', (_req, res) => res.status(200).send('OK'));

module.exports = app;
