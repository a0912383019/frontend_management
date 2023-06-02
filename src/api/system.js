import axiosInstance from './axiosInstance.js'

//登入
export const apiLogin = (params) => {
  // console.log('login', params)
  const { id_token } = params
  return axiosInstance.post('/api/auth/login_google', {
    id_token
  })
}

//登出
export const apiLogout = () => {
  return axiosInstance.post('/api/auth/logout')
}

//重新取得token
export const apiRefresh = () => {
  return axiosInstance.post('/api/auth/refresh')
}

export const apiGetSystemConfig = (params) => {
  // console.log('apiGetSystemConfig', params)
  const { hall_name, locale } = params
  return axiosInstance.post('/api/auth/systemConfig/get_system_config', { hall_name, locale })
}
