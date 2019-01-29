<template>
  <div>
    <div class="train-order-content">
      <notice-bar title="购票须知" v-on:noticeClick="handleNoticeClick"></notice-bar>
      <ticketCard :ticket="ticket" :seat="seatLevel" :price="ticketPrice"></ticketCard>
      <passenger-v2 :ticket="ticket" :seat="seatLevel" v-on:passengerChange="handleOnPassengerChange" :action="action"></passenger-v2>
      <template v-if="seatLevel === '商务座' || seatLevel === '一等座' || seatLevel === '二等座'">
        <online-seat-selection :type="seatLevel" :countSeats="this.passengers.length" v-on:selectedSeats="handleOnSelectedSeats"></online-seat-selection>
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
           <button @click="beforeBooking">
             {{submitButtonText}}
           </button>
        </span>
      </div>
      <mt-popup v-model="isPopupActive" class="fee" position="bottom">
        <div class="seat-detail">
          <div class="seat-cell">
            <span>{{seatLevel}}</span>
            <span>&yen; {{ticketPrice}} &times; {{passengers.length}}</span>
          </div>
          <div class="seat-cell">
            <span>服务费</span>
            <span>&yen; 5 &times; {{passengers.length}}</span>
          </div>
        </div>
      </mt-popup>
    </div>
    <text-alert :active="$store.state.IS_MIDNIGHT && !$store.state.IS_MIDNIGHT_NOTICED" v-on:iknow="doNotShowAgain()"></text-alert>
    <train-rules :active="isShowTrainRules" v-on:close="handleNoticeClick"></train-rules>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions, mapState } from 'vuex'
  const _ = require('lodash')
  const moment = require('moment')
  const G = require('@/definition/g')
  const Big = require('big.js')
  import { collectUserAction } from '@/mixins/collect-data'
  const sessionStore = require('@/lib/sessionStorage')['default']

  export default {
    name: 'trainOrder',
    mixins: [collectUserAction],
    data () {
      return {
        ticket: '',
        ticketPrice: '',
        seatLevel: '',
        zwcode: '',
        zwname: '',
        startTime: '',
        totalPrice: 0,
        passengers: [],
        isPopupActive: false,
        companySettings: {},
        selectedSeats: {},
        originalOrderId: '',
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
      submitButtonText () {
        return this.action === 'endorse' ? '改签' : '提交'
      }
    },
    methods: {
      ...mapActions(['handleMidnightNoticeStatus', 'handleIsMidnight']),
      ...mapActions('train', ['getTrainInfo', 'getSeatInfo', 'bookingNow']),
      ...mapActions('company', ['getCompanySettings', 'clearDataFromLocalStorage', 'getLocalStandard']),
      ...mapActions('order', ['cancelOrderByOrderId']),
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
        let { from_station, from_city, to_station, to_city, train_no, train_code, date, serviceProvider } = this.$route.query
        let passengers = []
        let isTestedThrough = true
        if (this.passengers.length === 0) {
          this.Toast({message: '请选择乘车人', position: 'bottom'})
          return false
        }
        this.passengers.forEach(item => {
          if (item.IdNo === '' || !item.IdNo) {
            isTestedThrough = false
          }
          let { isOuter } = item
          let passporttypeseid = '1'
          if (isOuter) {
            passporttypeseid = item.idTypeID
          }
          passengers.push({
            passengersename: item.Name.replace(/ /ig, ''), // 如果是护照订票，证件名不需要空格
            recipientphone: item.CellPhone,
            passportseno: item.IdNo,
            piaotype: '1',
            piaotypename: '成人票',
            passporttypeseid,
            userkey: item.UserKey,
            isOuter
          })
        })
        if (!isTestedThrough) {
          this.Toast({message: '乘客身份证不能为空', position: 'bottom'})
          return false
        }
        // create（创建普通订单）\createChange（创建改签订单）
        let createType
        let orderid
        let approvalFlag
        let ticketChangeInfo = []
        if (this.action === 'endorse') {
          // 改签
          createType = 'createChange'
          orderid = this.$store.state.company.companySettings.orderId
          approvalFlag = this.$store.state.company.companySettings.approvalFlag
          _.forEach(this.$store.state.order.orderDetail.train_passenger, p => {
            if (p.endorse) {
              ticketChangeInfo.push(p)
            }
          })
        } else if (this.action === 'rebooking') {
          orderid = this.$store.state.company.companySettings.orderId
          createType = 'rebooking'
        } else {
          createType = 'create'
        }
        let selectedSeats = this.selectedSeats
        let goQueryKey = sessionStore.get('go_queryKey')
        goQueryKey = (goQueryKey === 'undefined' ? null : goQueryKey)
        let params = {
          queryKey: JSON.parse(goQueryKey),
          train_date: date,
          train_no,
          train_code,
          traintime: date + ' ' + this.startTime,
          from_station_code: from_station,
          from_station_name: from_city,
          to_station_code: to_station,
          to_station_name: to_city,
          zwcode: this.zwcode,
          zwname: this.zwname,
          price: this.ticketPrice,
          orderamount: this.totalPrice,
          isneedinsure: false,
          serviceprovider_flag: serviceProvider, // 创旅天下 HTHY是航天华有
          passengers: JSON.stringify(passengers),
          ticket: JSON.stringify(this.ticket),
          createType,
          orderid,
          ticket_change_info: JSON.stringify(ticketChangeInfo),
          is_choose_seats: false,
          choose_seats: '',
          travel_standard: this.standard,
          approvalFlag, // 是否需要二次审批
          ...selectedSeats
        }
        const callback = res => {
          let result = res
          let { callbackURL } = this.companySettings
          // 创建订单成功
          let { action, orderId } = this.companySettings
          let businessType = ''
          if (action === 'endorse') {
            businessType = 'ticketChange'
          } else if (action === 'rebooking') {
            businessType = 'rebooking'
          }
          if (action === 'endorse' || action === 'rebooking') {
            if (result.flagcode === '200') {
              this.originalOrderId = result.orderid
              if (result.actionType === '0') {
                let successText = ''
                if (action === 'endorse') {
                  successText = G.ENDORSE_SUCCESS_TEXT
                } else if (action === 'rebooking') {
                  successText = G.REBOOKING_SUCCESS_TEXT
                }
                // 改签提交成功
                this.MessageBox.alert(successText, {title: '提示', confirmButtonText: '查看我的订单'})
                .then(action => {
                  // 查看我的订单
                  window.location.href = G.Base64.decode(this.companySettings.returnURL)
                })
              } else if (result.actionType === '1') {
                // 调回出差申请单
                this.MessageBox.alert(G.NEED_APPROVAL_TEXT, {title: '提示', confirmButtonText: '提交审批', cancelButtonText: '取消订单', showCancelButton: true})
                .then(action => {
                  if (action === 'confirm') {
                    /*
                      有些跳转地址没有base64，有些base64，需要判断一下
                    */
                    let url
                    if (callbackURL.indexOf('http') > -1) {
                      // 没有经过base64转义
                      url = callbackURL
                    } else {
                      // 经过base64转义
                      url = G.Base64.decode(callbackURL)
                    }
                    // let url = G.Base64.decode(this.companySettings.callbackURL)
                    url = url.indexOf('?') > -1 ? url : url + '?'
                    let jumpto = url + '&type=train&oldOrderId=' + orderId + '&orderId=' + result.orderid + '&businessType=' + businessType
                    // + '&data=' + JSON.stringify(result)
                    console.log('下单成功回调地址', jumpto)
                    window.location.href = jumpto
                  } else if (action === 'cancel') {
                    this.handleCancelOrderId()
                    return false
                  }
                })
              }
            }
          } else {
            // 预订成功后删除traveller,防止下次进来后默认是非当前用户
            this.clearDataFromLocalStorage(['traveler'])
            // let url = G.Base64.decode(this.companySettings.callbackURL)
            let url
            if (callbackURL.indexOf('http') > -1) {
              url = callbackURL
            } else {
              url = G.Base64.decode(callbackURL)
            }
            url = url.indexOf('?') > -1 ? url : url + '?'
            let jumpto = url + '&type=train&orderId=' + result.orderid
            // + '&data=' + JSON.stringify(result)
            window.location.href = jumpto
          }
        }
        const errcallback = e => {
          this.Toast({message: e.flagmsg, position: 'bottom'})
        }
        this.collectUserData({action: 'train-booking'}, {data: params})
        if (this.action === 'endorse') {
          // 改签需要弹框二次确认
          this.MessageBox.confirm(G.ENDORSE_TEXT, {title: '提示', confirmButtonText: '继续改签', cancelButtonText: '取消改签', showCancelButton: true})
          .then(action => {
            this.bookingNow({params, callback, errcallback})
            // 继续预订
          }).catch(e => {
            // 取消，关闭弹窗
            return false
          })
        } else {
          this.bookingNow({params, callback, errcallback})
        }
      },
      priceDetail () {
        this.isPopupActive = !this.isPopupActive
      },
      requestTrainInfo () {
        let { date } = this.$route.query
        let callback = res => {
          this.startTime = res.start_time
          res['bookingDate'] = moment(date).format('YYYY年MM月DD日')
          this.ticket = res
        }
        this.getTrainInfo({callback, args: {}})
      },
      handleCancelOrderId () {
        let callback = (res) => {
          console.log(res)
          this.Toast({message: '订单已取消', position: 'bottom'})
        }
        let errcallback = (err) => {
          // 取消失败
          console.log(err)
          this.Toast({message: err.flagmsg, position: 'bottom'})
        }
        let orderid = this.originalOrderId
        this.cancelOrderByOrderId({callback, errcallback, args: {orderid}})
      },
      getSelectedSeatInfo () {
        let callback = res => {
          this.zwcode = res.code
          this.zwname = res.label
          this.ticketPrice = res.price
          this.seatLevel = res.label
        }
        this.getSeatInfo({callback, args: {}})
      },
      handleOnPassengerChange (passengers) {
        // this.totalPrice = passengers.length * (this.ticketPrice + 5)
        this.totalPrice = Big(this.ticketPrice).plus(5).times(passengers.length).valueOf()
        this.passengers = passengers
      }
    },
    created () {
      this.handleGetTravelStandard()
      if (this.$store.state.company.companySettings && this.$store.state.company.companySettings.action === 'endorse') {
        // 如果是改签则修改title
        this.$route.meta.title = '改签'
      }
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
