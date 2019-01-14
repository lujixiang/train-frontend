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
  import { collectUserAction } from '@/mixins/collect-data'
  export default {
    name: 'trainDetail',
    mixins: [collectUserAction],
    data () {
      return {
        goInfo: '',
        backInfo: '',
        goSeat: '',
        backSeat: ''
      }
    },
    methods: {
      ...mapActions('history', ['getRoundTripInfo', 'recordRoundTripSeat']),
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
          this.Toast({message: '请选择去程坐席', position: 'bottom'})
          return false
        }
        if (backSeat === '') {
          this.Toast({message: '请选择返程坐席', position: 'bottom'})
          return false
        }
        this.collectUserData({action: 'train-seat-level-roundTrip'}, {goSeat, backSeat})
        // 缓存用户选择的往返坐席
        this.recordRoundTripSeat({goSeat, backSeat})
        this.$router.push({name: 'trainOrderRoundTrip', query: {}})
      },
      handleIknow () {
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
