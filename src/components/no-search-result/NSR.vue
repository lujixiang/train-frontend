<template>
  <div class="ykb-train-nsr">
    <div class="body">
      <img class="bgimg" :src="nsrIcon" alt="">
      <span class="notice">当前网络环境不佳</span>
      <span class="refresh-button" @click="refresh">刷新一下</span>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  const nsrIcon = require('./images/pic-error@2x.png')
  export default {
    name: 'NSR',
    data () {
      return {
        nsrIcon
      }
    },
    methods: {
      refresh () {
        this.$emit('pageRefresh')
      }
    }
  }
</script>
