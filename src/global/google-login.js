import vue3GoogleLogin from 'vue3-google-login'

export const googleLoginRegister = (app) => {
  app.use(vue3GoogleLogin, {
    clientId: '172879218577-i6b4q5765l7vu2qdf4d00d5p13604rv3.apps.googleusercontent.com'
  })
}
