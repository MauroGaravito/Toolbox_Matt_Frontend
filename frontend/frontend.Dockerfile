# Etapa de construcción
FROM node:18 as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Etapa de producción con NGINX
FROM nginx:alpine

# (Opcional) Copiar una configuración personalizada de Nginx si la tienes
# COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
