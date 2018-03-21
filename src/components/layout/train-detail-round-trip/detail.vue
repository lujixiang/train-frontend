<template>
  <div>
    <div class="ykb-train-detail-round-trip">
      <trip-card goback="go" :info="trainInfo" v-on:selected="handleOnSelectSeat"></trip-card>
      <div class="empty-block"></div>
      <trip-card goback="back" :info="trainInfo" v-on:selected="handleOnSelectSeat"></trip-card>
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
        trainInfo: {},
        go: '',
        back: '',
        bookingDate: '',
        nothingLeft: false
      }
    },
    methods: {
      ...mapActions('train', [
        'getTrainInfo',
        'getTrainList'
      ]),
      handleOnChangeDate (args) {
        // 切换日期的时候，从新获取当前车次的不同日期的余票情况
        this.requestTrainList(args)
      },
      handleOnDateClicked (args) {
        this.requestTrainList({date: args})
      },
      requestTrainList (params = {}) {
        let { from_station, to_station, train_code } = this.$route.query
        let { start_time } = this.trainInfo
        let trainDate = this.$route.query.date
        if (params.date) {
          trainDate = params.date.format('YYYY-MM-DD')
        }
        this.bookingDate = trainDate
        let args = {
          start_time,
          train_date: trainDate,
          to_station,
          from_station,
          needdistance: 1,
          train_code,
          purpose_codes: 'ADULT'
        }
        this.Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        // 列表获取完成以后的回调函数
        const callback = (res) => {
          this.Indicator.close()
          if (res.flagcode === '200') {
            this.requestTrainInfo({ajax: true, data: res.data[0]})
            this.nothingLeft = false
          }
        }
        const errcallback = e => {
          this.Toast({
            message: e.flagmsg,
            position: 'bottom',
            duration: 2000
          })
          this.Indicator.close()
          this.nothingLeft = true
        }
        this.getTrainList({args, callback, errcallback})
      },
      requestTrainInfo (args = {ajax: false, data: {}}) {
        // 获取单个车次的信息
        let callback = res => {
          this.trainInfo = res
        }
        this.getTrainInfo({callback, args})
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
        console.log('进来了吧')
      }
    },
    created () {
      this.requestTrainInfo()
      this.bookingDate = this.$route.query.date
    }
  }
</script>
