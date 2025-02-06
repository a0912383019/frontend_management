import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

// 匯出名單
export const apiExportActivityList = (params) => {
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
  return axiosInstance.post(
    '/api/auth/activity/export_activity_report',
    {
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
    },
    {
      timeout: 10 * 1000 // 10秒
    }
  )
}

// 總和_淨利
export const apiQueryTotalActiveProfit = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/total/profit_loss', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 總和_實動人數
export const apiQueryTotalActiveReal = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/total/active_people', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 總和_有效投注
export const apiQueryTotalActiveCommissionable = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/total/commissionable', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長差額_淨利
export const apiQueryGrowthGapActiveProfit = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_diff/profit_loss', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長差額_實動人數
export const apiQueryGrowthGapActiveReal = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_diff/active_people', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長差額_有效投注
export const apiQueryGrowthGapActiveCommissionable = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_diff/commissionable', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長率_淨利
export const apiQueryGrowthRateActiveProfit = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_rate/profit_loss', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長率_實動人數
export const apiQueryGrowthRateActiveReal = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_rate/active_people', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

// 成長率_有效投注
export const apiQueryGrowthRateActiveCommissionable = (params) => {
  const { hall_name, activity_id_list, analysis_date, interval_type, is_reward } = params
  return axiosGoInstance.get('/api/auth/activity/growth_rate/commissionable', {
    params: { hall_name, activity_id_list, analysis_date, interval_type, is_reward }
  })
}

export const apiQueryListActivity = (params) => {
  const { hall_name, activity_name } = params
  return axiosGoInstance.get('/api/auth/activity', {
    params: { hall_name, activity_name }
  })
}

export const apiDeleteActivity = (params) => {
  const { hall_name, id } = params
  return axiosGoInstance.delete(`/api/auth/activity/${id}`, {
    params: { hall_name }
  })
}

export const apiQueryPromotionList = (params) => {
  const { hall_name, start_date, end_date } = params
  return axiosGoInstance.get('/api/auth/activity/promotions', {
    params: { hall_name, start_date, end_date }
  })
}

export const apiAddActivity = (params) => {
  const { hall_name, name, description, purpose, details } = params
  return axiosGoInstance.post('/api/auth/activity', {
    hall_name,
    name,
    description,
    purpose,
    details
  })
}

export const apiActivityInfo = (params) => {
  const { hall_name, activity_id } = params
  return axiosGoInstance.get(`/api/auth/activity/${activity_id}`, {
    params: { hall_name }
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
  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/tags_rank`, {
    params: { hall_name, is_reward }
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

// 子活動分析-有效投注統計-會員參與率
export const apiQueryActivityMemberParticipation = (params) => {
  const { hall_name, id, is_reward, threshold } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/member_participation`, {
    params: { hall_name, is_reward, threshold }
  })
}

// 子活動分析-有效投注統計-區間人數
export const apiQueryActivityBetAmountGrowthSpan = (params) => {
  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/betAmount_growth_span`, {
    params: { hall_name, is_reward }
  })
}

export const apiQueryActivityCompareDetail = (params) => {
  const { hall_name, id, is_reward, search_name, length, start, sort, order } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/compare_detail`, {
    params: { hall_name, is_reward, search_name, length, start, sort, order }
  })
}

export const apiExportActivityCompareDetail = (params) => {
  const { hall_name, activity_id_hide, activity_detail_id_hide, reward_flag, locale } = params
  return axiosInstance.post('/api/auth/activity/export_activity_compare_detail', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide,
    reward_flag,
    locale
  })
}

export const apiQueryMemberStepChanges = (params) => {
  const { hall_name, id, is_reward } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/member_step_changes`, {
    params: { hall_name, is_reward }
  })
}
