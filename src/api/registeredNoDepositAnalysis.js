import axiosGoInstance from './axiosGoInstance.js'

//存款機率區間總覽
export const apiQueryActionScoreSpan = (params) => {
  const { hall_name, deposit_status, ip_duplicate_range } = params
  return axiosGoInstance.get('/api/auth/deposit_probability/action_score_span', {
    params: {
      hall_name,
      deposit_status,
      ip_duplicate_range
    }
  })
}

//存款機率區間會員明細
export const apiQueryActionScoreDetail = (params) => {
  const {
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
