FROM node:alpine as build

ARG buildenv

COPY package*.json ./
RUN npm install

COPY . .
COPY build_config/system_config_${buildenv}.js ./public/js/system_config.js

RUN npm run build

FROM nginx:alpine

COPY --from=build nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /dist /usr/share/nginx/html
COPY --from=build release.txt /usr/share/nginx/html


ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"