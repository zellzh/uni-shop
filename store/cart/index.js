import mutType from './mutation-type'

export default {
  // 开启命名空间, 防止 mutations | actions 冲突
  namespaced: true,
  state() {
    return {
      // 购物车包含商品信息: goods_id | goods_name | goods_price | goods_count | goods_small_logo | goods_state(选中状态)
      cart: []
    }
  },
  getters: {
    /*
    cartTotal(state) {
      return state.cart.reduce((c, item) => c += item.goods_count, 0)
    },
    checkedCount(state) {
      return state.cart.reduce((count, item) => {
        if (item.goods_state) {
          count += item.goods_count
        }
        return count
      }, 0)
    },
    totalPrice(state) {
      let res = state.cart.reduce((price, item) => {
        if (item.goods_state) {
          price += item.goods_count * item.goods_price
        }
        return price
      }, 0)
      return res.toFixed(2)
    }
    */
  },
  mutations: {
    [mutType.SET_CART](state, arr) {
      state.cart = arr
    },
    [mutType.ADD_TO_CART](state, goods) {
      state.cart.push(goods)
    },
    [mutType.SET_GOODS_COUNT](state, {goods, g_count}) {
      goods.goods_count = g_count
    },
    [mutType.SET_GOODS_STATE](state, {goods, g_state}) {
      goods.goods_state = g_state
    }
  },
  actions: {
    // 本地存储模拟后台获取数据
    async getCartData({commit}) {
      uni.showLoading({
        title: '数据请求中...'
      })
      let res = await new Promise(resolve => {
        setTimeout(_ => {
          uni.hideLoading()
          resolve(uni.getStorageSync('cart'))
        }, 500)
      })
      commit(mutType.SET_CART, res || [])
    },
    // 操作购物车商品信息
    operateCart({commit, state, dispatch}, payload) {
      // 逻辑处理
      const {tag, cartItem} = payload
      const goods = state.cart.find(x => x.goods_id === cartItem.goods_id)
      
      switch (tag){
        // 添加 | 增加数量
        case 'add':
          if (goods) {
            commit(mutType.SET_GOODS_COUNT, {goods, g_count: goods.goods_count + 1})
          } else{
            commit(mutType.ADD_TO_CART, cartItem)
          }
          break;
          
        // 修改状态
        case 'state':
          if (goods) {
            commit(mutType.SET_GOODS_STATE, {goods, g_state: cartItem.goods_state})
          } else {
            // 重新赋值购物车, 更新界面
            commit(mutType.SET_CART, state.cart.slice())
          }
          break;
          
        // 修改数量
        case 'count':
          if (goods) {
            commit(mutType.SET_GOODS_COUNT, {goods, g_count: cartItem.goods_count})
          } else {
            // 重新赋值购物车, 更新界面
            commit(mutType.SET_CART, state.cart.slice())
          }
          break;
          
        // 删除商品
        case 'del':
          const arr = state.cart.filter(x => x.goods_id !== cartItem.goods_id)
          commit(mutType.SET_CART, arr)
          break;
          
        default:
          break;
      }
      // 操作结束后保存
      dispatch('_saveCart')
    },
    // 购物车全选
    checkedAllCart({commit, state, dispatch}, g_state) {
      state.cart.forEach(goods => {
        commit(mutType.SET_GOODS_STATE, {goods, g_state})
      })
      dispatch('_saveCart')
    },
    // 本地缓存模拟传给后台
    _saveCart({state}) {
      return new Promise(resolve => {
        uni.showLoading({
          title: '数据请求中...'
        })
        setTimeout(_ => {
          uni.hideLoading()
          resolve(uni.setStorageSync('cart', state.cart))
        }, 500)
      })
    }
  }
}