<template>
  <view class="settle-container">
    <!-- 左侧全选按钮 -->
    <label class="radio" @click.stop="checkedAll">
      <radio :checked='isCheckedAll' color="#C00000"/><text>全选</text>
    </label>
    
    <!-- 右侧合计和结算按钮 -->
    <view class="settle-right">
      <view class="settle-amount">
        合计:<text class="amount">￥{{totalPrice}}</text>
      </view>
      <view :class="['btn-settle', isSettle ? 'settle-click' : '']" @click="settleBtn">
        结算({{checkedCount}})
      </view>
    </view>
  </view>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    name:"cart-settle",
    data() {
      return {
        isSettle: false,
        cartTotal: 0,
        totalPrice: 0,
        
        tipsSec: 3,
        tipsTimer: 0
      };
    },
    computed: {
      ...mapState('cart', ['cart']),
      ...mapState('user', ['token', 'address']),
      ...mapGetters('user', ['addrStr']),
      checkedCount() {
        let price = 0
        let total = 0
        let checked = 0
        this.cart.forEach(item => {
          total += item.goods_count
          if (item.goods_state) {
            checked += item.goods_count
            price += item.goods_count * item.goods_price
          }
        })
        this.cartTotal = total
        this.totalPrice = price
        return checked
      },
      isCheckedAll() {
        return this.checkedCount === this.cartTotal
      }, 
    },
    methods: {
      ...mapActions('cart', ['checkedAllCart']),
      ...mapActions('user', ['setRedirectInfo']),
      checkedAll() {
        this.checkedAllCart(!this.isCheckedAll)
      },
      settleBtn() {
        // 判断是否可以结算: 1.是否登录 2.是否勾选  3.是否有地址
        // if (!this.token) return uni.$showMsg({title: '请先登录!'})
        // 未登录自动跳转登录
        if (!this.token) {
          uni.$showMsg({title: '请先登录后再操作!', icon: 'none'})
          return setTimeout(_ => {
            this.isSettle = false
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                // 设置重定向信息, 供登录成功后返回
                this.setRedirectInfo({
                  type: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
          }, 1500)
        }
        if (!this.checkedCount) return uni.$showMsg({title: '请选择要结算商品!', icon: 'none'})
        if (!this.address.telNumber) return uni.$showMsg({title: '请选择收货地址!', icon: 'none'})
        
        this.isSettle = true
        uni.showModal({
          content: '是否去结算',
          success: res => {
            if (res.confirm) {
              // 确定支付
              this.payOrder()
            }
          },
          complete: () => {
            this.isSettle = false
          }
        })
      },
      async payOrder() {
        // 1.小程序创建订单
        const order_number = await this.createOrder()
        // 2.微信创建订单
        const payInfo = await this.prePayment(order_number)
        // 3.发起微信支付
        this.takePayment(payInfo, order_number)
      },
      async createOrder() {
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addrStr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
        }
        const {message, meta} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (meta.status !== 200) return uni.$showMsg({title: '创建订单失败！'})
        return message.order_number
      },
      async prePayment(order_number) {
        if (!order_number) return
        // 注: 微信后端创建订单需要 appid, mchid 等参数用于后续验证, 自己开发的小程序调用不了 (同登录获取 tokoen)
        const {message, meta} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number})
        if (meta.status !== 200) return uni.$showMsg({title: '预付订单失败！'})
        return message.pay
      },
      async takePayment(info, order_number) {
        if (!info) return
        const [err, succ] = await uni.requestPayment(info)
        if (err) return uni.$showMsg({title: '订单支付失败！'})
        // 支付成功后查询支付结果
        const {message, meta} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number})
        // 支付失败
        if (meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 支付成功
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      },
      // 登录倒计时提示
      showLoignTips() {
        this.loginTips(this.tipsSec = 3)
        this.tipsTimer = setInterval(_ => {
          this.loginTips(--this.tipsSec)
          if (this.tipsSec <= 0) {
            clearInterval(this.tipsTimer)
            this.isSettle = false
            uni.switchTab({
              url: '/pages/my/my',
              success: _ => {
                // 设置重定向信息, 供登录成功后返回
                this.setRedirectInfo({
                  type: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
          }
        }, 1000)
      },
      loginTips(n) {
        uni.showToast({
          title: `请先登录! ${n} 秒自动后跳转!`,
          mask: true,
          duration: 1500,
          icon: 'none'
        })
      },
    },
    beforeMount() {
      this.isSettle = false
    }
  }
</script>

<style lang="scss">
.settle-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100rpx;
  padding: 0 10rpx;
  background-color: white;
  font-size: 13px;
  
  position: fixed;
  bottom: 0;
  left: 0;
}

// 左侧全选
.radio{
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  radio {
    padding-left: 10rpx;
    transform: scale(0.8);
  }
}

// 右侧结算
.settle-right{
  display: flex;
  align-items: center;
}
.settle-amount{
  margin-right: 20rpx;

  .amount{
    font-size: 16px;
    color: #c00000;
  }
}
.btn-settle{
  min-width: 200rpx;
  height: 100%;
  line-height: 100rpx;
  padding: 0 10px;
  background-color: #c00000;
  color: white;
  text-align: center;
  font-size: 16px;
}
.settle-click{
  background-color: #c0000066;
}
</style>