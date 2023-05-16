<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/system.js'
import errorText from '@/components/errorText.vue'
import { ElNotification } from 'element-plus'

const router = useRouter()

const test = import.meta.env.VITE_LOCAL_IP
console.log('目前環境：', test)

const failMsg = reactive({
  msg1: {
    isShow: false,
    text: '密碼錯誤或無此帳戶'
  },
  msg2: {
    isShow: false,
    text: '系統繁忙中，請稍後再試'
  },
  msg3: {
    isShow: false,
    text: '瀏覽器不支援html5功能，請更換瀏覽器後重新登入'
  },
  msg4: {
    isShow: false,
    text: '帳戶已停用，請聯絡管理員啟用'
  }
})

const hideErrorMsg = () => {
  //關閉所有錯誤訊息
  Object.values(failMsg).forEach((item) => {
    item['isShow'] = false
  })
}

//google login
const googleLoginCallback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  handleLogin({ credential: response.credential })
    .then((res) => {
      //  登入成功取得api access_token後才導至首頁
      router.push({ name: 'Home' })

      let { user_name } = JSON.parse(sessionStorage.user_info)
      ElNotification({
        title: '',
        message: `Hello, ${user_name}`,
        type: 'success'
      })
      console.log('success>>', res)
    })
    .catch((err) => {
      console.log('error>>', err)
    })
  // console.log('Handle the response', response)
}

const handleLogin = ({ credential }) => {
  // console.log('credential', credential)
  hideErrorMsg()
  return new Promise(async (resolve, reject) => {
    try {
      const reslut = await login({
        id_token: credential
      })
      console.log(reslut)
      if (Storage !== undefined) {
        //判斷瀏覽器是否有支援web storage
        if (reslut.data.status.return_code === '0000') {
          let user_info_entity = {
            user_id: reslut.data.user_id,
            user_name: reslut.data.user_name,
            user_type: reslut.data.user_type,
            access_hall: reslut.data.access_hall,
            user_picture: reslut.data.picture
          }
          // console.log('user_info_entity', user_info_entity)
          sessionStorage.user_info = JSON.stringify(user_info_entity)

          // 將取得的access_token存入sessionStorage
          sessionStorage.access_token = reslut.data.token_type + ' ' + reslut.data.access_token
          resolve()
        } else {
          //若為其他錯誤，顯示系統繁忙中
          failMsg['msg2']['isShow'] = true
          reject()
        }
      } else {
        failMsg['msg3']['isShow'] = true
        reject()
      }
    } catch (error) {
      console.log('error', error)
      const { status, statusText } = error.response
      if (status === 401) {
        if (statusText === 'Unauthorized') {
          failMsg['msg1']['isShow'] = true //若回傳的錯誤訊息為Unauthorized，顯示登入失敗錯誤訊息
        } else if (statusText === 'Suspended') {
          failMsg['msg4']['isShow'] = true //若回傳的錯誤訊息為Suspended，顯示帳戶未啟用錯誤訊息
        } else {
          failMsg['msg1']['isShow'] = true
        }
      } else {
        failMsg['msg2']['isShow'] = true //若為其他錯誤，顯示系統繁忙中
      }
      console.error(error)
      reject()
    }
  })
}
</script>
<template>
  <section class="login__box">
    <div class="login__content">
      <div class="login__logo"><img src="@/assets/images/logo.svg" alt="" /></div>
      <div class="login__form">
        <GoogleLogin :callback="googleLoginCallback" />
        <div class="login__msg">
          <div class="login__fail__msg">
            <errorText v-show="failMsg.msg1.isShow">{{ failMsg.msg1.text }}</errorText>
          </div>
          <div class="login__fail__msg">
            <errorText v-show="failMsg.msg2.isShow">{{ failMsg.msg2.text }}</errorText>
          </div>
          <div class="login__fail__msg">
            <errorText v-show="failMsg.msg3.isShow">{{ failMsg.msg3.text }}</errorText>
          </div>
          <div class="login__fail__msg">
            <errorText v-show="failMsg.msg4.isShow">{{ failMsg.msg4.text }}</errorText>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@keyframes rotateAni {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes opacityAni {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
.login {
  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    background-color: #272d44;
    overflow: hidden;
    .env {
      font-size: 30px;
      color: #fff;
    }
  }
  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 700px;
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      width: 700px;
      height: 700px;
      margin-left: -350px;
      margin-top: -350px;
      background-image: url('../assets/images/login_img.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      // animation: rotateAni 250s infinite linear, opacityAni 2s infinite linear alternate-reverse;
    }
  }
  &__logo {
    width: 170px;
    margin-bottom: 20px;
    img {
      display: block;
      width: 100%;
    }
  }
  &__form {
    padding: 20px 30px 12px;
    background-color: #fff;
    border-radius: 0.25rem;
  }
  &__fail__msg {
    font-size: 13px;
  }
}
</style>
