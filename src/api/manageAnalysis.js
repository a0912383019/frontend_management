import axiosGoInstance from './axiosGoInstance.js'

//會員階段人數變化
export const apiQueryLifeCycleAnalysisOverview = (params) => {
  const { hall_name, query_date, search_name, fuzzy_search, custom_user_list } = params
  return axiosGoInstance.post('/api/auth/manage/life_cycle_analysis_overview', {
    hall_name,
    query_date,
    search_name,
    fuzzy_search,
    custom_user_list
  })
}

//階段總覽
export const apiQueryLifeCycleAnalysisAvgData = (params) => {
  const {
    custom_user_list,
    hall_name,
    query_date,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    detail_type,
    search_name,
    fuzzy_search
  } = params
  return axiosGoInstance.post('/api/auth/manage/life_cycle_analysis_avg_data', {
    custom_user_list,
    hall_name,
    query_date,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    detail_type,
    search_name,
    fuzzy_search
  })
}

//會員明細表格
export const apiQueryLifeCycleAnalysisDetailTbl = (params) => {
  const {
    custom_user_list,
    detail_type,
    fuzzy_search,
    hall_name,
    length,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    order,
    query_date,
    search_name,
    sort,
    start
  } = params
  return axiosGoInstance.post('/api/auth/manage/life_cycle_analysis_detail', {
    custom_user_list,
    detail_type,
    fuzzy_search,
    hall_name,
    length,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    order,
    query_date,
    search_name,
    sort,
    start
  })
}

// 匯出報表
export const apiExportLifeCycleAnalysisDetail = (params) => {
  const {
    custom_user_list,
    detail_type,
    fuzzy_search,
    hall_name,
    length,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    locale,
    order,
    query_date,
    search_name,
    sort,
    start,
    file_path
  } = params
  return axiosGoInstance.post('/api/auth/manage/export_life_cycle_analysis_detail', {
    custom_user_list,
    detail_type,
    fuzzy_search,
    hall_name,
    length,
    life_cycle_analysis_detail_date,
    life_cycle_analysis_step,
    locale,
    order,
    query_date,
    search_name,
    sort,
    start,
    file_path
  })
}

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
  return axiosGoInstance.get('/api/auth/manage/step_detail', {
    params: {
      hall_name,
      query_date,
      step
    }
  })
}
