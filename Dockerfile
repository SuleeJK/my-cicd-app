# Pas 1: Build de l'aplicació Vue
FROM node:20-alpine as build-stage

# Rebem la variable des de GitHub Actions
ARG VITE_FOOTBALL_API_KEY
# La fem disponible per al procés de build de Vite
ENV VITE_FOOTBALL_API_KEY=$VITE_FOOTBALL_API_KEY

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Pas 2: Servidor Nginx per producció
FROM nginx:stable-alpine as production-stage

# Copiem el fitxer de configuració personalitzat per a rutes Vue (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiem els fitxers compilats des de la fase anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]