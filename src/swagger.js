async function swagger(fastify) {
  fastify.register(require('@fastify/swagger'), {
    routePrefix: '/docs/json',
    swagger: {
      info: {
        title: 'MS Calificación API',
        description: 'API para evaluar respuestas y puntajes',
        version: '1.0.0'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        BearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Formato: Bearer {token}'
        }
      },
      security: [{ BearerAuth: [] }],
      tags: [
        { name: 'evaluacion', description: 'Endpoints de evaluación' }
      ]
    },
    exposeRoute: true
  });

  fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'full', deepLinking: false }
  });
}

module.exports = swagger;
