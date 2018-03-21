<template>
  <mt-header class="ykb-header" :fixed="true" :title="title">
    <mt-button slot="left" icon="back" @click="onBackButtonClick">返回</mt-button>
    <mt-button class="right-button-text" slot="right" @click="onRightButtonClick">{{rightButtonText}}</mt-button>
  </mt-header>
</template>

<script>
import './less/style.less'
export default {
  name: 'header',
  data () {
    return {
      headerTitle: '火车票',
      isBackIconVisiable: true // 返回按钮是否显示
    }
  },
  props: {
    onRightButtonClick: {
      type: Function,
      default: _ => {},
      require: false
    },
    rightButtonText: {
      type: String,
      default: '',
      require: false
    },
    onBackButtonClick: {
      type: Function,
      default: _ => {},
      require: false
    },
    title: {
      type: String,
      default: '这个是标题',
      require: true
    }
  },
  watch: {
    '$route': 'onRouterChange'
  },
  methods: {
    onRouterChange () {
      this.headerTitle = this.$route.meta.title
    },
    back () {
      this.$router.go(-1)
    }
  },
  beforeUpdate () {
  },
  mounted () {
    this.headerTitle = this.$route.meta.title
  }
}
</script>
