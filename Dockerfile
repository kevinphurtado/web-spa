# Usa una imagen oficial de Node.js como base
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de paquetes e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación para producción
RUN npm run build

# --- Etapa de Producción ---
FROM node:20-alpine

WORKDIR /app

# Copia solo los archivos necesarios de la etapa de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expone el puerto en el que corre la aplicación
EXPOSE 5000

# El comando para iniciar la aplicación
CMD ["npm", "run", "start"]