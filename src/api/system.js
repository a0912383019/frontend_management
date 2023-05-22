import axios from 'axios'
const baseURL = import.meta.env.VITE_LOCAL_IP

const systemRequest = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

systemRequest.interceptors.request.use(
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

systemRequest.interceptors.response.use(
  (response) => {
    console.log(response)
    return Promise.resolve(response)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

//登入
export const apiLogin = (params) => {
  console.log('login', params)
  const { id_token } = params
  return systemRequest.post('/api/auth/login_google', {
    id_token
  })
}

//登出
export const apiLogout = () => {
  return systemRequest.post(
    '/api/auth/logout',
    {},
    {
      headers: {
        Authorization: sessionStorage.access_token
      }
    }
  )
}

//重新取得token
export const apiRefresh = () => {
  return systemRequest.post(
    '/api/auth/refresh',
    {},
    {
      headers: {
        Authorization: sessionStorage.access_token
      }
    }
  )
}

export const apiGetSystemConfig = (params) => {
  console.log('apiGetSystemConfig', params)
  const { hall_name, locale } = params
  return systemRequest.post(
    '/api/auth/systemConfig/get_system_config',
    { hall_name, locale },
    {
      headers: {
        Authorization: sessionStorage.access_token
      }
    }
  )
}
