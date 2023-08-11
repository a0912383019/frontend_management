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