<template>
  <view class="search-component" :style="{'background-color': bgColor}" @click="clickHandler">
    <view class="search-component-bar" :style="{'border-radius': radius + 'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="search-component-placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"search",
    props: {
      radius: {
        type: Number,
        // 单位 rpx
        default: 20
      },
      bgColor: {
        type: String,
        default: '#c00000'
      }
    },
    data() {
      return {
        
      };
    },
    methods: {
      clickHandler() {
        // 跳转页面
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
        
        // 这就是 click.native 的实现原理
        // this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  
.search-component{
  // background-color: #c00000;
  width: 100%;
  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
}

.search-component-bar{
    width: 100%;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    background-color: #fff;
    // border-radius: 15rpx;
  }
  
.search-component-placeholder{
      font-size: 18px;
      margin-left: 10rpx;
    }
</style>
