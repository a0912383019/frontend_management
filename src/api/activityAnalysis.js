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
  const { hall_name, id, is_reward, threshold } = params
  return axiosGoInstance.get(`/api/auth/activity_detail/${id}/member_participation`, {
    params: { hall_name, is_reward, threshold }
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

export const apiQueryActivityCompareDetail = (params) => {
  const { hall_name, activity_id_hide, activity_detail_id_hide, search_name, length, draw, start } =
    params

  const order = [
      {
        column: 1,
        dir: 'desc'
      }
    ],
    columns = [{}, { name: 'before_bet_amount_avg' }, {}]
  return axiosInstance.post('/api/auth/activity/query_activity_compare_detail', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide,
    search_name,
    draw,
    start,
    length,
    order,
    columns
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
  const { hall_name, activity_id_hide, activity_detail_id_hide } = params
  return axiosInstance.post('/api/auth/activity/query_member_step_changes', {
    hall_name,
    activity_id_hide,
    activity_detail_id_hide
  })
}
