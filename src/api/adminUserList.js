import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

export const apiQueryUserInfo = (params) => {
  const { member_id } = params
  return axiosGoInstance.get('/api/auth/user/user_info', {
    params: {
      member_id
    }
  })
}

export const apiListUserByAdmin = (params) => {
  const { user_name, user_type, user_status, last_login_date } = params
  return axiosInstance.post('/api/auth/user/list_user_by_admin', {
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

export const apiUserByAdmin = (params) => {
  const { user_id_hide } = params
  return axiosInstance.post('/api/auth/user/query_user_by_admin', {
    user_id_hide
  })
}

export const apiUpdateUserByAdmin = (params) => {
  const { user_type, user_status, access_hall_hide, user_id_hide } = params
  return axiosInstance.post('/api/auth/user/update_user_by_admin', {
    user_type,
    user_status,
    access_hall_hide,
    user_id_hide
  })
}

export const apiDeleteUserByAdmin = (params) => {
  const { delete_user_id_hide } = params
  return axiosInstance.post('/api/auth/user/delete_user_by_admin', {
    delete_user_id_hide
  })
}

export const apiCreateUserByAdmin = (params) => {
  const { email, user_type, user_status, access_hall_hide } = params
  return axiosInstance.post('/api/auth/user/create_user_by_admin', {
    name: email,
    email,
    user_type,
    user_status,
    access_hall_hide,
    password: 'qwer1234',
    password_confirmation: 'qwer1234'
  })
}
