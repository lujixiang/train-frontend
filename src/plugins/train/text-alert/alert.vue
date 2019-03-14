<template>
  <div class="text-alert-box">
    <mt-popup v-model="active" popup-transition="popup-fade">
      <div class="inside">
        <div class="top">
          <img width="100%" height="auto" :src="bg">
          <span>温馨提示</span>
        </div>
        <div class="txt">
          23:00-06:00 为 12306 系统维护时间，此时段内的订单将在 06:00 后为您出票。急需购票，请至铁路车站窗口办理，谢谢！
        </div>
        <span class="i-know-button" @click="iknow()">我知道了</span>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  const bg = require('./images/pic-tip-night.png')
  export default {
    name: 'textAlert',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        bg
      }
    },
    methods: {
      iknow () {
        this.$emit('iknow', true)
      }
    }
  }
</script>
