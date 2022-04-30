<template>
  <!-- hidden | if 防止页面闪烁 -->
  <view class="goodsdetail-container" :hidden="!goodsInfo.goods_name">
    <!-- 轮播图区域 -->
    <swiper indicator-dots autoplay circular :interval="3000" :duration="1000" @click="preview">
      <swiper-item v-for="(item, i) in goodsInfo.pics" :key="item.pics_id">
        <image :src="item.pics_big" :data-i='i'></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info">
      <view class="info-price">
        ￥{{goodsInfo.goods_price}}
      </view>
      <view class="info-desc">
        <view class="goods-name">
          {{goodsInfo.goods_name}}
        </view>
        <view class="goods-collect" @click="takeCollect">
          <uni-icons type="star" size="17" :color="isCollect ? 'red' : 'gray'"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="info-freight">
        快递: {{'免运费'}}
      </view>
    </view>

    <!-- 商品详情页: 通过富文本渲染返回的 html -->
    <rich-text :nodes="goodsInfo.goods_introduce" />

    <!-- 商品导航: 购物车等 -->
    <uni-goods-nav class='goods-nav' fill :options="options" :button-group="buttonGroup" @click="onClick"
      @buttonClick="buttonClick" />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goodsInfo: {},
        isCollect: false,
        // 商品导航配置项
        options: [{
          icon: 'shop',
          text: '店铺',
        }, {
          icon: 'headphones',
          text: '客服',
          info: 2
        }, {
          icon: 'cart',
          text: '购物车',
          info: 2
        }],
        // 右侧按钮配置
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      }
    },
    methods: {
      // 获取数据详情
      async getGoodsDetail(goods_id) {
        const {
          message,
          meta
        } = await uni.$http.get(`/api/public/v1/goods/detail`, {
          params: {
            goods_id
          }
        })
        if (meta.status !== 200) return uni.$showMsg()

        // 后台返回的 html 字符串处理
        let htmlStr = message.goods_introduce
        // 处理 html 字符串的样式问题(e.g: img 底部空格等)
        htmlStr = htmlStr.replace(/<img /g, '<img style="vertical-align: bottom" ')
        // 兼容 ios 低版本图片格式
        message.goods_introduce = htmlStr.replace(/\.webp/g, '.jpg')

        this.goodsInfo = message
      },

      // 点击预览大图
      preview(e) {
        const i = e.target.dataset.i
        // 全屏显示大图
        uni.previewImage({
          // 当前图片
          current: i,
          // 所有图片地址
          urls: this.goodsInfo.pics.map(pic => pic.pics_big)
        })
      },
      
      // 点击收藏
      takeCollect() {
        const isCollect = !this.isCollect
        this.isCollect = isCollect
        uni.showToast({
          title: isCollect ? '收藏成功!' : '取消收藏成功!'
        })
        // 收藏请求逻辑略...
      },

      // 导航左侧点击
      onClick(e) {
        // 跳转
        switch (e.content.text){
          case '客服':
            console.log('跳转到客服')
            break;
          case '购物车':
            uni.switchTab({
              url: '/pages/cart/cart'
            })
            break;
          case '店铺':
            console.log('跳转到店铺')
            break;
          default:
            break;
        }
      },
      // 导航右侧点击
      buttonClick(e) {
        const type = e.content.text
        if (type === '加入购物车') {
          console.log('加入购物车');
        } else {
          console.log('立即购买');
        }
      }
    },
    onLoad(opts) {
      const goodsID = opts.id
      this.getGoodsDetail(goodsID)
    }
  }
</script>

<style lang="scss">
  .goodsdetail-container {
    padding-bottom: 100rpx;
  }

  // 轮播图区域
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息
  .goods-info {
    padding: 20rpx;
    padding-right: 0;
    font-size: 12px;
  }

  .info-price {
    color: #c00000;
    font-size: 18px;
    margin: 20rpx 0;
  }

  .info-desc {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
      padding-right: 20rpx;
    }

    .goods-collect {
      width: 240rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  .info-freight {
    margin: 20rpx 0;
    color: gray;
  }

  // 商品导航
  .goods-nav {
    height: 100rpx;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
  }
</style>
