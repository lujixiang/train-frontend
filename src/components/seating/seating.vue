<template>
  <div class="seating-list">
    <template v-if="!isEmpty">
      <template v-for="item in this.seats">
        <template v-if="info.info[item.left] !== '--'">
          <div class="list">
            <span class="level">{{item.label}}</span>
            <span class="price">￥{{info.info[item.price]}}</span>
            <span class="left">{{info.info[item.left]}}张</span>
            <span class="order-button">
              <template v-if="info.info[item.left] === '0'">
                <button class="disable">售完</button>
              </template>
              <template v-else>
                <button @click="booking({price: info.info[item.price], left: info.info[item.left], label: item.label, code: item.code, trainType: info.info['train_type']})">购票</button>
              </template>
            </span>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const moment = require('moment')
  // const _ = require('lodash')
  const g = require('@/definition/g')
  const seats = g.seats // _.cloneDeep(g.seats)
  export default {
    name: 'seating',
    props: {
      info: {
        type: Object,
        default: {},
        require: false
      },
      bookingDate: {
        type: String,
        default: moment().format('YYYY-YY-MM'),
        require: false
      },
      isEmpty: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        seats
      }
    },
    methods: {
      ...mapActions('train', [
        'recordTrainIonfo',
        'getTrainInfo',
        'recordSeatInfo'
      ]),
      ...mapActions('company', [
        'isStandardSeat'
      ]),
      booking (seat) {
        let callback = res => {
          if (res.isStandard) {
            this.directlyBooking(seat)
          } else {
            this.MessageBox.confirm('不符合您的差旅标准，继续预订？', {title: '提示', confirmButtonText: '继续预订'})
            .then(action => {
              this.directlyBooking(seat)
            }).catch(e => {
              console.log(e)
            })
          }
        }
        this.isStandardSeat({...seat, callback})
      },
      directlyBooking (seat) {
        this.recordSeatInfo(seat)
        let {
          from_station,
          to_station,
          train_code,
          train_no
        } = this.$route.query
        let { from_station_name, to_station_name } = this.info
        this.$router.push({name: 'trainOrder', query: {from_station, from_city: from_station_name, to_station, to_city: to_station_name, train_code, train_no, date: this.$props.bookingDate}})
      }
    }
  }
</script>
