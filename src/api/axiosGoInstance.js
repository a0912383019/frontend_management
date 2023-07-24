import axios from 'axios'

const baseURL = import.meta.env.VITE_API_GO_BASE_URL
const axiosGoInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

axiosGoInstance.interceptors.request.use(
  (request) => {
    // console.log('request', request)
    const accessToken = sessionStorage.access_token_go
    if (accessToken) {
      //添加Authorization
      request.headers['Authorization'] = accessToken
      //添加目前語系，等待後端確認是否要把語系參數放到header
      // request.headers['Locale'] = sessionStorage.languageType ?? 'zh-TW'
    }
    return request
  },
  (error) => {
    // 如果送出前失敗了，這邊就可以做一些處理
    console.log('error', error)
    return Promise.reject(error)
  }
)

axiosGoInstance.interceptors.response.use(
  (response) => {
    // console.log(response)
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default axiosGoInstance
