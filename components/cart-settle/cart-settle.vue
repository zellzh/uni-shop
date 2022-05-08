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
      };
    },
    computed: {
      ...mapState('cart', ['cart']),
      // ...mapGetters('cart', ['cartTotal', 'totalPrice']),
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
      settleBtn() {
        this.isSettle = true
        uni.showModal({
          content: '是否去结算',
          complete: () => {
            this.isSettle = false
          }
        })
      },
      checkedAll() {
        this.checkedAllCart(!this.isCheckedAll)
      }
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