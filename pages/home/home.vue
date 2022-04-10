<template>
  <view class="home-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" 
            :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key='item.goods_id'>
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?id=${item.goods_id}`">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    
    <!-- 导航区域 -->
    <view class="nav-list">
      <view v-for="(item,i) in navList" :key="i"
            @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view>
    
    <!-- 楼层区域 -->
    <view class="floor-list">
      <view class="floor-item" 
            v-for="(item1, i1) in floorList" 
            :key='i1'>
        <view class="floor-title">
          <image :src="item1.title.image_src"></image>
        </view>
        <view class="floor-content">
          <navigator class="content-left"
                    :url="item1.contentLeft.url">
            <image :src="item1.contentLeft.image_src" 
                    mode="aspectFill"></image>
          </navigator>
          <view class="content-right">
              <navigator class="content-right-item"
                    v-for="(item2, i2) in item1.contentRight"
                    :url="item2.url"
                    :key='i2'>
                <image :src="item2.image_src" mode="aspectFill"></image>
              </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList: [],
        navList: [],
        floorList: []
      };
    },
    methods: {
      // 获取轮播图
      getSwiperList() {
        uni.$http.get('/api/public/v1/home/swiperdata')
          .then(({message, meta}) => {
            if (meta.status !== 200) return uni.$showMsg()
            this.swiperList = message
          })
      },
      // 获取导航栏
      getNavList() {
        uni.$http.get('/api/public/v1/home/catitems')
          .then(({message, meta}) => {
            if (meta.status !== 200){
              return uni.$showMsg()
            }
            this.navList = message
          })
      },
      // 获取楼层
      getFloorList() {
        uni.$http.get('/api/public/v1/home/floordata')
          .then(({message, meta}) => {
            if (meta.status !== 200) return uni.$showMsg()
            this.floorList = message.map(item => {
              item.product_list.forEach(prod => {  
                prod.url = '/subpkg/goods_list/goods_list?' + /(?<=\?).+=.*/g.exec(prod.navigator_url)[0]
              })
              return {
                title: item.floor_title,
                contentLeft: item.product_list[0],
                contentRight: item.product_list.slice(1)
              }
            })
          })
      },
      // 导航点击跳转
      navClickHandler(navItem) {
        switch (navItem.name){
          case '分类':
            uni.switchTab({
              url: '/pages/cate/cate'
            })
            break;
          default:
            break;
        }
      },
    },
    onLoad(opts) {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    }
  }
</script>

<style lang="scss">
  // swiper 区域
  swiper {
    width: 100%;
    height: 340rpx;
    
    .swiper-item, .swiper-item>image{
      width: 100%;
      height: 100%;
    }
  }
  
  // nav 区域
  .nav-list{
    display: flex;
    justify-content: space-around;
    padding: 15rpx 0;
    
    .nav-img{
      width: 128rpx;
      height: 140rpx;
    }
  }
  
  // floor 区域
  .floor-list{
    .floor-item{
      margin-top: 20rpx;
      .floor-title{
        image{
          width: 100%;
          height: 60rpx;
        }
      }
      .floor-content{
        display: flex;
        height: 450rpx;
        .content-left{
          &>image{
            width: 240rpx;
            height: 100%;
          }
        }
        .content-right{
          display: flex;
          flex-flow: row wrap; 
          justify-content: space-around;
          align-content: space-between;
          margin-left: 10rpx;
          .content-right-item{
            &>image{
              width: 240rpx;
              height: 220rpx;
            }
          }
        }
      }
    }
  }
</style>
