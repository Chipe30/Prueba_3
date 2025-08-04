const axios = require('axios');

async function obtenerPregunta(id) {
  try {
    const response = await axios.get(`${process.env.MS_PREGUNTAS_URL}/preguntas/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.SERVICE_TOKEN}`
      }
    });
    return response.data; // Asegúrate que aquí venga la respuesta_correcta
  } catch (error) {
    console.error('Error obteniendo pregunta:', error.message);
    throw new Error('No se pudo obtener la pregunta');
  }
}

module.exports = { obtenerPregunta };
