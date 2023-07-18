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

//會員明細表格
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

//歷程紀錄
export const apiQueryMemberStepDetail = (params) => {
  const { hall_name, member_id, member_step_detail_date } = params
  const url_hall = findRootHall(hall_name).toLowerCase()
  return axiosInstance.post(
    '/api/auth/manage/' + url_hall + '/query_member_step_detail' + sessionStorage.from_page,
    {
      hall_name,
      member_id,
      member_step_detail_date
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

//會員明細Dialog開始
//會員總覽
export const apiQueryMemberInfo = (params) => {
  const { hall_name, member_id } = params
  return axiosInstance.post('/api/auth/member/bbin/query_member_info' + sessionStorage.from_page, {
    hall_name,
    member_id
  })
}

//更新會員標籤
export const apiUpdateMemberTagsEnable = (params) => {
  const { hall_name, member_id, user_name, user_tags_original, user_tags_new } = params
  console.log('apiUpdateMemberTagsEnable', {
    hall_name,
    member_id,
    user_name,
    user_tags_original,
    user_tags_new
  })
  return axiosInstance.post(
    '/api/auth/member/bbin/update_member_tags_enable' + sessionStorage.from_page,
    {
      hall_name,
      member_id,
      user_name,
      user_tags_original,
      user_tags_new
    }
  )
}

//取得會員生命週期資訊
export const apiQueryMemberLifeCycle = (params) => {
  const { hall_name, member_id, data_date } = params
  return axiosInstance.post(
    '/api/auth/manage/bbin/query_member_step_detail_by_date' + sessionStorage.from_page,
    {
      hall_name,
      member_id,
      data_date
    }
  )
}

//取得會員健康度
export const apiQueryMemberHealthChart = (params) => {
  const { hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_health' + sessionStorage.from_page,
    {
      hall_name,
      member_id
    }
  )
}

//取得會員時間區間內實際損益與出入款總金額
export const apiQueryProfitWithdrawDepositAmount = (params) => {
  const { search_date, hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_profit_withdraw_deposit_amount' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id
    }
  )
}
//總貨量與裝置佔比
export const apiQueryMemberPeriodBetAmount = (params) => {
  const { search_date, hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_period_bet_amount' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id
    }
  )
}
//遊戲種類貨量佔比
export const apiQueryMemberLobbyGroup = (params) => {
  const { search_date, hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_lobby_group' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id
    }
  )
}
//平台貨量佔比
export const apiQueryMemberLobby = (params) => {
  const { search_date, hall_name, member_id, locale } = params
  return axiosInstance.post('/api/auth/member/bbin/query_member_lobby' + sessionStorage.from_page, {
    search_date,
    hall_name,
    member_id,
    locale
  })
}
//遊戲貨量佔比
export const apiQueryMemberLobbyGame = (params) => {
  const { search_date, hall_name, member_id, locale } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_lobby_game' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id,
      locale
    }
  )
}

//獲利分析
//會員損益/廳主實際損益
export const apiQueryMemberPeriodPayoffProfitAmount = (params) => {
  const { search_date, hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_period_payoff_profit_amount' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id
    }
  )
}

//會員明細Dialog結束

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
