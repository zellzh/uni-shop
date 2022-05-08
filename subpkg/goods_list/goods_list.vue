<template>
  <view class="goodslist-container" @click='go2detail'>
    <block v-for="(item, i) in goodslist" :key="item.goods_id">
      <goods-item :goods="item" :data-id='item.goods_id'></goods-item>
    </block>
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
      },
      go2detail(e) {
        const goods_id = e.target.dataset.id
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?id=${goods_id}`
        })
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
</style>
