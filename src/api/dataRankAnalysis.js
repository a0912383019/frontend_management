import axiosGoInstance from './axiosGoInstance.js'

// 活躍度分析 -> 活躍度總覽
export const apiQueryBetAmountRank = (params) => {
  const { hall_name, rank_date, rank_num, users_detail_date } = params
  return axiosGoInstance.get('/api/auth/rank/bet_amount_rank', {
    params: { hall_name, rank_date, rank_num, users_detail_date }
  })
}
