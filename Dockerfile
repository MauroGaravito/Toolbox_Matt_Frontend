# Etapa de construcción
FROM node:18 as builder

WORKDIR /app

# ✅ Permitir pasar la URL del backend como argumento
ARG VITE_API_URL

# ✅ Definir como variable de entorno para que Vite lo lea
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# ✅ Confirmar que la variable fue pasada correctamente
RUN echo "🔥 VITE_API_URL = $VITE_API_URL"

RUN npm run build

# Etapa de producción con NGINX
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
