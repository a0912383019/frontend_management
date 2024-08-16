import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

// 取得當前使用者資訊（只需帶入token)
export const apiQueryUserInfo = () => {
  return axiosGoInstance.get('/api/auth/user/user_info')
}

// 取得使用者列表
export const apiListUserByAdmin = (params) => {
  const { name, user_type, user_status, last_login_date } = params
  return axiosGoInstance.get('/api/auth/admin/users', {
    params: { name, user_type, user_status, last_login_date }
  })
}

// 等到api全部轉為golang即可移除
// 取得使用者token資訊
export const apiSimulateUserDataPhp = (params) => {
  const { user_id } = params
  return axiosInstance.post('/api/auth/get_simulate_user_data', {
    user_id
  })
}

// 取得使用者token資訊
export const apiSimulateUserDataGo = (params) => {
  const { user_id } = params
  return axiosGoInstance.get(`/api/auth/admin/user/${user_id}/token`)
}

// 根據user_id 取得使用者資訊
export const apiUserByAdmin = (params) => {
  const { member_id } = params
  return axiosGoInstance.get('/api/auth/admin/user/user_info', {
    params: { member_id }
  })
}

// 更新使用者資訊
export const apiUpdateUserByAdmin = (params) => {
  const { user_id, user_type, user_status, access_hall_name } = params
  return axiosGoInstance.put(`/api/auth/admin/user/${user_id}`, {
    user_type,
    user_status,
    access_hall_name
  })
}

// 刪除使用者
export const apiDeleteUserByAdmin = (params) => {
  const { user_id } = params
  return axiosGoInstance.delete(`/api/auth/admin/user/${user_id}`)
}

// 新增使用者
export const apiCreateUserByAdmin = (params) => {
  const { email, user_type, user_status, access_hall_name } = params
  return axiosGoInstance.post('/api/auth/admin/users', {
    email,
    user_type,
    user_status,
    access_hall_name
  })
}
