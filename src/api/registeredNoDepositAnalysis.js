import axiosInstance from './axiosInstance.js'

//存款機率區間總覽
export const apiQueryActionScoreSpan = (params) => {
  const { hall_name, deposit_status, action_score_analysis_date, ip_duplicate_range } = params
  return axiosInstance.post(
    '/api/auth/registered_no_deposit/bbin/query_action_score_span' + sessionStorage.from_page,
    {
      hall_name,
      deposit_status,
      action_score_analysis_date,
      ip_duplicate_range
    }
  )
}

//存款機率區間會員明細
export const apiQueryActionScoreDetail = (params) => {
  const {
    hall_name,
    action_score_analysis_date,
    deposit_status,
    ip_duplicate_range,
    barChart_action_score_click_span_hide
  } = params
  return axiosInstance.post(
    '/api/auth/registered_no_deposit/bbin/query_action_score_detail' + sessionStorage.from_page,
    {
      hall_name,
      action_score_analysis_date,
      deposit_status,
      ip_duplicate_range,
      barChart_action_score_click_span_hide
    }
  )
}
