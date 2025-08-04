function calcularPuntaje(dificultad) {
  const tabla = {
    fácil: 10,
    media: 20,
    difícil: 30
  };
  return tabla[dificultad] || 0;
}

module.exports = { calcularPuntaje };
