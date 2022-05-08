import Vue from 'vue'
import Vuex from 'vuex'
import cart from './cart'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  // 模块化 vuex
  modules: {
    cart, // cart 中的数组 cart 访问路径为 cart/cart | store.state.cart.cart
    user,
  }
})