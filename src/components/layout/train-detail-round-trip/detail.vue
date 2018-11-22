<template>
  <div>
    <div class="ykb-train-detail-round-trip">
      <trip-card goback="go" :info="goInfo" v-on:selected="handleOnSelectSeat"></trip-card>
      <div class="empty-block"></div>
      <trip-card goback="back" :info="backInfo" v-on:selected="handleOnSelectSeat"></trip-card>
      <!-- 只要选择班次中至少有一次地点为香港，均显示提示 -->
      <template v-if="goInfo.info.to_station_code === 'XJA' || goInfo.info.from_station_code === 'XJA' || backInfo.info.to_station_code === 'XJA' || backInfo.info.from_station_code === 'XJA'">
        <div class="next-step-button-box">
          <span v-if="iKnow" class="next-step-button" @click="OnNextStep">下一步</span>
          <span class="next-step-button" @click="notice" v-else>下一步</span>
        </div>
      </template>
      <template v-else>
         <div class="next-step-button-box">
           <span class="next-step-button" @click="OnNextStep">下一步</span>
         </div>                  
      </template>
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
        active: false,
        iKnow: false
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
        // 缓存用户选择的往返坐席
        this.recordRoundTripSeat({goSeat, backSeat})
        this.$router.push({name: 'trainOrderRoundTrip', query: {}})
      },
      handleIknow () {
        this.active = !this.active
        this.iKnow = true
      }
    },
    created () {
      this.requestTrainInfo()
    }
  }
</script>
