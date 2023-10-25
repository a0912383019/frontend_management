import axios from 'axios'

const baseURL = import.meta.env.VITE_API_GO_BASE_URL
const axiosGoInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosGoInstance.interceptors.request.use(
  (request) => {
    const accessToken = sessionStorage.access_token_go
    if (accessToken) {
      //添加Authorization
      request.headers['Authorization'] = accessToken
    }

    if (request.method === 'post' || request.method === 'put' || request.method === 'delete') {
      request.data = request.data || {}
      request.data.platform = 'bbin' // 預設platform為bbin
    }

    if (request.method === 'get') {
      request.params = request.params || {}
      request.params.platform = 'bbin' // 預設platform為bbin
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
