<template>
  <view class="goods-item">
    <view class="item-left">
      <radio v-if="radio" :checked='goods.goods_state' color="#C00000" @click.stop="radioClick"/>
      <image :src="goods.goods_small_logo || defaultPic" mode="" 
             class="item-thumbnail" lazy-load></image>
    </view>
    <view class="item-right">
      <text class="item-title">{{goods.goods_name}}</text>
      <view class="price-box" @click.stop>
        <text class="item-price">￥{{fixedPrice || '9999'}}</text>
        <uni-number-box v-if="numBox" min="1" :value="goods.goods_count" @change="numChange"/>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"goods-item",
    props: {
      goods: {
        type: Object,
        default: {}
      },
      radio: {
        type: Boolean,
        default: false
      },
      numBox: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        
      }
    },
    methods: {
      radioClick() {
        this.$emit('radio-toggle', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      numChange(e) {
        if (e === this.goods.goods_count) return
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          goods_count: e
        })
      }
    },
    computed: {
      fixedPrice() {
        return this.goods.goods_price.toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
.goods-item{
  display: flex;
  padding: 20rpx 10rpx;
  border-bottom: 1px solid #f0f0f0;
}
.item-left{
  margin-right: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  radio {
    padding: 20rpx 10rpx;
    transform: scale(0.8);
  }
  .item-thumbnail{
    width: 200rpx;
    height: 200rpx;
  }
}
.item-right{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  > .item-title{
    font-size: 13px;
  }
}
.price-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  > .item-price{
    font-size: 16px;
    color: #c00000;
  }
}
</style>