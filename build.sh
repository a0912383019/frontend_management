#!/bin/bash

#google container registry設定
AREA=asia.gcr.io/gcp-20190903-01/
PROJECT=cdp_vue_frontend

#部署環境 [讀取第一個參數]
BUILDENV=$1

#版本號碼 [讀取第二個參數]
VERSION=$2

npm run build:$BUILDENV

echo '\n完成vue build:'$BUILDENV

#將版本號碼寫入檔案並更新git
echo "$VERSION" > release.txt
#git add release.txt
#git commit -m "Build Version"
#git push

echo "\n建立image檔案..."
docker build -t $AREA$PROJECT:"$BUILDENV"_"$VERSION" .

if [ "$BUILDENV" != "local" ]; then
  echo "\n上傳至gcp..."
  docker push $AREA$PROJECT:"$BUILDENV"_"$VERSION"
fi

echo "\nAll Done!!"