import axiosInstance from './axiosInstance.js'
import axiosGoInstance from './axiosGoInstance.js'

// 登入
export const apiLogin = (params) => {
  const { id_token } = params
  return axiosInstance.post('/api/auth/login_google', {
    id_token
  })
}
export const apiGoLogin = (params) => {
  const { id_token } = params
  return axiosGoInstance.put('/api/auth/login_google', {
    id_token
  })
}

// 登出 php
export const apiLogout = () => {
  return axiosInstance.post('/api/auth/logout')
}

// 登出 go
export const apiRevoke = () => {
  return axiosGoInstance.post('/api/auth/revoke')
}

// 重新取得token
export const apiRefresh = () => {
  return axiosInstance.post('/api/auth/refresh')
}
export const apiGoRefresh = () => {
  return axiosGoInstance.get('/api/auth/refresh')
}

export const apiGetSystemConfig = (params) => {
  const { hall_name, locale } = params
  return axiosGoInstance.get('/api/auth/system_config', {
    params: {
      hall_name,
      locale
    }
  })
}
