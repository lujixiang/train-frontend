<template>
  <div id="app">
    <div class="view-box">
      <enhance-header :show="isWechatWork"></enhance-header>
      <router-view :id="[isWechatWork ? '' : 'container']" class="router-view"></router-view>
    </div>
  </div>
</template>

<script>
const fun = require('@/lib/fun')
export default {
  name: 'app',
  data () {
    return {
      isWechatWork: false
    }
  },
  created () {
    // 判断是不是企业微信，如果是企业微信则隐藏头部header
    if (fun.isWechatWork()) {
      this.isWechatWork = true
    }
  },
  mounted () {
    fun.freeStyleLog()
  }
}
</script>
