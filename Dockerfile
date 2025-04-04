# 🏗️ Etapa de construcción
FROM node:18 as builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# 👇 Agrega la variable de entorno para que Vite la use en build
ENV VITE_API_URL=https://toolboxmattbackend-production.up.railway.app

RUN npm run build

# 🚀 Etapa de producción con NGINX
FROM nginx:alpine

# ✅ Copia tu configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Copia el resultado del build al directorio que sirve NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
