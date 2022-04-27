<template>
  <view class="cate-container">
    <!-- 搜索区域 -->
    <search class="search"></search>
    
    <!-- 滚动区域 -->
    <view class="scroll-container">
      <!-- 左侧滚动菜单 -->
      <scroll-view class="cate-top" scroll-y @click="changeActive">
      <!-- <scroll-view class="cate-top" scroll-y @click="changeActive" :style="{height: scrollHeight}"> -->
        <view v-for="(item, i) in cateLv1" :key='item.cat_id' :data-i='i'
              :class="['top-item', i === active ? 'active' : null]">
          {{item.cat_name}}
        </view>
      </scroll-view>
      
      <!-- 右侧滚动列表 -->
      <scroll-view class="cate-sub" scroll-y :scroll-top="scrollTop">
      <!-- <scroll-view class="cate-sub" scroll-y :scroll-top="scrollTop" :style="{height: scrollHeight}"> -->
        <view v-for="(item1,i) in cateLv2" :key='item1.cat_id'>
          <view class="lv2-item">/ {{item1.cat_name}} /</view>
          <view class="lv3-box">
            <navigator class="lv3-item" v-for="(item2, i) in item1.children" :key='item2.cat_id'
                      :url="`/subpkg/goods_list/goods_list?cid=${item2.cat_id}`">
              <image :src="item2.cat_icon" @error="imgError"></image>
              <text>{{item2.cat_name}}</text>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        active: 0,
        cateLv1: [],
        cateLv2: [],
        scrollTop: 0,
        scrollHeight: ''
      };
    },
    methods: {
      // 获取分类数据
      getCateData() {
        uni.$http.get('/api/public/v1/categories')
          .then(({message, meta}) => {
            if (meta.status !== 200) return uni.$showMsg()
            this.replaceUrl(message)
            this.cateLv1 = message
            this.cateLv2 = message[0].children
          })
      },
      // 递归处理图片 url
      replaceUrl(data) {
        if (!Array.isArray(data)) return
        data.forEach(item => {
          if (item.cat_icon) {
            item.cat_icon = item.cat_icon.replace('dev', 'web')
          }
          this.replaceUrl(item.children)
        })
      },
      
      changeActive(e) {
        const i = e.target.dataset.i
        this.active = i
        this.cateLv2 = this.cateLv1[i].children
        this.scrollTop = this.scrollTop === 0 ? '0' : 0
      },
      
      // 计算滚动区域高度: 也可以使用 css3 calc 来计算
      getScrollHeight() {
        // 小程序获取组件信息
        uni.createSelectorQuery().select('.search').boundingClientRect(rect => {
          this.scrollHeight = uni.getSystemInfoSync().windowHeight - rect.height + 'px'
        }).exec()
      }
    },
    
    onLoad() {
      // this.getScrollHeight()
      this.getCateData()
    },
  }
</script>

<style lang="scss">
.cate-container{
  > .scroll-container{
    width: 100%;
    height: calc(100vh - #{$searchHeight});
    display: flex;
    
    // 左侧滚动区域 - 一级菜单
    > .cate-top{
      width: 240rpx;
      background-color: #f7f7f7;
      
      .top-item{
        line-height: 120rpx;
        text-align: center;
        font-size: 12px;
        &.active{
          position: relative;
          background-color: #fff;
          &::before{
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    
    // 右侧滚动区域 - 子菜单
    > .cate-sub{
      // 二级菜单
      .lv2-item{
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
      }
      
      // 三级菜单
      .lv3-box{
        display: flex;
        flex-wrap: wrap;
        
        > .lv3-item{
          width: 33.33%;
          margin-bottom: 20rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          
          image{
            width: 120rpx;
            height: 120rpx;
          }
          
          text{
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
