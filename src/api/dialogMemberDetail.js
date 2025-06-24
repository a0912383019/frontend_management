import axiosGoInstance from './axiosGoInstance.js'
import {
  mockQueryMemberInfo,
  mockQueryMemberLifeCycle,
  mockQueryMemberHealthChart,
  mockQueryProfitWithdrawDepositAmount,
  mockQueryMemberPeriodBetAmount,
  mockQueryMemberLobbyGroup,
  mockQueryMemberLobby,
  mockQueryMemberLobbyGame,
  mockQueryMemberPeriodPayoffProfitAmount,
  mockQueryMemberPeriodDepositWithdrawAmount,
  mockQueryMemberPeriodPlatformBetAmount,
  mockQueryMemberPeriodPlatformPayoff,
  mockQueryMemberJourney,
  mockUpdateCustomFlag,
  mockQueryMemberJourneyDetail,
  mockQueryGARelatedData,
  mockQueryMemberPeriodLoginGACount,
  mockQueryMemberPeriodOfferAmount,
  mockQueryMemberPeriodDayOffer,
  mockQueryGAPagePathRank,
  mockQueryGADataSource
} from '@/api/mock/dialogMemberDetail.js'

const useMock = import.meta.env.VITE_ENV === 'dev'

//會員明細Dialog開始
//會員總覽
export const apiQueryMemberInfo = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberInfo), 300)
    })
  }

  const { hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_info', {
    params: {
      hall_name,
      user_id
    }
  })
}

//取得會員生命週期資訊
export const apiQueryMemberLifeCycle = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberLifeCycle), 300)
    })
  }

  const { hall_name, user_id, data_date } = params
  return axiosGoInstance.get('/api/auth/manage/member_step_detail_by_date', {
    params: {
      hall_name,
      user_id,
      data_date
    }
  })
}

//取得會員健康度
export const apiQueryMemberHealthChart = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberHealthChart), 300)
    })
  }

  const { hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_health', {
    params: {
      hall_name,
      user_id
    }
  })
}

//取得會員時間區間內實際損益與出入款總金額
export const apiQueryProfitWithdrawDepositAmount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryProfitWithdrawDepositAmount), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/profit_withdraw_deposit_amount', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//總貨量與裝置佔比
export const apiQueryMemberPeriodBetAmount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodBetAmount), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_bet_amount', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//遊戲種類貨量佔比
export const apiQueryMemberLobbyGroup = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberLobbyGroup), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_lobby_group', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//平台貨量佔比
export const apiQueryMemberLobby = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberLobby), 300)
    })
  }

  const { search_date, hall_name, user_id, locale } = params
  return axiosGoInstance.get('/api/auth/member/member_lobby', {
    params: {
      search_date,
      hall_name,
      user_id,
      locale
    }
  })
}

//遊戲貨量佔比
export const apiQueryMemberLobbyGame = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberLobbyGame), 300)
    })
  }

  const { search_date, hall_name, user_id, locale } = params
  return axiosGoInstance.get('/api/auth/member/member_lobby_game', {
    params: {
      search_date,
      hall_name,
      user_id,
      locale
    }
  })
}

//獲利分析
//會員損益/廳主實際損益
export const apiQueryMemberPeriodPayoffProfitAmount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodPayoffProfitAmount), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_payoff_profit_amount', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//出入款金額
export const apiQueryMemberPeriodDepositWithdrawAmount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodDepositWithdrawAmount), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_deposit_withdraw_amount', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//各平台總貨量
export const apiQueryMemberPeriodPlatformBetAmount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodPlatformBetAmount), 300)
    })
  }

  const { search_date, hall_name, user_id, locale } = params
  return axiosGoInstance.get('/api/auth/member/member_period_platform_bet_amount', {
    params: {
      search_date,
      hall_name,
      user_id,
      locale
    }
  })
}

//各平台總損益
export const apiQueryMemberPeriodPlatformPayoff = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodPlatformPayoff), 300)
    })
  }

  const { search_date, hall_name, user_id, locale } = params
  return axiosGoInstance.get('/api/auth/member/member_period_platform_payoff', {
    params: {
      search_date,
      hall_name,
      user_id,
      locale
    }
  })
}

//會員旅程
//自訂旗標
export const apiQueryMemberJourney = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberJourney), 300)
    })
  }

  const { search_date, hall_name, user_id, locale } = params
  return axiosGoInstance.get('/api/auth/member/member_journey', {
    params: {
      search_date,
      hall_name,
      user_id,
      locale
    }
  })
}
//新增自訂旗標
export const apiUpdateCustomFlag = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUpdateCustomFlag), 300)
    })
  }

  const { hall_name, user_id, flag_date, flag_title, flag_content } = params
  return axiosGoInstance.put('/api/auth/member/update_custom_flag', {
    hall_name,
    user_id,
    flag_date,
    flag_title,
    flag_content
  })
}
//詳細事項
export const apiQueryMemberJourneyDetail = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberJourneyDetail), 300)
    })
  }

  const { search_date, hall_name, user_id, source, locale } = params
  return axiosGoInstance.get('/api/auth/member/member_journey_detail', {
    params: {
      search_date,
      hall_name,
      user_id,
      source,
      locale
    }
  })
}
//行為分析
//GA統計資料
export const apiQueryGARelatedData = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGARelatedData), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/ga_related_data', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//登入次數/GA瀏覽次數
export const apiQueryMemberPeriodLoginGACount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodLoginGACount), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_login_ga_count', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//領取優惠總額
export const apiQueryMemberPeriodOfferAmount = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodOfferAmount), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_offer_amount', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//領取優惠總每日今額
export const apiQueryMemberPeriodDayOffer = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryMemberPeriodDayOffer), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/member_period_day_offer', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//GA頁面資料
//頁面點擊排名
export const apiQueryGAPagePathRank = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGAPagePathRank), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/ga_page_path_rank', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}

//GA來源資料
export const apiQueryGADataSource = (params) => {
  if (useMock) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockQueryGADataSource), 300)
    })
  }

  const { search_date, hall_name, user_id } = params
  return axiosGoInstance.get('/api/auth/member/ga_data_source', {
    params: {
      search_date,
      hall_name,
      user_id
    }
  })
}
//會員明細Dialog結束
