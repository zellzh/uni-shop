<template>
  <view class="user-container">
    <!-- 头像昵称区域 -->
    <view class="user-top">
      <!-- <image :src="userinfo.avatarUrl" class="avatar"></image> -->
      <button class="avatar-box" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <image class="avatar" :src="userinfo.avatarUrl"></image>
      </button> 
      <input type="nickname" @confirm="changeNickName" class="nickname" :value="userinfo.nickName"/>
    </view>
    
    <!-- 面板的列表区域 -->
    <view class="user-panel">
      <!-- 第一个面板 -->
      <view class="panel panel-goods">
        <!-- panel 的 item 项 -->
        <view class="panel-item">
          <text>8</text>
          <text>收藏的店铺</text>
        </view>
        <view class="panel-item">
          <text>14</text>
          <text>收藏的商品</text>
        </view>
        <view class="panel-item">
          <text>18</text>
          <text>关注的商品</text>
        </view>
        <view class="panel-item">
          <text>84</text>
          <text>足迹</text>
        </view>
      </view>
    
      <!-- 第二个面板 -->
      <view class="panel panel-order">
        <!-- 面板的标题 -->
        <view class="order-title">我的订单</view>
        <!-- 面板的主体 -->
        <view class="order-body">
          <!-- 面板主体中的 item 项 -->
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      
      <!-- 第三个面板 -->
      <view class="panel panel-other">
        <view class="panel-item">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-item">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  
  export default {
    name:"my-userinfo",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('user', ['userinfo']),
    },
    methods: {
      ...mapActions('user', ['setUserInfo', 'setToken', 'setAddr']),
      onChooseAvatar(e) {
        let avatarUrl = e.detail.avatarUrl
        
        // 略: 上传图片逻辑
        // wx.uploadFile({
        //   url: 'xxx',
        //   filePath: avatarUrl,
        //   name: 'file',
        //   formData: {
        //     uid
        //   },
        //   success: function (res) {
        //     // 略: 获取服务器回传地址
        //     // 更新本地数据
        //   }
        // })
        
        this.setUserInfo({...this.userinfo, avatarUrl})
      },
      changeNickName(e) {
        let nickName = e.detail.value
        if (nickName === this.userinfo.nickName) return
        // 略: 上传昵称
        this.setUserInfo({...this.userinfo, nickName})
      },
      // 退出登录
      async logout() {
        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？'
        }).catch(err => err)
      
        if (succ && succ.confirm) {
           // 需要清空 vuex 中的 userinfo、token 和 address
           this.setUserInfo({})
           this.setToken({token: ''})
           this.setAddr({})
        }
      }
    },
  }
</script>

<style lang="scss">
.user-container {
  height: 100%;
  // 为整个组件的结构添加浅灰色的背景
  background-color: #f4f4f4;
}

// 头像昵称区域
.user-top {
  height: 400rpx;
  background-color: #c00000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.avatar-box{
  padding: 0;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 5px black;
  background-color: transparent;
  
  .avatar {
    width: 180rpx;
    height: 180rpx;
  }
}
.nickname {
  color: white;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
}

// 面板区域
.user-panel {
  padding: 0 20rpx;
  position: relative;
  top: -20rpx;
  font-size: 15px;
}
.panel {
  background-color: white;
  border-radius: 6rpx;
  margin-bottom: 16rpx;
}

// 第一面板
.panel-goods, .order-body {
  display: flex;
  justify-content: space-around;

  .panel-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-size: 13px;
    padding: 20rpx 0;
  }
}

// 第二面板
.panel-order {
  .order-title {
    line-height: 90rpx;
    padding-left: 20rpx;
    border-bottom: 1px solid #f4f4f4;
  }
  
  .icon {
    width: 70rpx;
    height: 70rpx;
  }
}

// 第三面板
.panel-other {
  .panel-item {
    height: 90rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20rpx;
    border-bottom: 1px solid #f4f4f4;
  }
}
</style>