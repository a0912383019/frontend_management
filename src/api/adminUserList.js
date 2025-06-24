import axiosGoInstance from './axiosGoInstance.js'
import {
  mockQueryUserInfo,
  mockListUserByAdmin,
  mockSimulateUserDataGo,
  mockUserByAdmin,
  mockUpdateUserByAdmin,
  mockDeleteUserByAdmin,
  mockCreateUserByAdmin
} from '@/api/mock/adminUserList.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

// 取得當前使用者資訊（只需帶入token)
export const apiQueryUserInfo = () => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryUserInfo), 300)
    })
  }

  return axiosGoInstance.get('/api/auth/user/user_info')
}

// 取得使用者列表
export const apiListUserByAdmin = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockListUserByAdmin), 300)
    })
  }

  const { name, user_type, user_status, last_login_date } = params
  return axiosGoInstance.get('/api/auth/admin/users', {
    params: { name, user_type, user_status, last_login_date }
  })
}

// 取得使用者token資訊
export const apiSimulateUserDataGo = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSimulateUserDataGo), 300)
    })
  }

  const { user_id } = params
  return axiosGoInstance.get(`/api/auth/admin/user/${user_id}/token`)
}

// 根據user_id 取得使用者資訊
export const apiUserByAdmin = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUserByAdmin), 300)
    })
  }

  const { member_id } = params
  return axiosGoInstance.get('/api/auth/admin/user/user_info', {
    params: { member_id }
  })
}

// 更新使用者資訊
export const apiUpdateUserByAdmin = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUpdateUserByAdmin), 300)
    })
  }

  const { user_id, user_type, user_status, access_hall_name } = params
  return axiosGoInstance.put(`/api/auth/admin/user/${user_id}`, {
    user_type,
    user_status,
    access_hall_name
  })
}

// 刪除使用者
export const apiDeleteUserByAdmin = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDeleteUserByAdmin), 300)
    })
  }

  const { user_id } = params
  return axiosGoInstance.delete(`/api/auth/admin/user/${user_id}`)
}

// 新增使用者
export const apiCreateUserByAdmin = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCreateUserByAdmin), 300)
    })
  }

  const { email, user_type, user_status, access_hall_name } = params
  return axiosGoInstance.post('/api/auth/admin/users', {
    email,
    user_type,
    user_status,
    access_hall_name
  })
}
