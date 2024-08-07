import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

// 取得當前使用者資訊
export const apiQueryUserInfo = () => {
  return axiosGoInstance.get('/api/auth/user/user_info')
}

export const apiListUserByAdmin = (params) => {
  const { name, user_type, user_status, last_login_date } = params
  return axiosGoInstance.get('/api/auth/admin/users', {
    params: { name, user_type, user_status, last_login_date }
  })
}

export const apiSimulateUserData = (params) => {
  const { user_id } = params
  return axiosInstance.post('/api/auth/get_simulate_user_data', {
    user_id
  })
}

// 取得使用者資訊
export const apiUserByAdmin = (params) => {
  const { member_id } = params
  return axiosGoInstance.get('/api/auth/admin/user/user_info', {
    params: { member_id }
  })
}

export const apiUpdateUserByAdmin = (params) => {
  const { user_id, user_type, user_status, access_hall_name } = params
  return axiosGoInstance.put(`/api/auth/admin/user/${user_id}`, {
    user_type,
    user_status,
    access_hall_name
  })
}

export const apiDeleteUserByAdmin = (params) => {
  const { delete_user_id_hide } = params
  return axiosInstance.post('/api/auth/user/delete_user_by_admin', {
    delete_user_id_hide
  })
}

export const apiCreateUserByAdmin = (params) => {
  const { email, user_type, user_status, access_hall_name } = params
  return axiosGoInstance.post('/api/auth/admin/users', {
    email,
    user_type,
    user_status,
    access_hall_name
  })
}
