<template>
  <div class="online-seat-selection" :class="isPopupActive ? 'stick-to-the-top' : ''">
    <div class="cell" :class="trips === 'double' ? 'round-trip-cell' : ''" @click="openPopup">
      <div class="left">
        <span>在线选座</span>
      </div>
      <div class="right">
        <span>{{seatsText}}</span>
        <span class="go">去程：{{seatsGoText}}</span>
        <span class="return">返程：{{seatsBackText}}</span>
      </div>
      <ykb-icon :width="12" :height="12" className="entrance" type="disclosureIndicator"></ykb-icon>
    </div>
    <mt-popup v-model="isPopupActive" class="select-seat-popup" position="bottom" :closeOnClickModal="false">
      <template v-if="trips === 'single'">
        <div class="seat-collection">
          <section class="header">
            <template v-if="countSeats - this.selectedSeats.length === 0">
              <h2>席位已选好</h2>
            </template>
            <template v-else>
              <h2>请选择<span>{{countSeats - this.selectedSeats.length}}</span>个席位</h2>
            </template>
            <span>若剩余车票不能满足需求，系统将为您自动分配席位</span>
          </section>
          <section class="body">
            <div class="aisle">
              <span>窗户</span>
            </div>
            <div class="left" v-if="!isCancel">
              <div v-for="i in (countSeats > 1) ? 2 : 1">
                <template v-for="item in seats[type]['left']">
                  <online-seat :count="countSeats" :row="i" v-on:seatClick="handleOnChooseSeat" :isOverflow="outOfRange" :type="item"></online-seat>
                </template>
              </div>
            </div>
            <div class="aisle">
              <span>过道</span>
            </div>
            <div class="right" v-if="!isCancel">
              <div v-for="i in (countSeats > 1) ? 2 : 1">
                <template v-for="item in seats[type]['right']">
                  <online-seat :count="countSeats" :row="i" v-on:seatClick="handleOnChooseSeat" :isOverflow="outOfRange" :type="item"></online-seat>
                </template>
              </div>
            </div>
            <div class="aisle">
              <span>窗户</span>
            </div>
          </section>
          <section class="bottom">
            <template v-if="outOfRange">
              <mt-button type="primary" @click="handleOnConfirm('confirm')">确定</mt-button>
            </template>
            <template v-else>
              <mt-button type="primary" class="unactive" @click="handleOnConfirm('cancel')">取消</mt-button>
            </template>
          </section>
        </div>
      </template>
      <template v-else-if="trips === 'double'">
        <div class="seat-collection seat-collection-round-trip">
          <section class="header">
            <template v-if="goCountSeats - this.selectedGoSeats.length === 0">
              <h2>去程席位已选好</h2>
            </template>
            <template v-else>
              <h2>请选择去程<span>{{goCountSeats - this.selectedGoSeats.length}}</span>个席位</h2>
            </template>
          </section>
          <section class="body">
            <div class="aisle">
              <span>窗户</span>
            </div>
            <div class="left" v-if="!isCancel">
              <div v-for="i in (goCountSeats > 1) ? 2 : 1">
                <template v-for="item in seats[goType]['left']">
                  <online-seat mark="go" :count="goCountSeats" :row="i" v-on:seatClick="handleOnChooseSeat" :isOverflow="goOutOfRange" :type="item"></online-seat>
                </template>
              </div>
            </div>
            <div class="aisle">
              <span>过道</span>
            </div>
            <div class="right" v-if="!isCancel">
              <div v-for="i in (goCountSeats > 1) ? 2 : 1">
                <template v-for="item in seats[goType]['right']">
                  <online-seat mark="go" :count="goCountSeats" :row="i" v-on:seatClick="handleOnChooseSeat" :isOverflow="goOutOfRange" :type="item"></online-seat>
                </template>
              </div>
            </div>
            <div class="aisle">
              <span>窗户</span>
            </div>
          </section>
          <section class="header">
            <template v-if="backCountSeats - this.selectedBackSeats.length === 0">
              <h2>返程席位已选好</h2>
            </template>
            <template v-else>
              <h2>请选择返程<span>{{backCountSeats - this.selectedBackSeats.length}}</span>个席位</h2>
            </template>
          </section>
          <section class="body">
            <div class="aisle">
              <span>窗户</span>
            </div>
            <div class="left" v-if="!isCancel">
              <div v-for="i in (backCountSeats > 1) ? 2 : 1">
                <template v-for="item in seats[backType]['left']">
                  <online-seat mark="back" :count="backCountSeats" :row="i" v-on:seatClick="handleOnChooseSeat" :isOverflow="backOutOfRange" :type="item"></online-seat>
                </template>
              </div>
            </div>
            <div class="aisle">
              <span>过道</span>
            </div>
            <div class="right" v-if="!isCancel">
              <div v-for="i in (backCountSeats > 1) ? 2 : 1">
                <template v-for="item in seats[backType]['right']">
                  <online-seat mark="back" :count="backCountSeats" :row="i" v-on:seatClick="handleOnChooseSeat" :isOverflow="backOutOfRange" :type="item"></online-seat>
                </template>
              </div>
            </div>
            <div class="aisle">
              <span>窗户</span>
            </div>
          </section>
          <section class="bottom">
            <span>若剩余车票不能满足需求，系统将为您自动分配席位</span>
            <template v-if="outOfRange || goOutOfRange && backOutOfRange">
              <mt-button type="primary" @click="handleOnRoundTripSelectedConfirm">确定</mt-button>
            </template>
            <template v-else>
              <mt-button type="primary" class="unactive" @click="handleOnConfirm('cancel')">取消</mt-button>
            </template>
          </section>
        </div>
      </template>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  const _ = require('lodash')
  export default {
    name: 'onlineSeatSelection',
    props: {
      countSeats: {
        type: Number,
        default: 2,
        require: false
      },
      goCountSeats: { // 去程座位个数
        type: Number,
        default: 2,
        require: false
      },
      backCountSeats: {
        type: Number,
        default: 2,
        require: false
      },
      type: {
        type: String,
        default: '二等座',
        require: false,
        validator: (e) => {
          return e === '二等座' || e === '商务座' || e === '一等座'
        }
      },
      goType: {
        type: String,
        default: '二等座',
        require: false,
        validator: (e) => {
          return e === '二等座' || e === '商务座' || e === '一等座'
        }
      },
      backType: {
        type: String,
        default: '二等座',
        require: false,
        validator: (e) => {
          return e === '二等座' || e === '商务座' || e === '一等座'
        }
      },
      trips: {
        type: String,
        default: 'single', // double
        validator: (e) => {
          return e === 'single' || e === 'double'
        },
        require: false
      }
    },
    computed: {
      outOfRange () {
        return this.selectedSeats.length === this.$props.countSeats
      },
      goOutOfRange () {
        return this.selectedGoSeats.length === this.$props.goCountSeats
      },
      backOutOfRange () {
        return this.selectedBackSeats.length === this.$props.backCountSeats
      }
    },
    watch: {
      countSeats (e) {
        // 清除之前选的座位
        this.clearSeats()
      }
    },
    data () {
      return {
        isPopupActive: false,
        seats: {
          '二等座': {
            left: ['A', 'B', 'C'],
            right: ['D', 'F']
          },
          '一等座': {
            left: ['A', 'C'],
            right: ['D', 'F']
          },
          '商务座': {
            left: ['A', 'C'],
            right: ['F']
          }
        },
        selectedSeats: [],
        selectedGoSeats: [], // 去程已选择
        selectedBackSeats: [], // 返程已选择
        seatsText: '',
        seatsBackText: '',
        seatsGoText: '',
        isCancel: false // 多人选座的情况下，取消其中一个人或多个人（少于总人数）的情况下，没有清除选座信息
      }
    },
    methods: {
      handleOnChooseSeat (e) {
        if (!e.mark) {
          if (e.action === 'add') {
            this.selectedSeats.push(e)
          } else if (e.action === 'delete') {
            this.deleteSeat(e)
          }
        } else if (e.mark === 'go') {
          if (e.action === 'add') {
            this.selectedGoSeats.push(e)
          } else if (e.action === 'delete') {
            this.deleteSeat(e)
          }
        } else if (e.mark === 'back') {
          if (e.action === 'add') {
            this.selectedBackSeats.push(e)
          } else if (e.action === 'delete') {
            this.deleteSeat(e)
          }
        }
      },
      deleteSeat (e) {
        if (!e.mark) {
          let index = _.findIndex(this.selectedSeats, (v) => {
            return v.row === e.row && v.value === e.value
          })
          this.selectedSeats.splice(index, 1)
        } else if (e.mark === 'go') {
          let index = _.findIndex(this.selectedGoSeats, (v) => {
            return v.row === e.row && v.value === e.value
          })
          this.selectedGoSeats.splice(index, 1)
        } else if (e.mark === 'back') {
          let index = _.findIndex(this.selectedBackSeats, (v) => {
            return v.row === e.row && v.value === e.value
          })
          this.selectedBackSeats.splice(index, 1)
        }
      },
      openPopup () {
        if (this.$props.trips === 'single') {
          /*
            单程的情况
          */
          if (this.$props.countSeats === 0) {
            this.Toast({
              message: '请先选择乘车人',
              position: 'bottom'
            })
            return false
          }
        } else if (this.$props.trips === 'double') {
          /*
            往返的情况
          */
          if (this.$props.goCountSeats === 0 && this.$props.backCountSeats === 0) {
            this.Toast({
              message: '请先选择乘车人',
              position: 'bottom'
            })
            return false
          }
        }
        this.isPopupActive = true
        this.isCancel = false
      },
      handleOnRoundTripSelectedConfirm () {
        let gf = ''
        let bf = ''
        let gs = ''
        let bs = ''
        let gchooseSeats = ''
        let bchooseSeats = ''
        _.forEach(this.selectedGoSeats, e => {
          // 前排D、F座，后排B、C、D座
          gchooseSeats += e.row + e.value
          if (e.row === 1) {
            gf += e.value
          } else if (e.row === 2) {
            gs += e.value
          }
        })
        gf = gf.split('')
        gs = gs.split('')
        if (gf.length > 0 && gs.length > 0) {
          this.seatsGoText = '前排' + gf.join('、') + '座，' + '后排' + gs.join('、') + '座'
        } else if (gf.length === 0 && gs.length > 0) {
          this.seatsGoText = '后排' + gs.join('、') + '座'
        } else if (gf.length > 0 && gs.length === 0) {
          this.seatsGoText = '前排' + gf.join('、') + '座'
        }
        _.forEach(this.selectedBackSeats, e => {
          // 前排D、F座，后排B、C、D座
          bchooseSeats += e.row + e.value
          if (e.row === 1) {
            bf += e.value
          } else if (e.row === 2) {
            bs += e.value
          }
        })
        bf = bf.split('')
        bs = bs.split('')
        if (bf.length > 0 && bs.length > 0) {
          this.seatsBackText = '前排' + bf.join('、') + '座，' + '后排' + bs.join('、') + '座'
        } else if (bf.length === 0 && bs.length > 0) {
          this.seatsBackText = '后排' + bs.join('、') + '座'
        } else if (bf.length > 0 && bs.length === 0) {
          this.seatsBackText = '前排' + bf.join('、') + '座'
        }
        this.isPopupActive = false
        this.$emit('selectedSeats', {is_choose_seats: true, choose_seats: {gchooseSeats, bchooseSeats}})
      },
      handleOnConfirm (a) {
        if (a === 'cancel') {
          this.isCancel = true
          this.isPopupActive = false
          this.clearSeats()
          return false
        }
        let f = ''
        let s = ''
        let chooseSeats = ''
        _.forEach(this.selectedSeats, e => {
          // 前排D、F座，后排B、C、D座
          chooseSeats += e.row + e.value
          if (e.row === 1) {
            f += e.value
          } else if (e.row === 2) {
            s += e.value
          }
        })
        f = f.split('')
        s = s.split('')
        if (f.length > 0 && s.length > 0) {
          this.seatsText = '前排' + f.join('、') + '座，' + '后排' + s.join('、') + '座'
        } else if (f.length === 0 && s.length > 0) {
          this.seatsText = '后排' + s.join('、') + '座'
        } else if (f.length > 0 && s.length === 0) {
          this.seatsText = '前排' + f.join('、') + '座'
        }
        this.isPopupActive = false
        this.$emit('selectedSeats', {is_choose_seats: true, choose_seats: chooseSeats})
      },
      clearSeats () {
        this.selectedSeats = []
        this.selectedBackSeats = []
        this.selectedGoSeats = []
        this.seatsText = ''
        this.$emit('selectedSeats', {is_choose_seats: false, choose_seats: ''})
      }
    }
  }
</script>
