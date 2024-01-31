import axiosGoInstance from './axiosGoInstance.js'

//首頁
//貨量/損益/優惠獎金/實動人數
export const apiQuerySmallBoxData = (params) => {
  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/home/small_box_data', {
    params: {
      hall_name,
      search_date
    }
  })
}

//訊息通知
export const apiQuerySmartMessNote = (params) => {
  const { hall_name, kind, search_date, locale } = params
  return axiosGoInstance.get('/api/auth/home/smart_message_notification', {
    params: {
      hall_name,
      kind,
      search_date,
      locale
    }
  })
}

//訊息通知已讀
export const apiReadSmartMessNote = (params) => {
  const { hall_name, message_id } = params
  return axiosGoInstance.put('/api/auth/home/smart_message_notification', {
    hall_name,
    message_id
  })
}

//會員生命週期人數佔比
export const apiQueryLatestLifeCycleSummary = (params) => {
  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/home/latest_life_cycle_summary', {
    params: {
      hall_name,
      search_date
    }
  })
}

//會員活躍度變化統計
export const apiQueryLivelyChangeOverview = (params) => {
  const { hall_name, search_date } = params
  return axiosGoInstance.get('/api/auth/vip/lively_change_overview', {
    params: {
      hall_name,
      search_date
    }
  })
}

//會員活躍度變化明細
export const apiQueryLivelyChangeDetail = (params) => {
  const { hall_name, search_date, analysis_level, compare_level } = params
  return axiosGoInstance.get('/api/auth/vip/lively_change_detail', {
    params: {
      hall_name,
      search_date,
      analysis_level,
      compare_level
    }
  })
}
