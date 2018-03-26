<template>
  <div>
    <div class="ykb-train-detail-round-trip">
      <trip-card goback="go" :info="goInfo" v-on:selected="handleOnSelectSeat"></trip-card>
      <div class="empty-block"></div>
      <trip-card goback="back" :info="backInfo" v-on:selected="handleOnSelectSeat"></trip-card>
      <div class="next-step-button-box">
        <span class="next-step-button" @click="OnNextStep">下一步</span>
      </div>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  export default {
    name: 'trainDetail',
    data () {
      return {
        go: '',
        back: '',
        goInfo: {},
        backInfo: {}
      }
    },
    methods: {
      ...mapActions('history', [
        'getRoundTripInfo'
      ]),
      requestTrainInfo () {
        let callback = res => {
          this.goInfo = res.go
          this.backInfo = res.back
        }
        this.getRoundTripInfo({callback})
      },
      handleOnSelectSeat (args) {
        if (args.backorgo === '去程') {
          this.go = args.backorgo
        } else if (args.backorgo === '返程') {
          this.back = args.backorgo
        }
      },
      OnNextStep () {
        if (this.go === '') {
          this.Toast({
            message: '请选择去程坐席',
            duration: 2000,
            position: 'bottom'
          })
          return false
        }
        if (this.back === '') {
          this.Toast({
            message: '请选择返程坐席',
            duration: 2000,
            position: 'bottom'
          })
          return false
        }
      }
    },
    created () {
      this.requestTrainInfo()
    }
  }
</script>
