# Imagen base oficial Node.js (producción)
FROM node:22.15.0-alpine

# Instalar git y librerías necesarias
RUN apk add --no-cache git openssl libc6-compat

# Directorio de trabajo
WORKDIR /app

# Clonar el repositorio de GitHub
RUN git clone https://github.com/Chipe30/Prueba_3.git .

# Instalar dependencias en modo producción
RUN npm install --only=production

# Crear carpeta para certificados SSL
RUN mkdir -p /app/src/ssl
RUN chmod 644 /app/src/ssl/* || true

# Variables de entorno (compatibilidad OpenSSL)
ENV NODE_OPTIONS=--openssl-legacy-provider

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
