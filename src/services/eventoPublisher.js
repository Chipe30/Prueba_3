async function publicarEvento(payload) {
  console.log("Evento publicado:", JSON.stringify(payload, null, 2));
  // Aquí podría ir Kafka, RabbitMQ, etc.
}

module.exports = { publicarEvento };
