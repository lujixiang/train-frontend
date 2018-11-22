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
    <order-notice :active="active" rule="overseas" v-on:closeNotice="handleIknow"></order-notice>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  export default {
    name: 'trainDetail',
    data () {
      return {
        goInfo: '',
        backInfo: '',
        goSeat: '',
        backSeat: '',
        active: false
      }
    },
    methods: {
      ...mapActions('history', [
        'getRoundTripInfo',
        'recordRoundTripSeat'
      ]),
      notice () {
        this.active = !this.active
      },
      requestTrainInfo () {
        let callback = res => {
          this.goInfo = res.go
          this.backInfo = res.back
        }
        this.getRoundTripInfo({callback})
      },
      handleOnSelectSeat (args) {
        if (args.backorgo === '去程') {
          this.goSeat = args.seat
        } else if (args.backorgo === '返程') {
          this.backSeat = args.seat
        }
      },
      OnNextStep () {
        let { goSeat, backSeat } = this
        if (goSeat === '') {
          this.Toast({
            message: '请选择去程坐席',
            duration: 2000,
            position: 'bottom'
          })
          return false
        }
        if (backSeat === '') {
          this.Toast({
            message: '请选择返程坐席',
            duration: 2000,
            position: 'bottom'
          })
          return false
        }
        if (this.goInfo.info.to_station_code === 'XJA' || this.goInfo.info.from_station_code === 'XJA' || this.backInfo.info.to_station_code === 'XJA' || this.backInfo.info.from_station_code === 'XJA') {
          this.notice()
        } else {
          // 缓存用户选择的往返坐席
          this.recordRoundTripSeat({goSeat, backSeat})
          this.$router.push({name: 'trainOrderRoundTrip', query: {}})
        }
      },
      handleIknow () {
        this.active = !this.active
        let { goSeat, backSeat } = this
        this.recordRoundTripSeat({goSeat, backSeat})
        this.$router.push({name: 'trainOrderRoundTrip', query: {}})
      }
    },
    created () {
      this.requestTrainInfo()
    }
  }
</script>
