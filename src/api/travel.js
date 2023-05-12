import axios from 'axios'
const travelRequest = axios.create({
  baseURL: '/travelApi'
})

travelRequest.interceptors.request.use(
  (request) => {
    console.log('request', request)
    return request
  },
  (error) => {
    // 如果送出前失敗了，這邊就可以做一些處理
    console.log('error', error)
    return Promise.reject(error)
  }
)

travelRequest.interceptors.response.use(
  (response) => {
    console.log(response)
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error.response.data)
  }
)

export const tarvelAllData = (params) => {
  return travelRequest.get('/zh-tw/Attractions/All', {
    params
  })
}
