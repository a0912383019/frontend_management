FROM node:alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 加入project.toml修正錯誤∶ Could not load /app/src/components/.../*.vue
RUN npm run build:prod


FROM nginx:alpine

COPY --from=build nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"