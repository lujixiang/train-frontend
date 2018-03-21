<template>
  <div class="not-found-404">
    <mt-button class="return-to-first-page" @click="handleBack" type="primary">返回首页</mt-button>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'notFound',
    data () {
      return {

      }
    },
    methods: {
      handleBack () {
        this.$router.push({name: 'Content'})
      }
    }
  }
</script>
