const fs = require('fs');
const path = require('path');
const Fastify = require('fastify');
require('dotenv').config();

// Servicios y utilidades
const swagger = require('./swagger');
const { obtenerPregunta } = require('./services/preguntasService');
const { actualizarPuntaje } = require('./services/usuariosService');
const { publicarEvento } = require('./services/eventoPublisher');
const { calcularPuntaje } = require('./utils/puntaje');

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH))
  }
});

// JWT
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET
});

// Swagger
fastify.register(swagger);

// Middleware JWT
fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Token inválido o no enviado' });
  }
});

// Health check
fastify.get('/health', async () => {
  return { status: 'OK' };
});

// Endpoint Evaluar con validación
fastify.post('/evaluar', {
  preHandler: [fastify.authenticate],
  schema: {
    body: {
      type: 'object',
      required: ['userId', 'questionId', 'respuesta', 'dificultad', 'tipo'],
      properties: {
        userId: { type: 'string' },
        questionId: { type: 'string' },
        respuesta: { type: 'string' },
        dificultad: { type: 'string', enum: ['fácil', 'media', 'difícil'] },
        tipo: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  const { userId, questionId, respuesta, dificultad, tipo } = request.body;

  const pregunta = await obtenerPregunta(questionId);
  const esCorrecta = respuesta === pregunta.respuesta_correcta;
  const puntaje = esCorrecta ? calcularPuntaje(dificultad) : 0;

  await actualizarPuntaje(userId, {
    puntajeGanado: puntaje,
    preguntaId: questionId,
    resultado: esCorrecta ? "correcto" : "incorrecto"
  });

  await publicarEvento({
    userId,
    questionId,
    resultado: esCorrecta ? "correcto" : "incorrecto",
    puntaje,
    dificultad,
    tipo,
    fecha: new Date().toISOString()
  });

  return reply.send({ resultado: esCorrecta ? "correcto" : "incorrecto", puntaje });
});

// Manejador de errores global
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.code(error.statusCode || 500).send({
    error: error.message || 'Error interno del servidor'
  });
});

// Inicio del servidor
fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' }, err => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
