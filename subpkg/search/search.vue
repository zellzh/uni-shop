<template>
  <view class="search-page">
    <!-- 搜索框 -->
    <view class="search-page-bar">
      <uni-search-bar focus :radius="20" cancelButton="none" v-model="kw"
                      @confirm="confirmHandler" @input="inputHandler"/>
    </view>
    <!-- 搜索建议区域 -->
    <view class="sugg-list" v-if="suggList.length !== 0" @click="tapHandler('sugg', $event)">
      <view class="sugg-item" v-for="(item, i) in suggList" 
            :key='item.goods_id' :data-id='item.goods_id'>
        <view class="sugg-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史区域 -->
    <view class="history-box" v-else>
      <view class="history-tip">
        <text>搜索历史</text>
        <uni-icons type="trash" size="20" @click="clearHistory"></uni-icons>
      </view>
      <view class="history-list" @click="tapHandler('history', $event)">
        <view class="history-item" v-for="(item, i) in historyShow" :key='i' :data-kw='item'>
          {{item}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        inputTimeID: null,
        kw: '',
        kwCache: '',
        suggList: [],
        historyList: null,
      }
    },
    computed: {
      historyShow() {
        return this.historyList.slice().reverse()
      }
    },
    methods: {
      inputHandler(val) {
        clearTimeout(this.inputTimeID)
        this.inputTimeID = setTimeout(_ => {
          this.getSearchList(this.kw = val.trim())
        }, 500)
      },
      // 获取搜索建议
      async getSearchList(kw) {
        if (kw === '') return this.suggList = []
        if (this.kwCache === kw) return
        const {message, meta} = await uni.$http.get('/api/public/v1/goods/qsearch', {
          params: {
            query: kw
          }
        })
        if (meta.status !== 200) return uni.$showMsg()
        this.suggList = message.reverse()
        this.kwCache = kw
      },
      confirmHandler() {
        const kw = this.kw
        this.saveHistory(kw)
        this.gotoGoodsList(kw)
        this.kw = ''
      },
      // 跳转详情
      gotoGoodsDetail(id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?id=' + id
        })
      },
      // 跳转商品列表
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      },
      // 点击搜索建议
      tapHandler(type, e) {
        const dataset = e.target.dataset
        switch (type){
          case 'sugg':
            // 跳转详情
            this.gotoGoodsDetail(dataset.id)
            // 保存历史
            this.saveHistory(this.kw)
            this.kw = ''
            break;
          case 'history':
            // 跳转列表
            this.gotoGoodsList(dataset.kw)
            // 保存历史
            this.saveHistory(dataset.kw)
            break;
          default:
            break;
        }
      },
      
      // 搜索历史缓存
      saveHistory(kw) {
        if (kw === '') return
        // 删除重复历史, 达成置顶效果
        const kwIndex = this.historyList.indexOf(kw)
        if (kw && kwIndex !== -1 ) {
          this.historyList.splice(kwIndex, 1)
        }
        this.historyList.push(kw)
        // 设置本地缓存
        uni.setStorageSync('kw', this.historyList)
      },
      // 清空搜索历史
      clearHistory() {
        uni.setStorageSync('kw', this.historyList = [])
      },
    },
    
    // 初始化结束时读取本地缓存
    created() {
      this.historyList = uni.getStorageSync('kw') || []
    }
  }
</script>

<style lang="scss">
// 搜索页
.search-page{
  
}

// 搜索框
.search-page-bar{
  background-color: #c00000;
}

// 搜索建议
.sugg-list{
  padding: 0 10rpx;
  
  > .sugg-item{
    font-size: 12px;
    padding: 28rpx 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    > .sugg-name{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 6rpx;
    }
    
    // 禁用鼠标事件配合事件代理
    > .sugg-name, uni-icons{
      pointer-events: none;
    }
  }
}

// 搜索历史
.history-box{
  padding: 0 24rpx;
}

// 搜索历史 tip
.history-tip{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    font-size: 14px;
    border-bottom: 1px solid #efefef;
    
    uni-icons{
      padding: 10rpx;
    }
}

// 搜索历史列表
.history-list{
  display: flex;
  flex-flow: row wrap;
  margin-right: -10rpx;
  
  .history-item{
    padding: 10rpx 20rpx;
    margin: 20rpx 24rpx 0 0;
    background-color: #efefef;
    border-radius: 4px;
  }
}
</style>
