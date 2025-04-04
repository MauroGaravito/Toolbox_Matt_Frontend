# 🏗️ Etapa de construcción
FROM node:18 as builder

WORKDIR /app

# Instala dependencias
COPY frontend/package*.json ./
RUN npm install

# Copia el resto del código
COPY frontend/ ./

# ✅ Variable de entorno para Vite
ENV VITE_API_URL=https://toolboxmattbackend-production.up.railway.app

# Compila el frontend
RUN npm run build

# 🚀 Etapa de producción con NGINX
FROM nginx:alpine

# Copia el resultado del build al directorio que sirve NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
