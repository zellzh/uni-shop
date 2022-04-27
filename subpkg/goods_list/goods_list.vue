<template>
  <view class="goodslist-container">
    <navigator class="goods-item" v-for="(item, i) in goodslist" :key='item.goods_id'
                :url="`/subpkg/goods_detail/goods_detail?id=${item.goods_id}`">
      <view class="item-left">
        <image :src="item.goods_small_logo || defaultPic" mode="" 
               class="item-thumbnail" lazy-load></image>
      </view>
      <view class="item-right">
        <text class="item-title">{{item.goods_name}}</text>
        <text class="item-price">￥{{item.goods_price | price2Fixed}}</text>
      </view>
    </navigator>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          // 查询参数
          cid: '', 
          query: '',
          // 页码
          pagenum: 1,
          // 每页数据量
          pagesize: 10
        },
        // 数据总数
        total: null,
        goodslist: [],
        defaultPic: '/static/default-medium.png',
        isloading: false
      }
    },
    methods: {
      async getGoodslist(cb) {
        this.isloading = true
        let {message, meta} = await uni.$http.get('/api/public/v1/goods/search', {
          params: this.queryObj
        })
        if (meta.status !== 200) return uni.$showMsg()
        this.goodslist = [...this.goodslist, ...message.goods]
        this.total = this.total || message.total
        this.isloading = false
        cb && cb()
      }
    },
    filters: {
      // 价格格式过滤
      price2Fixed(val) {
        return (+val).toFixed(2)
      }
    },
    onLoad(opts) {
      this.queryObj = {...this.queryObj, ...opts}
      this.getGoodslist()
    }, 
    // 上拉加载更多
    onReachBottom() {
      // 判断数据是否已加载完
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg({title: '数据已全部加载!', icon: 'none'})
      // 防抖, 防止多次触底请求
      if (this.isloading) return
      this.queryObj.pagenum++
      this.getGoodslist()
    },
    //下拉刷新
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pagenum = 1
      this.isloading = false
      this.goodslist = []
      
      // 重新发起请求
      this.getGoodslist(_ => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">
.goodslist-container{
  
}

.goods-item{
  display: flex;
  padding: 20rpx 10rpx;
  border-bottom: 1px solid #f0f0f0;
}
.item-left{
  margin-right: 20rpx;
  
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
  > .item-price{
    font-size: 16px;
    color: #c00000;
  }
}


</style>
