<template>
  <div>
    <div class="train-order-content">
      <notice-bar rule="1234" title="购票须知"></notice-bar>
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
  </div>
</template>

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
        startTime: '',
        totalPrice: 0,
        passengers: [],
        isPopupActive: false,
        companySettings: {},
        selectedSeats: {},
        originalOrderId: ''
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
      ...mapActions([
        'handleMidnightNoticeStatus',
        'handleIsMidnight'
      ]),
      ...mapActions('train', [
        'getTrainInfo',
        'getSeatInfo',
        'bookingNow'
      ]),
      ...mapActions('company', [
        'getCompanySettings',
        'clearDataFromLocalStorage'
      ]),
      ...mapActions('order', [
        'cancelOrderByOrderId'
      ]),
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
        let { from_station, from_city, to_station, to_city, train_no, train_code, date } = this.$route.query
        let passengers = []
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
          if (item.isOuter) {
            // 外部人员可以添加其它证件
            passengers.push({
              passengersename: item.Name,
              recipientphone: item.CellPhone,
              passportseno: item.IdNo,
              piaotype: '1',
              piaotypename: '成人票',
              passporttypeseid: item.idtypeid,
              passporttypeseidname: item.idname,
              userkey: item.UserKey,
              isOuter: true
            })
          } else {
            // 内部默认全部为身份证类型
            passengers.push({
              passengersename: item.Name,
              passportseno: item.IdNo,
              passporttypeseid: '1',
              passporttypeseidname: '二代身份证',
              piaotype: '1',
              piaotypename: '成人票',
              recipientphone: item.CellPhone,
              userkey: item.UserKey
            })
          }
        })
        if (!isTestedThrough) {
          this.Toast({
            message: '乘客身份证不能为空',
            duration: 5000,
            position: 'bottom'
          })
          return false
        }
        // create（创建普通订单）\createChange（创建改签订单）
        let createType
        let orderid
        let ticketChangeInfo = []
        if (this.action === 'endorse') {
          // 改签
          createType = 'createChange'
          orderid = this.$store.state.company.companySettings.orderId
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
        let params = {
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
          serviceprovider_flag: 'HTHY',
          passengers: JSON.stringify(passengers),
          ticket: JSON.stringify(this.ticket),
          createType,
          orderid,
          ticket_change_info: JSON.stringify(ticketChangeInfo),
          is_choose_seats: false,
          choose_seats: '',
          ...selectedSeats
        }
        if (this.companySettings.action === '3') {
          params['order_id'] = this.companySettings.orderId
        }
        const callback = res => {
          let result = res
          // 创建订单成功
          let applyType = 15
          let { action } = this.companySettings
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
                    let jumpto = G.Base64.decode(this.companySettings.callbackURL) + '?applyType=' + applyType + '&type=train&orderId=' + result.orderid + '&data=' + JSON.stringify(result)
                    window.location.href = jumpto
                  } else if (action === 'cancel') {
                    this.handleCancelOrderId()
                    return false
                  }
                })
              }
            }
          } else {
            if (action === '1') {
              applyType = 15
            } else if (action === '2') {
              applyType = 14
            } else if (action === '3') {
              applyType = 14
            }
            // 预订成功后删除traveller,防止下次进来后默认是非当前用户
            this.clearDataFromLocalStorage(['traveler'])
            let jumpto = G.Base64.decode(this.companySettings.callbackURL) + '?applyType=' + applyType + '&type=train&orderId=' + result.orderid + '&data=' + JSON.stringify(result)
            window.location.href = jumpto
          }
        }
        const errcallback = e => {
          this.Toast({
            message: e.flagmsg,
            position: 'bottom'
          })
        }
        if (this.action === 'endorse') {
          // 改签需要弹框二次确认
          this.MessageBox.confirm(G.ENDORSE_TEXT, {title: '提示', confirmButtonText: '继续改签', cancelButtonText: '取消改签', showCancelButton: true})
          .then(action => {
            console.log('是不是走到这里了')
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
          this.Toast({
            message: '订单已取消',
            position: 'bottom'
          })
        }
        let errcallback = (err) => {
          // 取消失败
          console.log(err)
          this.Toast({
            message: err.flagmsg,
            position: 'bottom'
          })
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
