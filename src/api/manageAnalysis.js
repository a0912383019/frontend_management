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

//階段總覽
export const apiQueryLifeCycleAnalysisAvgData = (params) => {
  console.log('apiQueryLifeCycleAnalysisAvgData', params)
  const {
    hall_name,
    query_date,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    detail_type,
    search_name,
    fuzzy_search,
    use_custom_list
  } = params
  return axiosInstance.post(
    '/api/auth/manage/bbin/query_life_cycle_analysis_avg_data' + sessionStorage.from_page,
    {
      hall_name,
      query_date,
      life_cycle_analysis_detail_date,
      life_cycle_analysis_step,
      detail_type,
      search_name,
      fuzzy_search,
      use_custom_list
    }
  )
}

//會員明細
export const apiQueryLifeCycleAnalysisDetailTbl = (params) => {
  console.log('apiQueryLifeCycleAnalysisDetailTbl', params)
  const {
    hall_name,
    query_date,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    detail_type,
    search_name,
    fuzzy_search,
    use_custom_list,
    draw,
    start,
    length,
    order,
    columns
  } = params
  return axiosInstance.post(
    '/api/auth/manage/bbin/query_life_cycle_analysis_detail' + sessionStorage.from_page,
    {
      hall_name,
      query_date,
      life_cycle_analysis_detail_date,
      life_cycle_analysis_step,
      detail_type,
      search_name,
      fuzzy_search,
      use_custom_list,
      draw,
      start,
      length,
      order,
      columns
    }
  )
}
