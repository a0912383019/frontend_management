import axiosInstance from './axiosInstance'

export const apiListUserByAdmin = (params) => {
  const { hall_name, user_name, user_type, user_status, last_login_date } = params
  return axiosInstance.post('/api/auth/user/list_user_by_admin', {
    hall_name,
    user_name,
    user_type,
    user_status,
    last_login_date
  })
}

export const apiSimulateUserData = (params) => {
  const { user_id } = params
  return axiosInstance.post('/api/auth/get_simulate_user_data', {
    user_id
  })
}