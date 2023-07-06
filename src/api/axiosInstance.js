import axios from 'axios'

const baseURL = import.meta.env.VITE_LOCAL_IP
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

axiosInstance.interceptors.request.use(
  (request) => {
    // console.log('request', request)
    const accessToken = sessionStorage.access_token
    if (accessToken) {
      //添加Authorization
      request.headers['Authorization'] = accessToken
    }
    return request
  },
  (error) => {
    // 如果送出前失敗了，這邊就可以做一些處理
    console.log('error', error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log(response)
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default axiosInstance
