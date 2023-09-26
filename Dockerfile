FROM node:lts-alpine as build
ARG buildenv

WORKDIR /app
RUN npm install
RUN npm run build


FROM nginx:alpine
ARG buildenv

COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /app/dist /usr/share/nginx/html

COPY /build_config/system_config_${buildenv}.js ./public/js/system_config.js

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"