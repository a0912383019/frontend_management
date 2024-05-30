import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

export const apiQueryListActivity = (params) => {
  const { hall_name, activity_name, search_date } = params
  return axiosInstance.post('/api/auth/activity/list_activity_analysis', {
    hall_name,
    activity_name,
    search_date
  })
}

export const apiDeleteActivity = (params) => {
  const { hall_name, delete_activity_id } = params
  return axiosInstance.post('/api/auth/activity/delete_activity_analysis', {
    hall_name,
    delete_activity_id
  })
}

// export const apiListUserByAdmin = (params) => {
//   const { hall_name, user_name, user_type, user_status, last_login_date } = params
//   return axiosInstance.post('/api/auth/user/list_user_by_admin', {
//     hall_name,
//     user_name,
//     user_type,
//     user_status,
//     last_login_date
//   })
// }

// export const apiSimulateUserData = (params) => {
//   const { user_id } = params
//   return axiosInstance.post('/api/auth/get_simulate_user_data', {
//     user_id
//   })
// }

// export const apiUserByAdmin = (params) => {
//   const { user_id_hide } = params
//   return axiosInstance.post('/api/auth/user/query_user_by_admin', {
//     user_id_hide
//   })
// }
