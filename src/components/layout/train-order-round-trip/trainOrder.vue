<template>
  <div>
    <div class="train-round-trip-order-content">
      <ticketCard :ticket="ticket" :seatObj="seatLevel" :priceObj="ticketPrice" trips="double"></ticketCard>
      <notice-bar title="购票须知" v-on:noticeClick="handleNoticeClick"></notice-bar>
      <passenger-round-trip :ticket="ticket" :goSeat="seatLevel.go" :backSeat="seatLevel.back" v-on:passengerChange="handleOnPassengerChange" :action="action"></passenger-round-trip>
      <template v-if="isAllowOnlineSeatSelect">
        <online-seat-selection trips="double" :backType="seatLevel.back" :goType="seatLevel.go" :goCountSeats="goCountSeats" :backCountSeats="backCountSeats" v-on:selectedSeats="handleOnSelectedSeats"></online-seat-selection>
      </template>
      <div class="service-fee">
        <mt-cell title="服务费">
          <span>&yen; 5.00/张</span>
        </mt-cell>
      </div>
      <p class="service-fee-instruction">服务费对应发票，将在每月通过统一开票方式开具给贵公司。</p>
      <p class="need-to-know">点击提交标识已阅读并同意<span @click="handleNoticeClick">购票须知</span></p>
      <div class="footer">
        <span @click="priceDetail" class="total-price">
          <span>订单总额：</span>
          <span>&yen; {{this.totalPrice}}</span>
          <span>
            <img :src="upOrDownIcon" width="16" alt="direction icon">
          </span>
        </span>
        <span class="booking">
           <button @click="beforeBooking">提交</button>
        </span>
      </div>
      <mt-popup v-model="isPopupActive" class="fee" position="bottom">
        <div class="seat-detail">
          <div class="seat-cell">
            <span>{{seatLevel.go}}</span>
            <span>&yen; {{ticketPrice.go}} &times; {{goTicketsCount}}</span>
          </div>
          <div class="seat-cell">
            <span>{{seatLevel.back}}</span>
            <span>&yen; {{ticketPrice.back}} &times; {{backTicketsCount}}</span>
          </div>
          <div class="seat-cell">
            <span>服务费</span>
            <span>&yen; 5 &times; {{goTicketsCount + backTicketsCount}}</span>
          </div>
        </div>
      </mt-popup>
    </div>
    <guid-instruction></guid-instruction>
    <text-alert :active="$store.state.IS_MIDNIGHT && !$store.state.IS_MIDNIGHT_NOTICED" v-on:iknow="doNotShowAgain()"></text-alert>
    <train-rules :active="isShowTrainRules" v-on:close="handleNoticeClick"></train-rules>
  </div>
