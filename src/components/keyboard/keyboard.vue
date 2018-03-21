<template>
  <div class="keyboard-container animated fadeInUp">
    <template v-for="i in 11">
      <span v-if="i === 10" v-on:touchstart="clickNumber('X')">X</span>
      <span v-else-if="i === 11" class="zero" v-on:touchstart="clickNumber(0)">0</span>
      <span v-else v-on:touchstart="clickNumber(i)">{{i}}</span>
    </template>
    <!-- v-on:touchstart="handleOnTouchStart" v-on:touchend="handleOnTouchEnd" -->
    <!-- additional
        点击事件由click改为touchstart，为了解决在iOS下有延迟问题
     -->
    <span class="backspace" v-on:touchstart="backspace">
      <img :src="deleteIcon">
    </span>
  </div>
</template>

<script>
  import './less/style.less'
  const deleteIcon = require('./images/delete.svg')
  export default {
    name: 'keyboard',
    props: {
      reset: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    watch: {
      reset: function (e) {
        this.idno = []
        this.$emit('input', this.idno)
      }
    },
    data () {
      return {
        deleteIcon,
        idno: [],
        touchTimer: null
      }
    },
    methods: {
      clickNumber (e) {
        if (this.idno.length === 18) {
          return false
        }
        this.idno.push(e)
        this.$emit('input', this.idno)
      },
      backspace () {
        this.idno.pop()
        this.$emit('input', this.idno)
      },
      handleOnTouchStart () {
        clearInterval(this.touchTimer)
        this.touchTimer = setInterval(_ => {
          this.backspace()
        }, 1)
      },
      handleOnTouchEnd () {
        clearInterval(this.touchTimer)
      }
    }
  }
</script>
