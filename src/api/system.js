import axiosGoInstance from './axiosGoInstance.js'

export const apiGoLogin = (params) => {
  const { id_token } = params
  return axiosGoInstance.put('/api/auth/login_google', {
    id_token
  })
}

// 登出 go
export const apiRevoke = () => {
  return axiosGoInstance.post('/api/auth/revoke')
}

// 重新取得token
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

export const apiGetMenusConfig = (params) => {
  const { hall_name } = params
  return axiosGoInstance.get('/api/auth/menus_config', {
    params: {
      hall_name
    }
  })
}

export const apiGetTagsConfig = (params) => {
  const { hall_name, locale } = params
  return axiosGoInstance.get('/api/auth/tags_config', {
    params: {
      hall_name,
      locale
    }
  })
}

export const apiGetServerTime = () => {
  return axiosGoInstance.get('/api/auth/server_time')
}
