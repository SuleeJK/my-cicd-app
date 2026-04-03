# Stage 1: Build de l'app amb Node.js
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copia les dependències i les instal·la
COPY package*.json ./
RUN npm install

# Copia tot el codi font
COPY . .

# Argument que s'injecta durant el docker build
# Permet que Vite tingui accés a la variable durant el build
ARG VITE_FOOTBALL_API_KEY
ENV VITE_FOOTBALL_API_KEY=$VITE_FOOTBALL_API_KEY

# Genera la versió de producció
RUN npm run build

# Stage 2: Serveix els fitxers estàtics amb Nginx
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]