FROM node:lts-alpine as build-stage

# 創建應用程序目錄
WORKDIR /app

# 將package.json文件複製到應用程序目錄中
COPY package.json ./

# 安裝依賴
RUN npm install

COPY . .

# 執行構建命令
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]