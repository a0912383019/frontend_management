import axiosGoInstance from './axiosGoInstance.js'

//貨量分析
export const apiQueryTagsGameRank = (params) => {
  const { hall_name, search_date, search_tag, exclude_tag, locale } = params
  return axiosGoInstance.get('/api/auth/game/tags_game_rank', {
    params: { hall_name, search_date, search_tag, exclude_tag, locale }
  })
}

//正負損益前20名
export const apiQueryTagsGamePayoffRank = (params) => {
  const { hall_name, search_date, search_tag, exclude_tag, locale, order } = params
  return axiosGoInstance.get('/api/auth/game/tags_game_payoff_rank', {
    params: { hall_name, search_date, search_tag, exclude_tag, locale, order }
  })
}
