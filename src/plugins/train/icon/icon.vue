<template>
  <img v-if="solo" :src="types[type]" :class="className" @click="onclick" :width="width" :height="height" alt="">
  <span v-else class="ykb-icon" :class="className" @click="onclick">
    <img :src="types[type]" :width="width" :height="height" alt="">
  </span>
</template>
<script>
  import './less/style.less'
  const types = require('./svgs')
  export default {
    name: 'ykbIcon',
    props: {
      type: String,
      className: String,
      width: {
        type: Number,
        default: 32,
        require: false
      },
      height: {
        type: Number,
        default: 32,
        require: false
      },
      onclick: {
        type: Function,
        default: _ => {},
        require: false
      },
      solo: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        types
      }
    }
  }
</script>
