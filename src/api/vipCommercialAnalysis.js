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
