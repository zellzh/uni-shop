import mutType from './mutation-type'

export default {
  namespaced: true,
  state() {
    return {
      address: uni.getStorageSync('addr'),
      token: uni.getStorageSync('token'),
      userinfo: uni.getStorageSync('userinfo'),
      redirectInfo: null
    }
  },
  getters: {
    addrStr(state) {
      const addr = state.address
      return Object.keys(addr).length ?
        `${addr.provinceName} ${addr.cityName} ${addr.countyName} ${addr.detailInfo}` :
        ''
    }
  },
  mutations: {
    // 更新收货地址
    [mutType.SET_ADDR](state, address) {
      state.address = address
    },
    [mutType.SET_TOKEN](state, token) {
      state.token = token
    },
    [mutType.SET_USERINFO](state, userinfo) {
      state.userinfo = userinfo
    },
    [mutType.SET_REDIRECT_INFO](state, info) {
      state.redirectInfo = info
    }
  },
  actions: {
    setAddr({commit, dispatch}, payload) {
      commit(mutType.SET_ADDR, payload)
      // 本地保存
      dispatch('_saveAddr')
    },
    _saveAddr({state}) {
      return new Promise(resolve => {
        uni.showLoading({
          title: '数据请求中...'
        })
        setTimeout(_ => {
          uni.hideLoading()
          resolve(uni.setStorageSync('addr', state.address))
        }, 500)
      })
    },
    // 设置 token
    setToken({commit}, {token}) {
      commit(mutType.SET_TOKEN, token)
      // 本地保存用户信息
      uni.setStorageSync('token', token)
    },
    // 设置用户信息
    setUserInfo({commit}, payload) {
      commit(mutType.SET_USERINFO, payload)
      // 本地保存用户信息
      uni.setStorageSync('userinfo', payload)
    },
    // 设置重定向信息
    setRedirectInfo({commit}, payload) {
      commit(mutType.SET_REDIRECT_INFO, payload)
    }
  }
}