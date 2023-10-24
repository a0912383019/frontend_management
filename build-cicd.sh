#!/bin/bash
# gcloud auth configure-docker us-central1-docker.pkg.dev
# ex： sh build-cicd.sh demo 1024-1121

#google container registry設定
PROJECT=gcp-20190903-01
gcloud config set project $PROJECT

SERVICE=cdp-vue-frontend

NOWTIME=$(date +"%Y%m%d-%H%M")

#部署環境 [讀取第一個參數]
BUILDENV=$1

#版本號碼 [讀取第二個參數]
VERSION=$2

#各環境config存放路徑
CONFIGPATH=build_config/

#project用的system_config
SYSTEMCONFIGPATH=public/js/
SYSTEMCONFIGNAME=system_config.js

#如果有dist資料夾，刪除dist資料夾
if [ -d "dist/" ]; then rm -Rf dist/; fi

#處理各環境對應config檔案
echo "\n切換為 $BUILDENV 環境config"
#先刪除經過public/js內的本地設定檔
mkdir public/js
rm -r public/js/${SYSTEMCONFIGNAME}

if [[ ! $(cp -v "$CONFIGPATH${SYSTEMCONFIGNAME%.*}_$BUILDENV.${SYSTEMCONFIGNAME##*.}" "$SYSTEMCONFIGPATH$SYSTEMCONFIGNAME") ]]; \
then
  exit 0
else
  echo "config切換成功"
fi

IMAGEHOST=us-central1-docker.pkg.dev/gcp-20190903-01/cdp-backend-images
IMAGENAME=cdp_frontend_vue
IMAGEFULLPATH=$IMAGEHOST/$IMAGENAME:"$BUILDENV"_$VERSION
IMAGEFULLPATHDEPLOY=$IMAGEHOST/$IMAGENAME:$BUILDENV

npm run build:$BUILDENV

echo '\n完成vue build:'$BUILDENV

ReleaseInfo="[Build-Time] $NOWTIME\r\n[Build-Env] $BUILDENV\r\n[Version] $VERSION\r\n"

#將版本號碼寫入檔案並更新git
echo "$ReleaseInfo" > dist/release.txt
echo "$VERSION" > release.txt
git add release.txt
git commit -m "Build Version"
git push

echo "\n建立image檔案..."$IMAGEFULLPATH
docker build --build-arg=buildenv=$BUILDENV -t $IMAGEFULLPATH -t $IMAGEFULLPATHDEPLOY .

echo "\n上傳至gcp..."
docker push $IMAGEFULLPATH
docker rmi $IMAGEFULLPATH

docker push $IMAGEFULLPATHDEPLOY
docker rmi $IMAGEFULLPATHDEPLOY

gcloud run deploy $BUILDENV-$SERVICE  --region=us-central1 --image $IMAGEFULLPATH

echo "\nAll Done!!"
