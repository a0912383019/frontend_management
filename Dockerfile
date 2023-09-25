#FROM nginx:alpine
# 將 nginx.conf 文件複製到容器中的 /etc/nginx 目錄下
# COPY nginx.conf /etc/nginx/nginx.conf

#COPY /dist /usr/share/nginx/html

# vue.js environment
# FROM node:14-alpine as vue-build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY ./ .
# RUN npm build

# server environment
FROM nginx:alpine
ARG buildenv
COPY nginx.conf /etc/nginx/conf.d/configfile.template
COPY /dist /usr/share/nginx/html

COPY /build_config/system_config_${buildenv}.js ./public/js/system_config.js

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"