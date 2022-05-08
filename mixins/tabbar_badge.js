/* 
注: 使用微信小程序原生的 tabbar 时, 需求 tabbar 购物车显示角标, 需要在 tabbar 四个页面都在 onshow 时获取并通过 api 设置, 很消耗性能
解决:
  - 使用原生 tabbar 时, 在 tabbar 页面不显示角标
  - 使用自定义 tabbar, 数据变化时自动重新渲染组件
 */
import {mapState, mapActions} from 'vuex'

export default {
  computed: {
    ...mapState('cart', ['cart'])
  },
  methods: {
    ...mapActions('cart', ['getCartData']),
    setBadge({index = 2, text = '1'}) {
      uni.setTabBarBadge({
        index,
        text,
      })
    }
  },
  async onShow() {
    // 获取购物车数据
    await this.getCartData()
    
    // 设置角标
    const len = this.cart.length
    len && this.setBadge({text: len.toString()})
  },
}