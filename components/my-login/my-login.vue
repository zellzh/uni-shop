<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="btnLogin">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-login">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('user', ['redirectInfo'])
    },
    methods:{ 
      ...mapActions('user', ['setUserInfo', 'setToken', 'setRedirectInfo']),
      async btnLogin() {
        const [err, res] = await uni.getUserProfile({desc: '用户登录授权'})
        if (err || res.errMsg !== "getUserProfile:ok") return uni.$showMsg({title: '取消登录授权'})
        
        // 保存到 vuex
        this.setUserInfo(res.userInfo)
        
        // 获取登录 token
        this.getToken(res)
        
        // 登录跳转
        this.navigateBack()
      },
      async getToken(info) {
        // 调用微信登录接口获取登录凭证 code
        const [err, res] = await uni.login().catch(err => err)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
      
        // 准备参数对象
        const query = {
          code: res.code,
          ...info
        }
        
        // 将 code 等参数发给后台换取用户登录信息(openid, token 等)
        // 这里后端需要做第三方登录 oauth2.0 验证, 会绑定 appid, 所以自己开发的小程序调用不了
        // const {message, meta} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // if (meta.status !== 200) return uni.$showMsg('登录失败！')
        // this.setToken({token: message.token})
        
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
        this.setToken({token})
      },
      navigateBack() {
        if (!this.redirectInfo) return
        const {type, from} = this.redirectInfo
        if (type === 'switchTab') {
          uni.switchTab({
            url: from,
            success: () => {
              this.setRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 80rpx;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 200rpx;
    margin: 30rpx 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-login {
    font-size: 12px;
    color: gray;
  }
}
</style>