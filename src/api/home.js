import axiosInstance from './axiosInstance.js'
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
export const apiQuerySmallMesNote = (params) => {
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
export const apiReadSmartMesNote = (params) => {
  const { hall_name, message_id } = params
  return axiosInstance.post(
    '/api/auth/home/read_smart_message_notification' + sessionStorage.from_page,
    {
      hall_name,
      message_id
    }
  )
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
  return axiosGoInstance.get('/api/auth/home/lively_change_overview', {
    params: {
      hall_name,
      search_date
    }
  })
}

//會員活躍度變化明細
export const apiQueryLivelyChangeDetail = (params) => {
  const {
    hall_name,
    search_date,
    lively_change_ary,
    member_lively_change_vip_tag = '10001,10003'
  } = params
  return axiosInstance.post(
    '/api/auth/home/query_lively_change_detail' + sessionStorage.from_page,
    {
      hall_name,
      search_date,
      lively_change_ary,
      member_lively_change_vip_tag
    }
  )
}

//週活躍度
export const apiQueryMemberRecentWeekLively = (params) => {
  const { hall_name, member_id, start_date, end_date } = params
  return axiosInstance.post(
    '/api/auth/vip/bbin/query_member_recent_week_lively' + sessionStorage.from_page,
    {
      hall_name,
      member_id,
      start_date,
      end_date
    }
  )
}

//日活躍度

export const apiQueryMemberRecentLively = (params) => {
  const { hall_name, member_id, start_date, end_date } = params
  return axiosInstance.post(
    '/api/auth/vip/bbin/query_member_recent_lively' + sessionStorage.from_page,
    {
      hall_name,
      member_id,
      start_date,
      end_date
    }
  )
}
