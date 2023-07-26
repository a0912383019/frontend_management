import axiosInstance from './axiosInstance.js'
import axiosGoInstance from './axiosGoInstance.js'

//登入
export const apiLogin = (params) => {
  // console.log('login', params)
  const { id_token } = params
  return axiosInstance.post('/api/auth/login_google', {
    id_token
  })
}
export const apiGoLogin = (params) => {
  // console.log('login', params)
  const { id_token } = params
  return axiosGoInstance.put('/api/auth/login_google', {
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
export const apiGoRefresh = () => {
  return axiosGoInstance.get('/api/auth/refresh')
}

export const apiGetSystemConfig = (params) => {
  // console.log('apiGetSystemConfig', params)
  const { hall_name, locale } = params
  return axiosGoInstance.get('/api/auth/system_config', {
    params: {
      hall_name,
      locale
    }
  })
}
