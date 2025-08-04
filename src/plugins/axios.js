import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'https://jsonplaceholder.typicode.com', // Replace with your base URL
  baseURL: '/users/api', // Replace with your base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',              // Default headers
  }
})
// Token storage (you can later integrate this with Pinia/Vuex)
let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token))
  refreshSubscribers = []
}

function getAccessToken() {
  return localStorage.getItem('accessToken')
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

function setTokens({ accessToken, refreshToken }) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
}

// Request Interceptor – Attach accessToken
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor – Auto refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip refresh if already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post('http://192.168.0.124:9090/user/api/auth/refresh', {
          refreshToken: getRefreshToken(),
        })

        const { accessToken, refreshToken } = res.data
        setTokens({ accessToken, refreshToken })

        isRefreshing = false
        onRefreshed(accessToken)

        originalRequest.headers.Authorization = 'Bearer ' + accessToken
        return api(originalRequest)
      } catch (err) {
        console.error('Refresh token failed', err)
        isRefreshing = false
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)
export default axiosInstance