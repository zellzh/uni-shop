import mutType from './mutation-type'

export default {
  namespaced: true,
  state() {
    return {
      address: uni.getStorageSync('addr')
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
    }
  }
}