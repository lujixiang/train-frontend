<template>
  <div>
    <div class="ykb-train-detail">
      <stationInfo :info="trainInfo" v-on:onTimeListClick="handleOnTimeListClick"></stationInfo>
      <datePickerPreviousNext v-on:onDateClicked="handleOnDateClicked" v-on:onChangeDate="handleOnChangeDate"></datePickerPreviousNext>
      <seating :isEmpty="nothingLeft" :info="trainInfo" :bookingDate="bookingDate"></seating>
      <timeList :fromStation="trainInfo.from_station_name" :toStation="trainInfo.to_station_name" :info="trainInfo.info" v-on:onClose="handleOnClose" :title="listTitle" :tableTitle="listTableTitle" :isActive="isActiveTimeList"></timeList>
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
        listTitle: '经停信息',
        listTableTitle: ['站次', '车站', '到时', '发时', '停留'],
        listTableBody: [],
        isActiveTimeList: false,
        trainInfo: {},
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
      handleOnClose () {
        this.isActiveTimeList = !this.isActiveTimeList
      },
      handleOnTimeListClick () {
        this.handleOnClose()
      },
      requestTrainInfo (args = {ajax: false, data: {}}) {
        // 获取单个车次的信息
        let callback = res => {
          this.trainInfo = res
        }
        this.getTrainInfo({callback, args})
      }
    },
    created () {
      this.requestTrainInfo()
      this.bookingDate = this.$route.query.date
    }
  }
</script>
