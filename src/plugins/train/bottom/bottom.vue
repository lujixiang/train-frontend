<template>
  <section class="ykb-bottom">
    <div class="logo">
      <p>
        <img class="logo-image" :src="logoIcon" width="94" height="18" alt="logo">
      </p>
      <!-- <p class="confirm">
        <span>
          <img :src="confirmIcon" width="16" height="16" alt="confirm">
          购票快捷
        </span>
        <span>
          <img :src="confirmIcon" width="16" height="16" alt="confirm">
          支付安全
        </span>
        <span>
          <img :src="confirmIcon" width="16" height="16" alt="confirm">
          出票保障
        </span>
      </p> -->
    </div>
  </section>
</template>

<script>
import './less/style.less'
const logoImage = require('@/assets/logo_active.png')
const logoIcon = require('./images/logo.png')
const confirmIcon = require('./images/confirm.png')
export default {
  name: 'bottom',
  data () {
    return {
      logoImage: logoImage,
      confirmIcon: confirmIcon,
      logoIcon: logoIcon
    }
  }
}
</script>
