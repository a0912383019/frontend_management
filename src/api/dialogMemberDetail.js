import axiosInstance from './axiosInstance.js'

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
//各平台總貨量
export const apiQueryMemberPeriodPlatformBetAmount = (params) => {
  const { search_date, hall_name, member_id, locale } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_period_platform_bet_amount' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id,
      locale
    }
  )
}

//各平台總損益
export const apiQueryMemberPeriodPlatformPayoff = (params) => {
  const { search_date, hall_name, member_id, locale } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_period_platform_payoff' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id,
      locale
    }
  )
}

//會員明細Dialog結束
