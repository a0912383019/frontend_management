import axiosInstance from './axiosInstance'
import axiosGoInstance from './axiosGoInstance.js'

// 活躍度分析 -> 活躍度總覽
export const apiQueryLivelyAnalysisOverview = (params) => {
  const {
    hall_name,
    lively_analysis_end_date,
    lively_analysis_vip_tag,
    search_name,
    fuzzy_search,
    use_custom_list
  } = params
  return axiosInstance.post('/api/auth/vip/bbin/query_lively_analysis_overview', {
    hall_name,
    lively_analysis_end_date,
    lively_analysis_vip_tag,
    search_name,
    fuzzy_search,
    use_custom_list
  })
}

// 活躍度分析 -> 活躍度明細
export const apiQueryMemberLivelyList = (params) => {
  const {
    hall_name,
    lively_analysis_start_date,
    lively_analysis_end_date,
    lively_level,
    detail_type,
    lively_analysis_vip_tag,
    search_name,
    fuzzy_search,
    use_custom_list
  } = params
  return axiosInstance.post('/api/auth/vip/bbin/query_member_lively_list', {
    hall_name,
    lively_analysis_start_date,
    lively_analysis_end_date,
    lively_level,
    detail_type,
    lively_analysis_vip_tag,
    search_name,
    fuzzy_search,
    use_custom_list
  })
}

// 週統計報表 -> 每週統計報表
export const apiWeekTotalReport = (params) => {
  const { hall_name, start_date, end_date, vip_tag } = params
  return axiosGoInstance.get('/api/auth/vip/week_total_report', {
    params: {
      hall_name,
      start_date,
      end_date,
      vip_tag
    }
  })
}

// 活躍時段分析 -> 活躍時段人數
export const apiActiveTimeOverview = (params) => {
  const {
    hall_name,
    contain_weeks,
    custom_user_list,
    fuzzy_search,
    search_date,
    search_name,
    vip_tag
  } = params
  return axiosGoInstance.post('/api/auth/vip/active_time_overview', {
    hall_name,
    contain_weeks,
    custom_user_list,
    fuzzy_search,
    search_date,
    search_name,
    vip_tag
  })
}

// 活躍時段分析 -> 活躍時段明細
export const apiActiveTimeDetail = (params) => {
  const {
    active_time,
    contain_weeks,
    custom_user_list,
    fuzzy_search,
    hall_name,
    search_date,
    search_name,
    vip_tag
  } = params
  return axiosGoInstance.post('/api/auth/vip/active_time_detail', {
    active_time,
    contain_weeks,
    custom_user_list,
    fuzzy_search,
    hall_name,
    search_date,
    search_name,
    vip_tag
  })
}

// 日報表
export const apiDayReport = (params) => {
  const { hall_name, report_date, vip_tag } = params
  return axiosGoInstance.get('/api/auth/vip/day_report', {
    params: {
      hall_name,
      report_date,
      vip_tag
    }
  })
}

// 日報表 - 匯出報表
export const apiExportDayReport = (params) => {
  const { hall_name, locale, report_date, vip_tag } = params
  return axiosGoInstance.get('/api/auth/vip/export_day_report', {
    params: {
      hall_name,
      locale,
      report_date,
      vip_tag
    }
  })
}

// 週報表
export const apiWeekReport = (params) => {
  const { hall_name, financial_month, financial_week, financial_year, vip_tag } = params
  return axiosGoInstance.get('/api/auth/vip/week_report', {
    params: {
      hall_name,
      financial_month,
      financial_week,
      financial_year,
      vip_tag
    }
  })
}

// 週統計報表 -> 每週統計報表
export const apiWeekProfitReport = (params) => {
  const { hall_name, start_date, end_date, vip_tag } = params
  return axiosGoInstance.get('/api/auth/vip/week_profit_report', {
    params: {
      hall_name,
      start_date,
      end_date,
      vip_tag
    }
  })
}
