import axiosInstance from './axiosInstance.js'

//首頁
//貨量/損益/優惠獎金/實動人數
export const apiQuerySmallBoxData = (params) => {
  const { hall_name, search_date } = params
  return axiosInstance.post('/api/auth/home/query_small_box_data' + sessionStorage.from_page, {
    hall_name,
    search_date
  })
}

//訊息通知
export const apiQuerySmallMesNote = (params) => {
  const { hall_name, kind, search_date, locale } = params
  return axiosInstance.post('/api/auth/home/query_smart_message_notification' + sessionStorage.from_page, {
    hall_name,
    kind,
    search_date,
    locale
  })
}

//訊息通知已讀
export const apiReadSmartMesNote = (params) => {
  const { hall_name, message_id } = params
  return axiosInstance.post('/api/auth/home/read_smart_message_notification' + sessionStorage.from_page, {
    hall_name,
    message_id
  })
}