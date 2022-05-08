<template>
  <view class="cart-container" v-if="cart.length">
    <!-- 地址区域 -->
    <my-address></my-address>
    
    <!-- 购物车标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop" size="17"></uni-icons>
      <text>购物车</text>
    </view>
    
    <!-- 购物车列表 -->
    <view class="cart-list" @click="go2detail">
      <uni-swipe-action>
        <block v-for="(item, i) in cart" :key='item.goods_id'>
          <uni-swipe-action-item :right-options="options" @click="clickBtn($event, item)">
            <goods-item :goods="item" :data-id='item.goods_id'
                        radio @radio-toggle="radioToggle"
                        numBox @num-change='numChange'/>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
    </view>
    
    <!-- 结算位置 -->
    <cart-settle></cart-settle>
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import tabbarBadge from '@/mixins/tabbar_badge.js'
  export default {
    mixins: [tabbarBadge],
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }]
      };
    },
    computed: {
      ...mapState('cart', ['cart']),
    },
    methods: {
      ...mapActions('cart', ['operateCart']),
      go2detail(e) {
        const goods_id = e.target.dataset.id
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?id=${goods_id}`
        })
      },
      radioToggle(val) {
        this.operateCart({cartItem: val, tag: 'state'})
      },
      numChange(val) {
        this.operateCart({cartItem: val, tag: 'count'})
      },
      clickBtn(e, goods) {
        if (e.content.text === '删除') {
          this.operateCart({cartItem: goods, tag: 'del'})
        }
      }
    }
  }
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 100rpx;
}

// 购物车标题
.cart-title {
  height: 80rpx;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 10rpx;
  border-bottom: 1px solid #efefef;
  
  text {
    margin-left: 20rpx;
  }
}

// 购物车为空时
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 300rpx;

  .empty-img {
    width: 300rpx;
    height: 300rpx;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 30rpx;
  }
}
</style>
