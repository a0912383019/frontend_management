import axiosInstance from './axiosInstance.js'
import { findRootHall } from '@/utils/commonUtils.js'

//會員階段人數變化
export const apiQueryLifeCycleAnalysisOverview = (params) => {
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

//使用手動匯入名單
export const apiUploadMemberTagList = (params) => {
  const { hall_name, upload_file } = params
  console.log('upload_file', upload_file)
  return axiosInstance.post(
    '/api/auth/member/bbin/upload_member_tag_list' + sessionStorage.from_page,
    {
      hall_name,
      upload_file
    },
    {
      headers: { 'Content-Type': 'multipart/form-data' } //upload_file為binary，須改headers content-type
    }
  )
}

export const apiImportUploadMemberList = (params) => {
  const { hall_name } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/import_upload_member_list' + sessionStorage.from_page,
    {
      hall_name
    }
  )
}

//趨勢分析
//階段盈利總覽
export const apiQueryStepTrendAnalysisOverview = (params) => {
  const { hall_name, search_date } = params
  return axiosInstance.post(
    '/api/auth/manage/bbin/query_step_trend_analysis_overview' + sessionStorage.from_page,
    {
      hall_name,
      search_date
    }
  )
}

//階段每日人數
export const apiQueryStepTotalPeople = (params) => {
  const { hall_name, search_date } = params
  return axiosInstance.post(
    '/api/auth/manage/bbin/query_step_total_people' + sessionStorage.from_page,
    {
      hall_name,
      search_date
    }
  )
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
