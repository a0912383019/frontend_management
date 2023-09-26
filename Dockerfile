FROM node:lts-alpine as build

WORKDIR /app
COPY package*.json ./
COPY build_config/system_config_${buildenv}.js ./public/js/system_config.js
COPY nginx.conf /etc/nginx/conf.d/configfile.template


RUN npm ci
COPY . .
RUN npm run build


COPY /dist /usr/share/nginx/html



FROM nginx:alpine

WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"