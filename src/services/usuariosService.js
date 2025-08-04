const axios = require('axios');

async function actualizarPuntaje(userId, datos) {
  try {
    await axios.patch(`${process.env.MS_USUARIOS_URL}/usuarios/${userId}/puntaje`, datos, {
      headers: {
        Authorization: `Bearer ${process.env.SERVICE_TOKEN}`
      }
    });
    console.log(`Puntaje actualizado para usuario ${userId}`);
  } catch (error) {
    console.error('Error actualizando puntaje:', error.message);
    throw new Error('No se pudo actualizar el puntaje');
  }
}

module.exports = { actualizarPuntaje };
