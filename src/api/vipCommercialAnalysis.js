import axiosInstance from './axiosInstance'

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