</template>
<!-- 二代身份证：1；港澳通行证：C；台湾通行证：G；护照:B -->
<script>
  import './less/style.less'
  import { mapActions, mapState } from 'vuex'
  const _ = require('lodash')
  const moment = require('moment')
  const G = require('@/definition/g')
  const Big = require('big.js')
  export default {
    name: 'trainOrder',
    data () {
      return {
        ticket: '',
        ticketPrice: '',
        seatLevel: '',
        zwcode: '',
        zwname: '',
        totalPrice: 0,
        passengers: [],
        isPopupActive: false,
        companySettings: {},
        selectedSeats: {choose_seats: {}},
        avaliableSeat: ['商务座', '一等座', '二等座'],
        standard: '',
        isShowTrainRules: false
      }
    },
    computed: {
      ...mapState({
        action: state => {
          if (state.company.companySettings && state.company.companySettings.action) {
            return state.company.companySettings.action
          }
          return ''
        }
      }),
      upOrDownIcon () {
        return require(`./images/icon-${this.isPopupActive ? 'down' : 'up'}.png`)
      },
      isAllowOnlineSeatSelect () {
        // 是不是允许在线选座
        let isAllow = false
        _.forEach(this.avaliableSeat, e => {
          if (e === this.seatLevel.go || e === this.seatLevel.back) {
            isAllow = true
          }
        })
        return isAllow
      },
      goCountSeats () {
        return this.avaliableSeat.indexOf(this.seatLevel.go) < 0 ? 0 : this.goTicketsCount
      },
      backCountSeats () {
        return this.avaliableSeat.indexOf(this.seatLevel.back) < 0 ? 0 : this.backTicketsCount
      },
      goTicketsCount () {
        return _.filter(this.passengers, e => {
          return e.trip === 'all' || e.trip === 'go'
        }).length
      },
      backTicketsCount () {
        return _.filter(this.passengers, e => {
          return e.trip === 'all' || e.trip === 'back'
        }).length
      }
    },
    methods: {
      ...mapActions(['handleMidnightNoticeStatus', 'handleIsMidnight']),
      ...mapActions('train', ['bookingRoundTrip']),
      ...mapActions('history', ['getRoundTripInfo', 'getRoundTripSeat']),
      ...mapActions('company', ['getCompanySettings', 'clearDataFromLocalStorage', 'getLocalStandard']),
      handleNoticeClick () {
        this.isShowTrainRules = !this.isShowTrainRules
      },
      handleGetTravelStandard () {
        let callback = res => {
          let s = ''
          _.forEach(res.list, (item, i) => {
            s += item.traintype + '|' + item.seattype + ','
          })
          s = s.replace(/,$/, '')
          this.standard = s
        }
        this.getLocalStandard({callback})
      },
      doNotShowAgain () {
        this.handleMidnightNoticeStatus({isActive: true})
        this.booking()
      },
      handleOnDataLoaded (e) {
        if (e.nightOrderFlag) {
          this.handleIsMidnight({isActive: true})
        }
      },
      handleOnSelectedSeats (e) {
        this.selectedSeats = e
      },
      beforeBooking () {
        const callback = () => {
          this.booking()
        }
        this.handleIsMidnight({callback})
      },
      booking () {
        let passengers = {go: [], back: []}
        let isTestedThrough = true
        if (this.passengers.length === 0) {
          this.Toast({
            message: '请选择乘车人',
            position: 'bottom',
            duration: 5000
          })
          return false
        }
        this.passengers.forEach(item => {
          if (item.IdNo === '' || !item.IdNo) {
            isTestedThrough = false
          }
          let passenger = {
            passengersename: item.Name,
            recipientphone: item.CellPhone,
            passportseno: item.IdNo,
            piaotype: '1',
            piaotypename: '成人票',
            passporttypeseid: item.idTypeID,
            userkey: item.UserKey,
            isOuter: item['isOuter'],
            trip: item.trip
          }
          if (item.isOuter) {
            // 外部人员可以添加其它证件
            if (item.trip === 'all' || item.trip === 'go') {
              passengers.go.push(passenger)
            }
            if (item.trip === 'all' || item.trip === 'back') {
              passengers.back.push(passenger)
            }
          } else {
            // 内部默认全部为身份证类型
            if (item.trip === 'all' || item.trip === 'go') {
              passengers.go.push({...passenger, passporttypeseidname: '二代身份证', passporttypeseid: '1', piaotypename: '成人票'})
            }
            if (item.trip === 'all' || item.trip === 'back') {
              passengers.back.push({...passenger, passporttypeseidname: '二代身份证', passporttypeseid: '1', piaotypename: '成人票'})
            }
          }
        })
        if (passengers.go.length === 0) {
          this.Toast({
            message: '去程至少选择一个乘客',
            position: 'bottom'
          })
          return false
        }
        if (passengers.back.length === 0) {
          this.Toast({
            message: '返程至少选择一个乘客',
            position: 'bottom'
          })
          return false
        }
        if (!isTestedThrough) {
          this.Toast({
            message: '乘客身份证不能为空',
            position: 'bottom'
          })
          return false
        }
        // create（创建普通订单）\createChange（创建改签订单）
        let { selectedSeats, ticket } = this
        let params = {
          go: JSON.stringify({
            train_date: moment(ticket.go.date).format('YYYY-MM-DD'),
            train_no: ticket.go.info.train_no,
            train_code: ticket.go.info.train_code,
            traintime: ticket.go.date,
            from_station_code: ticket.go.info.from_station_code,
            from_station_name: ticket.go.info.from_station_name,
            to_station_code: ticket.go.info.to_station_code,
            to_station_name: ticket.go.info.to_station_name,
            zwcode: this.zwcode.go,
            zwname: this.zwname.go,
            price: this.ticketPrice.go,
            orderamount: this.totalPrice,
            isneedinsure: false,
            serviceprovider_flag: 'HTHY',
            passengers: passengers.go,
            ticket: ticket.go,
            createType: 'create',
            is_choose_seats: false,
            choose_seats: selectedSeats.choose_seats.gchooseSeats || '',
            travel_standard: this.standard
          }),
          return: JSON.stringify({
            train_date: moment(ticket.back.date).format('YYYY-MM-DD'),
            train_no: ticket.back.info.train_no,
            train_code: ticket.back.info.train_code,
            traintime: ticket.back.date,
            from_station_code: ticket.back.info.from_station_code,
            from_station_name: ticket.back.info.from_station_name,
            to_station_code: ticket.back.info.to_station_code,
            to_station_name: ticket.back.info.to_station_name,
            zwcode: this.zwcode.back,
            zwname: this.zwname.back,
            price: this.ticketPrice.back,
            orderamount: this.totalPrice,
            isneedinsure: false,
            serviceprovider_flag: 'HTHY',
            passengers: passengers.back,
            ticket: ticket.back,
            createType: 'create',
            is_choose_seats: false,
            choose_seats: selectedSeats.choose_seats.bchooseSeats || '',
            travel_standard: this.standard
          })
        }
        this.Indicator.open({text: '提交中...'})
        const callback = res => {
          let result = res
          // 创建订单成功
          // 预订成功后删除traveller,防止下次进来后默认是非当前用户
          this.clearDataFromLocalStorage(['traveler'])
          let url = G.Base64.decode(this.companySettings.callbackURL)
          url = url.indexOf('?') > -1 ? url : url + '?'
          let jumpto = url + '&type=train&goOrderId=' + result.goOrderid + '&returnOrderId=' + result.returnOrderid
          this.Indicator.close()
          window.location.href = jumpto
        }
        const errcallback = e => {
          this.Indicator.close()
          this.Toast({
            message: e.flagmsg,
            position: 'bottom'
          })
        }
        this.bookingRoundTrip({params, callback, errcallback})
      },
      priceDetail () {
        this.isPopupActive = !this.isPopupActive
      },
      requestTrainInfo () {
        let callback = res => {
          this.ticket = res
        }
        this.getRoundTripInfo({callback, args: {}})
      },
      getSelectedSeatInfo () {
        let callback = res => {
          this.zwcode = {go: res.goSeat.code, back: res.backSeat.code}
          this.zwname = {go: res.goSeat.label, back: res.backSeat.label}
          this.ticketPrice = {go: res.goSeat.price, back: res.backSeat.price}
          this.seatLevel = {go: res.goSeat.label, back: res.backSeat.label}
        }
        this.getRoundTripSeat({callback, args: {}})
      },
      handleOnPassengerChange (passengers) {
        let goPrice = 0
        let backPrice = 0
        let count = {go: [], back: []}
        _.forEach(passengers, e => {
          if (e.trip === 'all') {
            count.go.push(e)
            count.back.push(e)
          } else if (e.trip === 'go') {
            count.go.push(e)
          } else if (e.trip === 'back') {
            count.back.push(e)
          }
        })
        goPrice = Big(this.ticketPrice.go).plus(5).times(count.go.length).valueOf()
        backPrice = Big(this.ticketPrice.back).plus(5).times(count.back.length).valueOf()
        this.totalPrice = Big(goPrice).plus(backPrice).valueOf()
        this.passengers = passengers
      }
    },
    created () {
      this.handleGetTravelStandard()
      this.getCompanySettings({
        callback: res => {
          this.companySettings = res
        }
      })
      this.requestTrainInfo()
      this.getSelectedSeatInfo()
    }
  }
</script>
