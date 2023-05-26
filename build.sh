#!/bin/bash

#各環境config存放路徑
CONFIGPATH=build_config/

#project用的urlList
URLLISTPATH=dist/js/
URLLISTNAME=urlList.js

#project用的system_config
SYSTEMCONFIGPATH=dist/js/
SYSTEMCONFIGNAME=system_config.js

#google container registry設定
AREA=asia.gcr.io/gcp-20190903-01/
PROJECT=cdp_vue_frontend

#部署環境 [讀取第一個參數]
BUILDENV=$1

#版本號碼 [讀取第二個參數]
VERSION=$2

if [ -d "dist/" ]; then rm -Rf dist/; fi

npm run build:$BUILDENV

echo '\n完成vue build:'$BUILDENV

#處理各環境對應config檔案
echo "\n切換為 $BUILDENV 環境config"
#先刪除經過build完後打包到dist/js內的本地設定檔
rm -r dist/js/${SYSTEMCONFIGNAME}

#將對應環境的設定檔搬到dist/js內
# if [[ ! $(cp -v "$CONFIGPATH${URLLISTNAME%.*}_$BUILDENV.${URLLISTNAME##*.}" "$URLLISTPATH$URLLISTNAME") ]] \
if [[ ! $(cp -v "$CONFIGPATH${SYSTEMCONFIGNAME%.*}_$BUILDENV.${SYSTEMCONFIGNAME##*.}" "$SYSTEMCONFIGPATH$SYSTEMCONFIGNAME") ]]; \
then
  exit 0
else
  echo "config切換成功"
fi


#將版本號碼寫入檔案並更新git
echo "$VERSION" > release.txt
git add release.txt
git commit -m "Build Version"
git push

echo "\n建立image檔案..."
docker build -t $AREA$PROJECT:"$BUILDENV"_"$VERSION" .

if [ "$BUILDENV" != "local" ]; then
  echo "\n上傳至gcp..."
  docker push $AREA$PROJECT:"$BUILDENV"_"$VERSION"
fi

echo "\nAll Done!!"