
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { showMsg } from 'utils/util.js'

// 导入第三方库
// wx.request 封装 axios
import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

Vue.config.productionTip = false

App.mpType = 'app'

/**
 * axios 配置  
 */
axios.defaults.adapter = mpAdapter
axios.defaults.baseURL = 'https://api-ugo-web.itheima.net'
uni.$http= axios
uni.$showMsg = showMsg

// 拦截器
axios.interceptors.request.use(config => {
  uni.showLoading({
    title: '数据加载中...'
  })
  return config
}, err => {
  return Promise.reject(err)
})
axios.interceptors.response.use(res => {
  uni.hideLoading()
  return res.data
}, err => {
  return Promise.reject(err)
})

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif