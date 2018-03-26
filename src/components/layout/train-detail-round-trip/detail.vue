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
        goInfo: '',
        backInfo: '',
        goSeat: '',
        backSeat: '',
        bookingDate: ''
      }
    },
    methods: {
      ...mapActions('history', [
        'getRoundTripInfo',
        'recordRoundTripSeat'
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
        // 缓存用户选择的往返坐席
        this.recordRoundTripSeat({goSeat, backSeat})
        let {
          from_station,
          to_station,
          train_code,
          train_no
        } = this.$route.query
        let { from_station_name, to_station_name } = this.goInfo
        this.$router.push({name: 'trainOrderRoundTrip', query: {from_station, from_city: from_station_name, to_station, to_city: to_station_name, train_code, train_no, date: this.bookingDate}})
      }
    },
    created () {
      this.requestTrainInfo()
      this.bookingDate = this.$route.query.date
    }
  }
</script>
