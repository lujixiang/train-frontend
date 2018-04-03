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
如何办理“变更到站”
http://www.12306.cn/mormhweb/tlcs/201506/t20150610_17005.html
办理变更到站不收取手续费，变更到站只能办理一次。已经办理变更到站的扯破奥不在办理改签。对已经改签的车票不提供此服务。
什么情况下可以办理改签
http://www.12306.cn/mormhweb/tlcs/201505/t20150512_16630.html
开车前48小时（不含）以上，可以改签预售期内的其他列车；开车前48小时以内，可改签开车前的其他列车，也可以改签开车后值片面日期当日24:00之间的其他列车，不办理飘满日期次日以后的改签；
什么是改签
http://www.12306.cn/mormhweb/tlcs/201505/t20150512_16631.html
改签是指旅客变更乘车日期、车次、席位时 需要办理的签证手续
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
