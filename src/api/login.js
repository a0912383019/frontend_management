import axios from 'axios'
const baseURL = import.meta.env.VITE_LOCAL_IP

const loginRequest = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

loginRequest.interceptors.request.use(
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

loginRequest.interceptors.response.use(
  (response) => {
    console.log(response)
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export const goLogin = (params) => {
  console.log('goLogin', params)
  const { id_token } = params
  return loginRequest.post('/api/auth/login_google', {
    id_token
  })
}
