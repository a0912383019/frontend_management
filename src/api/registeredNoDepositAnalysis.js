import axiosInstance from './axiosInstance.js'
import axiosGoInstance from './axiosGoInstance.js'

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
    action_score_analysis_date,
    action_score_span,
    deposit_status,
    hall_name,
    ip_duplicate_range,
    length,
    order,
    sort,
    start
  } = params
  return axiosGoInstance.get('/api/auth/deposit_probability/action_score_detail', {
    params: {
      action_score_analysis_date,
      action_score_span,
      deposit_status,
      hall_name,
      ip_duplicate_range,
      length,
      order,
      sort,
      start
    }
  })
}
