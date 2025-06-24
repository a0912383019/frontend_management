import axiosGoInstance from './axiosGoInstance.js'
import {
  mockQueryLifeCycleAnalysisOverview,
  mockQueryLifeCycleAnalysisAvgData,
  mockQueryLifeCycleAnalysisDetailTbl,
  mockQueryStepTrendAnalysisOverview,
  mockQueryStepTotalPeople,
  mockQueryStepDetail
} from '@/api/mock/manageAnalysis.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

//會員階段人數變化
export const apiQueryLifeCycleAnalysisOverview = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryLifeCycleAnalysisOverview), 300)
    })
  }

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
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryLifeCycleAnalysisAvgData), 300)
    })
  }

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
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryLifeCycleAnalysisDetailTbl), 300)
    })
  }

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
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300)
    })
  }

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
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryStepTrendAnalysisOverview), 300)
    })
  }

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
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryStepTotalPeople), 300)
    })
  }

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
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryStepDetail), 300)
    })
  }

  const { hall_name, query_date, step } = params
  return axiosGoInstance.get('/api/auth/manage/step_detail', {
    params: {
      hall_name,
      query_date,
      step
    }
  })
}
