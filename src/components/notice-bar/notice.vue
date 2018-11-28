<template>
  <div class="ykb-notice-bar">
    <div class="box" @click="handleNoticeClick">
      <ykb-icon className="notice-icon" type="iconSmallWarn" :width="16" :height="16"></ykb-icon>
      <span class="title">{{title}}</span>
      <ykb-icon className="entrance-icon" :width="12" :height="12" type="disclosureIndicator"></ykb-icon>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'noticeBar',
    props: {
      title: String
    },
    data () {
      return {
      }
    },
    methods: {
      handleNoticeClick () {
        this.$emit('noticeClick')
      }
    }
  }
</script>
