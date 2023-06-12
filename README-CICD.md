# CICD前置
 - [Docker](https://www.docker.com/)
 - [安裝Google Cloud CLI](https://cloud.google.com/sdk/docs/downloads-interactive?hl=zh-cn)
 - [開通映像庫存取權限] gcloud auth configure-docker us-central1-docker.pkg.dev

 # Shell Script ......佈署-後端API
 - 佈署指令： sh build-cicd.sh ${環境} ${版號}
 - sh build-cicd.sh dev activity0606_2023-06-09-1633

# Shell Script ......佈署-對外Swagger文件
 - 佈署指令： sh build-swagger.sh ${環境} ${版號}
 - sh build-swagger.sh dev swagger_2023-06-09-1847
