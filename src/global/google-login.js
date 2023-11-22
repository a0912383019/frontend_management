import vue3GoogleLogin from 'vue3-google-login'

// 開發環境
const developmentEnvironment = import.meta.env.VITE_ENV

let clientId = '172879218577-i6b4q5765l7vu2qdf4d00d5p13604rv3.apps.googleusercontent.com'

// for qa
if (developmentEnvironment === 'qa') {
  clientId = '1055824448864-oifmo3rcb9t51lucpbvsf6v0mhrfvh0s.apps.googleusercontent.com'
}

export const googleLoginRegister = (app) => {
  app.use(vue3GoogleLogin, {
    clientId,
    buttonConfig: {
      theme: 'filled_blue',
      shape: 'pill',
      width: 300
    }
  })
}
