<template>
  <div class="ykb-train-nsr">
    <div class="body">
      <img class="bgimg" :src="nsrIcon" alt="">
      <span class="notice">抱歉，没有符合条件的车次</span>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  const nsrIcon = require('./images/pic-no-ticket-tips-2.png')
  export default {
    name: 'NSR',
    data () {
      return {
        nsrIcon
      }
    }
  }
</script>
