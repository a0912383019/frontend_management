import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

export const apiQueryGrowthActivity = (params) => {
  const {
    hall_name,
    start_search_year,
    start_search_month,
    start_search_week,
    start_date,
    end_search_year,
    end_search_month,
    end_search_week,
    end_date,
    cut_type,
    reward_flag,
    reward_date_flag,
    search_activity
  } = params
  return axiosInstance.post('/api/auth/activity/query_activity_commissionable_growth_rate', {
    hall_name,
    start_search_year,
    start_search_month,
    start_search_week,
    start_date,
    end_search_year,
    end_search_month,
    end_search_week,
    end_date,
    cut_type,
    reward_flag,
    reward_date_flag,
    search_activity
  })
}

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

export const apiQueryPromotionList = (params) => {
  const { hall_name, start_date, end_date } = params
  return axiosInstance.post('/api/auth/activity/query_promotion_list', {
    hall_name,
    start_date,
    end_date
  })
}

export const apiAddActivity = (params) => {
  const { hall_name, activity_name, activity_purpose, activity_description, activity_detail } =
    params
  return axiosInstance.post('/api/auth/activity/add_activity_analysis', {
    hall_name,
    activity_name,
    activity_purpose,
    activity_description,
    activity_detail
  })
}

export const apiImportActivity = (params) => {
  const { hall_name, activity_id, activity_detail_id, function_id } = params
  return axiosInstance.post('/api/auth/activity/import_activity_member_list', {
    hall_name,
    activity_id,
    activity_detail_id,
    function_id
  })
}
