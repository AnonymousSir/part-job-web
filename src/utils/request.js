import axios from 'axios'
import config from '../config'

let request = axios.create({
  // 设置host地址,调用request方法的时候就可以自己写路由了 如：/login
  baseURL: config.requestConfig.baseURL,
  timeout: 5000
})
request.defaults.withCredentials = true

// 请求拦截器
request.interceptors.request.use(
  req => {
    // const token = localStorage.getItem('token') || ''
    // 设置header
    // req.headers.Authorization = token
    // req.headers = { 'Authorization': token }
    return req
  },
  err => {
    return Promise.reject(err)
  }
)
// 响应拦截器
request.interceptors.response.use(
  req => {
    return req.data
  },
  err => {
    return Promise.reject(err)
  }
)
// 导出request
export default request