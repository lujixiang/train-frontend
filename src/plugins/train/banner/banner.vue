<template>
  <div class="ykb-banner-for-mobil">
    <img class="banner-image" :src="bannerIcon" alt="">
  </div>
</template>

<script>
  import './less/style.less'
  const bannerIcon = require('./images/train-banner.png')
  export default {
    name: 'banner',
    data () {
      return {
        bannerIcon: bannerIcon
      }
    }
  }
</script>
