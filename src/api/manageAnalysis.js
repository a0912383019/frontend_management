import axiosInstance from './axiosInstance.js'
import axiosGoInstance from './axiosGoInstance.js'

//會員階段人數變化
export const apiQueryLifeCycleAnalysisOverview = (params) => {
  const { hall_name, query_date, search_name, fuzzy_search, custom_user_list } = params
  return axiosGoInstance.post(
    '/api/auth/manage/life_cycle_analysis_overview',
    {
      hall_name,
      query_date,
      search_name,
      fuzzy_search,
      custom_user_list
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

//階段總覽
export const apiQueryLifeCycleAnalysisAvgData = (params) => {
  const {
    hall_name,
    query_date,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    detail_type,
    search_name,
    fuzzy_search,
    custom_user_list
  } = params
  return axiosGoInstance.get('/api/auth/manage/life_cycle_analysis_avg_data', {
    params: {
      hall_name,
      query_date,
      life_cycle_analysis_detail_date,
      life_cycle_analysis_step,
      detail_type,
      search_name,
      fuzzy_search,
      custom_user_list
    }
  })
}

//會員明細表格
export const apiQueryLifeCycleAnalysisDetailTbl = (params) => {
  const {
    hall_name,
    query_date,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    detail_type,
    search_name,
    fuzzy_search,
    custom_user_list,
    start,
    length,
    order
  } = params
  return axiosGoInstance.get('/api/auth/manage/life_cycle_analysis_detail', {
    params: {
      hall_name,
      query_date,
      life_cycle_analysis_detail_date,
      life_cycle_analysis_step,
      detail_type,
      search_name,
      fuzzy_search,
      custom_user_list,
      start,
      length,
      order
    }
  })
}
// export const apiQueryLifeCycleAnalysisDetailTbl = (params) => {
//   const {
//     hall_name,
//     query_date,
//     life_cycle_analysis_detail_date,
//     life_cycle_analysis_step,
//     detail_type,
//     search_name,
//     fuzzy_search,
//     use_custom_list,
//     draw,
//     start,
//     length,
//     order,
//     columns
//   } = params
//   return axiosInstance.post(
//     '/api/auth/manage/bbin/query_life_cycle_analysis_detail' + sessionStorage.from_page,
//     {
//       hall_name,
//       query_date,
//       life_cycle_analysis_detail_date,
//       life_cycle_analysis_step,
//       detail_type,
//       search_name,
//       fuzzy_search,
//       use_custom_list,
//       draw,
//       start,
//       length,
//       order,
//       columns
//     }
//   )
// }

//趨勢分析
//階段盈利總覽
export const apiQueryStepTrendAnalysisOverview = (params) => {
  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/manage/step_trend_analysis_overview', {
    params: {
      hall_name,
      search_date
    }
  })
}

//階段每日人數
export const apiQueryStepTotalPeople = (params) => {
  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/manage/step_total_people', {
    params: {
      hall_name,
      search_date
    }
  })
}

//階段每日人數 - 詳細資料(點擊chartjs popup)
export const apiQueryStepDetail = (params) => {
  const { hall_name, query_date, step } = params
  return axiosInstance.post('/api/auth/manage/bbin/query_step_detail' + sessionStorage.from_page, {
    hall_name,
    query_date,
    step
  })
}
