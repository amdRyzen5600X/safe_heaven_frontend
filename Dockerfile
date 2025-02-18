FROM node:23-slim AS build

WORKDIR /app
COPY package*.json ./

ARG HOST
ARG PORT

ENV VITE_BACKEND_HOST $HOST
ENV VITE_BACKEND_PORT $PORT

RUN npm ci
COPY . ./

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY server.key /etc/nginx/certs/server.key
COPY server.crt /etc/nginx/certs/server.crt

EXPOSE 80
EXPOSE 443

