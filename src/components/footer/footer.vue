<template>
  <footer class="ykb-footer">
    <div class="logo">
      <p>
        <img class="logo-image" :src="logoImage" width="112" height="40" alt="logo">
      </p>
      <p class="confirm">
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
      </p>
    </div>
  </footer>
</template>

<script>
import './less/style.less'
const logoImage = require('@/assets/logo_active.png')
const confirmIcon = require('./images/confirm.png')
export default {
  name: 'footer',
  data () {
    return {
      logoImage: logoImage,
      confirmIcon: confirmIcon
    }
  }
}
</script>
