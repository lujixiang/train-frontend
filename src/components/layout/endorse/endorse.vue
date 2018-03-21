<template>
  <div>
    <div class="endorse-content">
      <notice-bar title="改签或变更到站说明" rule="6789"></notice-bar>
      <div class="ykb-cell-group">
        <div @click="isShowCityPicker" class="ykb-cell-list">
          <mt-cell title="修改目的地" :value="toStationName" is-link></mt-cell>
        </div>
        <div @click="showCalendar" class="ykb-cell-list">
          <mt-cell title="修改出发时间" :value="fromTime" is-link></mt-cell>
        </div>
      </div>
      <mt-button type="primary" @click="handleOnendorse" class="endorse-button">改签</mt-button>
    </div>
    <city-picker v-on:listenToChildEvent="handleOnCityPick" v-on:onClickBackButton="isShowCityPicker" :isActive="isCityPickerActive"></city-picker>
    <calendar :defaultStartDate="fromDateObj" :isShowNotice="true" notice="当前车票预售期为30天" model="single" v-on:onClickBackButton="showCalendar" v-on:onDateChange="setDate" :isActive="popupVisible"></calendar>
  </div>
</template>
<!--
距离发车时间超过32分钟的都可以更改目的地
距离发车时间大于48小时以上，可改签车次、日期；
距离发车时间小于48小时，只可改签至票面当天最晚24点之前有余票车次；
-->
<script>
  import './less/style.less'
  // const G = require('@/definition/g')
  import { mapActions } from 'vuex'
  const moment = require('moment')
  export default {
    name: 'endorse',
    data () {
      return {
        fromStationName: '',
        fromStationCode: '',
        toStationName: '',
        toStationCode: '',
        fromTime: '',
        fromDate: '',
        fromDateObj: moment(),
        isCityPickerActive: false,
        popupVisible: false
      }
    },
    methods: {
      ...mapActions('order', [
        'getOrderDetailByOrderId'
      ]),
      getOrderDetail () {
        let callback = res => {
          this.fromStationName = res.from_station_name
          this.fromStationCode = res.from_station_code
          this.toStationName = res.to_station_name
          this.toStationCode = res.to_station_code
          this.fromTime = res.start_date + ' ' + res.start_week
          this.fromDate = moment(res.traintime).format('YYYY-MM-DD')
          this.fromDateObj = moment(res.traintime)
        }
        let errcallback = err => {
          console.log(err)
        }
        // let args = { orderid: '201711061719027580' }
        let { userkeys, orderId } = this.$route.query
        let args = {orderid: orderId, userkeys}
        this.getOrderDetailByOrderId({args, callback, errcallback})
      },
      handleOnendorse () {
        this.$router.push({name: 'TrainList', query: {fromCity: this.fromStationName, toCity: this.toStationName, date: this.fromDate, trainType: 0, fromStation: this.fromStationCode, toStation: this.toStationCode}})
      },
      handleOnCityPick (args) {
        this.toStationName = args.city[0]
        this.toStationCode = args.city[4]
      },
      isShowCityPicker () {
        let { traintime } = this.$store.state.order.orderDetail
        if (moment(Date.now()).add(32, 'minutes').isAfter(traintime)) {
          this.Toast({
            message: '离发车时间不超过32分钟，无法更改目的地',
            position: 'bottom',
            duration: 5000
          })
          return false
        }
        this.isCityPickerActive = !this.isCityPickerActive
      },
      showCalendar () {
        let { traintime } = this.$store.state.order.orderDetail
        if (moment(Date.now()).add(48, 'hours').isAfter(traintime)) {
          this.Toast({
            message: '离出发时间不足48小时，只能改签当天的车次',
            position: 'bottom',
            duration: 5000
          })
          return false
        }
        this.popupVisible = !this.popupVisible
      },
      setDate (args) {
        this.fromDate = args.date.moment.format('YYYY-MM-DD')
        this.fromDateObj = args.date.moment
        this.fromTime = args.date.moment.format('MM月DD日') + ' ' + args.date.moment.format('dddd')
      }
    },
    created () {
      this.getOrderDetail()
    }
  }
</script>
