FROM node:12.18.1 as build-env
ARG buildenv

WORKDIR /app

COPY . .
COPY /build_config/system_config_${buildenv}.js ./public/js/system_config.js

RUN npm install
RUN npm run build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build-env  /app/dist /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"