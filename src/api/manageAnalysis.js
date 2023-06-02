import axiosInstance from './axiosInstance.js'

//會員階段人數變化
export const apiQueryLifeCycleAnalysisOverview = (params) => {
  console.log('apiQueryLifeCycleAnalysisOverview', params)
  const { hall_name, query_date, search_name, fuzzy_search, use_custom_list } = params
  return axiosInstance.post(
    '/api/auth/manage/bbin/query_life_cycle_analysis_overview' + sessionStorage.from_page,
    {
      hall_name,
      query_date,
      search_name,
      fuzzy_search,
      use_custom_list
    }
  )
}
