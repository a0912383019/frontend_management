import axiosGoInstance from './axiosGoInstance.js'
import {
  mockGoLogin,
  mockGoRefresh,
  mockGetMenusConfig,
  mockGetTagsConfig,
  mockGetServerTime
} from '@/api/mock/system.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

export const apiGoLogin = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGoLogin), 300)
    })
  }

  const { id_token } = params
  return axiosGoInstance.put('/api/auth/login_google', {
    id_token
  })
}

export const apiGoRefresh = () => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGoRefresh), 300)
    })
  }

  return axiosGoInstance.get('/api/auth/refresh')
}

export const apiGetMenusConfig = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGetMenusConfig), 300)
    })
  }

  const { hall_name } = params
  return axiosGoInstance.get('/api/auth/menus_config', {
    params: {
      hall_name
    }
  })
}

export const apiGetTagsConfig = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGetTagsConfig), 300)
    })
  }

  const { hall_name, locale } = params
  return axiosGoInstance.get('/api/auth/tags_config', {
    params: {
      hall_name,
      locale
    }
  })
}

export const apiGetServerTime = () => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGetServerTime), 300)
    })
  }

  return axiosGoInstance.get('/api/auth/server_time')
}
