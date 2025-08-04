# 1. Imagen oficial Node.js optimizada para producción (alpine para ligereza)
FROM node:22.15.0-alpine

# 2. Instalar dependencias necesarias para SSL y compatibilidad
RUN apk add --no-cache openssl libc6-compat

# 3. Definir directorio de trabajo
WORKDIR /app

# 4. Copiar solo archivos de dependencias para aprovechar cache
COPY package*.json ./

# 5. Instalar dependencias en modo producción
RUN npm ci --only=production

# 6. Copiar el código fuente restante
COPY . .

# 7. Crear carpeta para certificados (en caso de que se monte volumen vacío)
RUN mkdir -p /app/src/ssl

# 8. Ajustar permisos (evitar problemas al leer certificados)
RUN chmod 644 /app/src/ssl/* || true

# 9. Variable para compatibilidad OpenSSL legacy (si se usa SSL)
ENV NODE_OPTIONS=--openssl-legacy-provider

# 10. Exponer el puerto que usa el microservicio
EXPOSE 3000

# 11. Comando para iniciar el microservicio
CMD ["npm", "start"]
