
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { showMsg } from 'utils/util.js'
import store from '@/store/store.js'

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
// 注意点: 微信真机调试不检验合法域名只能使用 http, https 不行
axios.defaults.baseURL = 'http://api-ugo-web.itheima.net'
uni.$http= axios
uni.$showMsg = showMsg

// 拦截器
axios.interceptors.request.use(config => {
  uni.showLoading({
    title: '数据加载中...'
  })
  
  // 支付接口需要验证 token
  if (config.url.indexOf('/my/') !== -1) {
    Object.assign(config.headers, {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization: store.state.user.token,
    })
  }
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
    ...App,
    store
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