import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

// 進階篩選
export const apiQueryListActiveLimit = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_list_limit', {
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

// 總和_活動中-淨利
export const apiQueryTotalActiveProfit = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_total_profit_loss', {
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

// 總和_活動中-實動人數
export const apiQueryTotalActiveReal = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_total_real_activate', {
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

// 總和_活動中-有效投注
export const apiQueryTotalActiveCommissionable = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_total_commissionable', {
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

// 成長差額_活動中-淨利
export const apiQueryGrowthGapActiveProfit = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_profit_loss_growth_diff', {
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

// 成長差額_活動中-實動人數
export const apiQueryGrowthGapActiveReal = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_real_activate_growth_diff', {
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

// 成長差額_活動中-有效投注
export const apiQueryGrowthGapActiveCommissionable = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_commissionable_growth_diff', {
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

// 成長率_活動中-淨利
export const apiQueryGrowthRateActiveProfit = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_profit_loss_growth_rate', {
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

// 成長率_活動中-實動人數
export const apiQueryGrowthRateActiveReal = (params) => {
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
  return axiosInstance.post('/api/auth/activity/query_activity_real_activate_growth_rate', {
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

// 成長率_活動中-有效投注
export const apiQueryGrowthRateActiveCommissionable = (params) => {
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

export const apiActivityInfo = (params) => {
  const { hall_name, activity_id } = params
  return axiosInstance.post('/api/auth/activity/query_activity_analysis_info', {
    hall_name,
    activity_id
  })
}

export const apiQueryActivityCompareOverview = (params) => {
  const { hall_name, activity_id_hide, activity_detail_id_hide } = params
  return axiosInstance.post('/api/auth/activity/query_activity_compare_overview', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide
  })
}

export const apiQueryActivityTagsRank = (params) => {
  const { hall_name, activity_id_hide, activity_detail_id_hide } = params
  return axiosInstance.post('/api/auth/activity/query_activity_tags_rank', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide
  })
}

export const apiQueryActivityBetAmountGrowthSpanTags = (params) => {
  const { hall_name, activity_id_hide, activity_detail_id_hide } = params
  return axiosInstance.post('/api/auth/activity/query_activity_betAmount_growth_span_tags', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide
  })
}

export const apiQueryActivityMemberParticipation = (params) => {
  const {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide,
    activity_member_betAmount_growth_percent_hide
  } = params
  return axiosInstance.post('/api/auth/activity/query_activity_member_participation', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide,
    activity_member_betAmount_growth_percent_hide
  })
}

export const apiQueryActivityBetAmountGrowthSpan = (params) => {
  const { hall_name, activity_id_hide, activity_detail_id_hide } = params
  return axiosInstance.post('/api/auth/activity/query_activity_betAmount_growth_span', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide
  })
}
