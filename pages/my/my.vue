<template>
  <view class="my-container">
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import tabbarBadge from '@/mixins/tabbar_badge.js'
  import {mapState} from 'vuex'
  
  export default {
    mixins: [tabbarBadge],
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('user', ['token'])
    }
  }
</script>

<style lang="scss">
.my-container{
  height: 100%;
}
</style>
