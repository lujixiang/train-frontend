<template>
  <div class="ykb-notice-bar">
    <div class="box" @click="handleClose">
      <ykb-icon className="notice-icon" type="iconSmallWarn" :width="16" :height="16"></ykb-icon>
      <span class="title">{{title}}</span>
      <ykb-icon className="entrance-icon" :width="12" :height="12" type="disclosureIndicator"></ykb-icon>
    </div>
    <order-notice :active="isActive" :rule="rule" v-on:closeNotice="handleClose"></order-notice>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'noticeBar',
    props: {
      title: String,
      rule: String
    },
    data () {
      return {
        isActive: false
      }
    },
    methods: {
      handleClose () {
        this.isActive = !this.isActive
      }
    }
  }
</script>
