<template>
  <view class="address-container">
    <!-- 新增地址 -->
    <view class="address-choose" v-if="!addrStr">
      <button type="primary" size="mini" @click="chooseAddr">请选择收货地址+</button>
    </view>
    
    <!-- 详细地址信息 -->
    <view class="address-box" @click="chooseAddr" v-else>
      <view class="box-left">
        <uni-icons type="location-filled" size="30" color="#c00000"></uni-icons>
      </view>
      <view class="box-right">
        <view class="address-info">
          <view class="info-my">
            <text class="my-name">{{address.userName}}</text>  
            <text class="my-phone">{{address.telNumber}}</text>
          </view>
          <view class="info-receiving">
            {{addrStr}}返矿塞缝将僧精灵该风的放个返矿塞缝将僧精灵该风的放个返矿塞缝将僧精灵该风的放个
          </view>
        </view>  
        <uni-icons type="forward" size="17"></uni-icons>
      </view>
    </view>
    
    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  
  export default {
    name:"my-address",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('user', ['address']),
      ...mapGetters('user', ['addrStr']),
    },
    methods: {
      ...mapActions('user', ['setAddr']),
      async chooseAddr(e) {
        // 获取微信地址接口
        const [err, res] = await uni.chooseAddress().catch(err => err)
        if (!err && res) {
          this.setAddr(res)
        }
      }
    }
  }
</script>

<style lang="scss">
.address-container{
  
}

// 选择地址
.address-choose{
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 详细地址
.address-box{
  height: 180rpx;
  display: flex;
  align-items: center;
  padding: 20rpx 10rpx;
  
  uni-icons{
    padding: 20rpx 10rpx;
  }
}
.box-left{
  margin-right: 10rpx;
}
.box-right{
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 解决 flex 超出一行显示省略号无效
  flex: 1;
  
  .address-info{
    width: 100%;
  }
  .my-name{
    font-size: 16px;
  }
  .my-phone{
    padding-left: 20rpx;
    color: #7f7f7f;
    font-size: 14px;
  }
  .info-receiving{
    margin-top: 10rpx;
    font-weight: bold;
    font-size: 16px;
    
    // 超出多行省略: 可以不用设置宽度
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 1;
    
    // 单行省略
    width: 580rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 底部边框线
.address-border{
  width: 100%;
  height: 10rpx;
}
</style>