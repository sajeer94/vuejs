import axios from 'axios'
import Cookies from 'js-cookie'


const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.124:9090/users/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ----------------------
// Token Helpers
// ----------------------
function getAccessToken() {
  return Cookies.get('access_token')
}

function getRefreshToken() {
  return Cookies.get('refresh_token')
}

function setTokens({ access_token, refresh_token }) {
  Cookies.set('access_token', access_token, { expires: 1 })
  Cookies.set('refresh_token', refresh_token, { expires: 7 })
}

function logoutUser() {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  router.push('/auth/login')
}

// ----------------------
// Refresh Queue
// ----------------------
let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

// ----------------------
// Request Interceptor
// ----------------------
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ----------------------
// Response Interceptor
// ----------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isLoginOrRefresh =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh')

    // === Handle 401 with Refresh ===
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginOrRefresh) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post('/users/api/auth/refresh', {
          refresh_token: getRefreshToken(),
        }, {
          withCredentials: true
        })

        const { access_token, refresh_token } = res.data
        setTokens({ access_token, refresh_token })

        isRefreshing = false
        onRefreshed(access_token)

        originalRequest.headers.Authorization = 'Bearer ' + access_token
        return axiosInstance(originalRequest)

      } catch (err) {
        isRefreshing = false
        logoutUser()
        return Promise.reject(err)
      }
    }

    // === Server unreachable ===
    if (!error.response) {
      console.error('Backend unreachable — logging out.')
      logoutUser()
    }

    // === Server error (500+) ===
    if (error.response?.status >= 500) {
      console.error(`Server error (${error.response?.status}) — logging out.`)
      logoutUser()
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
