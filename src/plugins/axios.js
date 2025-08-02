import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Replace with your base URL
//   baseURL: 'http://192.168.0.124:9090/users/api', // Replace with your base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',              // Default headers
  }
})

export default axiosInstance