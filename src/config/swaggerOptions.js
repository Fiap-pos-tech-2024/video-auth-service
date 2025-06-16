const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Video Auth Service API',
    version: '1.0.0',
    description: 'Serviço de autenticação com Cognito e MySQL',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Ambiente local'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ BearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/adapters/inbound/http/routes/*.js',
  ]
};

module.exports = swaggerJsdoc(options);
