import axiosInstance from './axiosInstance.js'
import axiosGoInstance from './axiosGoInstance.js'

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

//出入款金額
export const apiQueryMemberPeriodDepositWithdrawAmount = (params) => {
  const { search_date, hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_period_deposit_withdraw_amount' + sessionStorage.from_page,
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

//會員旅程
//自訂旗標
export const apiQueryMemberJourney = (params) => {
  const { search_date, hall_name, member_id, locale } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_journey' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id,
      locale
    }
  )
}
//新增自訂旗標
export const apiUpdateCustomFlag = (params) => {
  const { hall_name, member_id, flag_date, flag_title, flag_content } = params
  return axiosInstance.post('/api/auth/member/bbin/update_custom_flag' + sessionStorage.from_page, {
    hall_name,
    member_id,
    flag_date,
    flag_title,
    flag_content
  })
}
//詳細事項
export const apiQueryMemberJourneyDetail = (params) => {
  const { search_date, hall_name, member_id, source, locale } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_member_journey_detail' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id,
      source,
      locale
    }
  )
}

//行為分析
//GA統計資料
// export const apiQueryQARelatedData = (params) => {
//   const { search_date, hall_name, member_id } = params
//   return axiosInstance.post(
//     '/api/auth/member/bbin/query_ga_related_data' + sessionStorage.from_page,
//     {
//       search_date,
//       hall_name,
//       member_id,
//     }
//   )
// }

//登入次數/GA瀏覽次數
// export const apiQueryMemberPeriodLoginGACount = (params) => {
//   const { search_date, hall_name, member_id } = params
//   return axiosInstance.post(
//     '/api/auth/member/bbin/query_member_period_login_ga_count' + sessionStorage.from_page,
//     {
//       search_date,
//       hall_name,
//       member_id,
//     }
//   )
// }

//領取優惠總額
// export const apiQueryMemberPeriodOfferAmount = (params) => {
//   const { search_date, hall_name, member_id } = params
//   return axiosInstance.post(
//     '/api/auth/member/bbin/query_member_period_offer_amount' + sessionStorage.from_page,
//     {
//       search_date,
//       hall_name,
//       member_id,
//     }
//   )
// }

//領取優惠總每日今額
// export const apiQueryMemberPeriodDayOffer = (params) => {
//   const { search_date, hall_name, member_id } = params
//   return axiosInstance.post(
//     '/api/auth/member/bbin/query_member_period_day_offer' + sessionStorage.from_page,
//     {
//       search_date,
//       hall_name,
//       member_id,
//     }
//   )
// }

//GA頁面資料
//頁面點擊排名
// export const apiQueryGAPagePathRank = (params) => {
//   const { search_date, hall_name, member_id } = params
//   return axiosInstance.post(
//     '/api/auth/member/bbin/query_ga_page_path_rank' + sessionStorage.from_page,
//     {
//       search_date,
//       hall_name,
//       member_id,
//     }
//   )
// }

//GA來源資料
export const apiQueryGADataSource = (params) => {
  const { search_date, hall_name, member_id } = params
  return axiosInstance.post(
    '/api/auth/member/bbin/query_ga_data_source' + sessionStorage.from_page,
    {
      search_date,
      hall_name,
      member_id,
    }
  )
}
//會員明細Dialog結束


//golang api
//行為分析
//GA統計資料
export const apiQueryQARelatedData = (params) => {
  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/ga_related_data', {
    params: {
      search_date,
      hall_name,
      user_id,
    }
  })
}

//登入次數/GA瀏覽次數
export const apiQueryMemberPeriodLoginGACount = (params) => {
  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_login_ga_count', {
    params: {
      search_date,
      hall_name,
      user_id,
    }
  })
}

//領取優惠總額
export const apiQueryMemberPeriodOfferAmount = (params) => {
  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_offer_amount', {
    params: {
      search_date,
      hall_name,
      user_id,
    }
  })
}

//領取優惠總每日今額
export const apiQueryMemberPeriodDayOffer = (params) => {
  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_day_offer', {
    params: {
      search_date,
      hall_name,
      user_id,
    }
  })
}

//GA頁面資料
//頁面點擊排名
export const apiQueryGAPagePathRank = (params) => {
  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/ga_page_path_rank', {
    params: {
      search_date,
      hall_name,
      user_id,
    }
  })
}
