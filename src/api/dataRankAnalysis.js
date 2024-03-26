import axiosGoInstance from './axiosGoInstance.js'

// 數據排名分析
// 貨量排名
export const apiQueryBetAmountRank = (params) => {
  const { hall_name, rank_date, rank_num, users_detail_date } = params
  return axiosGoInstance.get('/api/auth/rank/bet_amount_rank', {
    params: { hall_name, rank_date, rank_num, users_detail_date }
  })
}

// 正負盈利
export const apiQueryPositiveNegativeProfitRank = (params) => {
  const { hall_name, daily_date, rank_num, order, profit_rank_date } = params
  return axiosGoInstance.get('/api/auth/rank/positive_negative_profit_rank', {
    params: { hall_name, daily_date, rank_num, order, profit_rank_date }
  })
}

// 貨量成長/衰退排名
export const apiBetAmountGrowthDeclineRank = (params) => {
  const { financial_month, financial_week, financial_year, hall_name, order, rank_num } = params
  return axiosGoInstance.get('/api/auth/rank/bet_amount_growth_decline_rank', {
    params: { financial_month, financial_week, financial_year, hall_name, order, rank_num }
  })
}
