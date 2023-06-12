#!/bin/bash
# gcloud auth configure-docker us-central1-docker.pkg.dev
# ex： sh build-cicd.sh dev activity0606_2023-06-12-1553

#google container registry設定
PROJECT=gcp-20190903-01
SERVICE=cdp-vue-frontend

NOWTIME=$(date)

#部署環境 [讀取第一個參數]
BUILDENV=$1

#版本號碼 [讀取第二個參數]
VERSION=$2

IMAGEHOST=us-central1-docker.pkg.dev/gcp-20190903-01/cdp-backend-images
IMAGENAME=cdp_frontend_vue
IMAGEFULLPATH=$IMAGEHOST/$IMAGENAME:"$BUILDENV"_$VERSION

npm run build:$BUILDENV

echo '\n完成vue build:'$BUILDENV

ReleaseInfo="[Build-Time] $NOWTIME\r\n[Build-Env] $BUILDENV\r\n[Version] $VERSION\r\n"

#將版本號碼寫入檔案並更新git
echo "$ReleaseInfo" > release.txt

echo "\n建立image檔案..."$IMAGEFULLPATH
docker build -t $IMAGEFULLPATH .

echo "\n上傳至gcp..."
docker push $IMAGEFULLPATH

docker rmi $IMAGEFULLPATH

gcloud config set project $PROJECT
gcloud run deploy $BUILDENV-$SERVICE  --region=asia-northeast1 --image $IMAGEFULLPATH

echo "\nAll Done!!"
