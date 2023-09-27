# Gitlab-Runner
sh CICD-TEST/build-image.sh
git commit -a -m "$(date +"%m%d-%H%M")_commit";git pull;git push
[前端-官網(VUE)-測試站](https://dev-cdp-v.caino.club/release.txt)
[前端-官網(VUE)-DEMO站](https://demo-cdp-v.caino.club/release.txt)
[前端-官網(VUE)-正式站](https://cdp-v.caino.club/release.txt)
[前端-官網(VUE)-IT站](https://it-cdp-vue-frontend-z45yv6qs7q-an.a.run.app/release.txt)

# CICD 前置
- [Docker](https://www.docker.com/)
- [安裝 Google Cloud CLI](https://cloud.google.com/sdk/docs/downloads-interactive?hl=zh-cn)
- [開通映像庫存取權限] gcloud auth configure-docker us-central1-docker.pkg.dev

# Shell Script ......佈署

- 佈署指令： sh build-cicd.sh ${環境} ${版號}
- sh build-cicd.sh dev 39395ab

# 環境

- 開發：dev
- 測試(QA)：demo
- 正式：prod
