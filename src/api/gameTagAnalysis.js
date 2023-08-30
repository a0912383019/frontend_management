import axiosInstance from './axiosInstance.js'

//貨量分析
export const apiQueryTagsGameRank = (params) => {
  const { hall_name, tag_game_analysis_date, search_tag, exclude_tag, locale } = params
  return axiosInstance.post('/api/auth/game/bbin/query_tags_game_rank' + sessionStorage.from_page, {
    hall_name,
    tag_game_analysis_date,
    search_tag,
    exclude_tag,
    locale
  })
}

//正負損益前20名
export const apiQueryTagsGamePayoffRank = (params) => {
  const { hall_name, game_payoff_analysis_date, search_tag, exclude_tag, locale } = params
  return axiosInstance.post('/api/auth/game/bbin/query_tags_game_payoff_rank' + sessionStorage.from_page, {
    hall_name,
    game_payoff_analysis_date,
    search_tag,
    exclude_tag,
    locale
  })
}