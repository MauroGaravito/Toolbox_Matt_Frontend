# Etapa de construcción
FROM node:18 as builder

WORKDIR /app

# Copiamos los archivos necesarios
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# ⚠️ Inyectamos la variable manualmente durante el build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
