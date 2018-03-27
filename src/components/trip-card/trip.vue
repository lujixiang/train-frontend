<template>
  <div class="trip-card-info-container">
    <div class="trip">
      <div class="label">
        <span>
          <img :src="goBackIcon">
        </span>
        <span>{{info.from_date}}</span>
        <span>{{backorgo}}</span>
      </div>
      <div class="station-info">
        <div class="from">
          <time class="from-time">{{info.start_time}}</time>
          <span class="station-name">{{info.from_station_name}}</span>
        </div>
        <div class="train-number">
          <div class="total-time">{{info.run_time_text}}</div>
          <div class="arrow">
            <ykb-icon type="ticketToE4" :solo="true" :height="9"></ykb-icon>
          </div>
          <div class="number">{{info.train_code}}</div>
        </div>
        <div class="to">
          <time class="to-time">{{info.arrive_time}}</time>
          <span class="station-name">{{info.to_station_name}}</span>
        </div>
      </div>
    </div>
    <div class="seats">
      <template v-for="item in seats">
        <template v-if="info.info[item.left] !== '--'">
          <div :key="item.price" @click="selectSeat({price: info.info[item.price], left: info.info[item.left], label: item.label, code: item.code, trainType: info.info['train_type']})" class="seat-box" :class="item.label === selectedSeatLabel ? 'active' : ''">
            <!-- {{info.info[item.left]}} -->
            <span class="selected">
              <img :src="selectedIcon">
            </span>
            <span class="seat-level">{{item.label}}</span>
            <span class="price">&yen; {{info.info[item.price]}}</span>
            <span class="left">{{info.info[item.left]}} 张</span>
            <template v-if="!handleIsUnderTravelStandard({trainType: info.info['train_type'], label: item.label})">
              <span class="standard">
                <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
                <span>超标</span>
              </span>
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const selectedIcon = require('./images/seat-sel.svg')
  const _ = require('lodash')
  const g = require('@/definition/g')
  const seats = g.seats // _.cloneDeep(g.seats)
  export default {
    name: 'tripCard',
    props: {
      goback: {
        type: String,
        require: false,
        validator: (e) => {
          return e === 'go' || e === 'back'
        },
        default: 'go'
      },
      info: {
        type: Object,
        require: false,
        default: {}
      }
    },
    computed: {
      goBackIcon: function () {
        return require(`./images/way-${this.$props.goback}.svg`)
      },
      backorgo: function () {
        return this.$props.goback === 'back' ? '返程' : '去程'
      }
    },
    data () {
      return {
        selectedIcon,
        seats,
        selectedSeatLabel: '',
        standard: ''
      }
    },
    methods: {
      ...mapActions('company', [
        'isStandardSeat',
        'getLocalStandard'
      ]),
      handleGetTravelStandard () {
        let callback = res => {
          this.standard = res
        }
        this.getLocalStandard({callback})
      },
      handleIsUnderTravelStandard (seat) {
        if (this.standard === '') {
          this.handleGetTravelStandard()
        }
        let { trainType, label } = seat
        let { standard } = this
        if (trainType === 'C' || trainType === 'G') {
          // 高铁标准
          trainType = 'G'
        } else if (trainType === 'D') {
          // 动车标准
          trainType = 'D'
        } else {
          // 其他车次标准
          trainType = 'O'
        }
        let hasStandard = false
        let isStandard = false
        let seats = []
        _.forEach(standard.list, item => {
          if (item.traintype === trainType) {
            // 找到对应的合规车次
            hasStandard = true
            if (item.seattype.indexOf(';') > -1) {
              seats = item.seattype.split(';')
              if (seats.indexOf(label) > -1) {
                // 找到对应的车次，并找到该车次下符合标准的座席
                isStandard = true
              } else {
                // 找到对应的车次，但是没有找到对应车次的座席
                isStandard = false
              }
            } else {
              if (item.seattype === '') {
                isStandard = false
              } else {
                seats = item.seattype
                if (seats === label) {
                  isStandard = true
                } else {
                  isStandard = false
                }
              }
            }
          }
        })
        if (!hasStandard) {
          // 没有找到对应的车次，也没有找到对应的座席
          return false
        }
        return isStandard
      },
      selectSeat (seat) {
        this.selectedSeatLabel = seat.label
        const backorgo = this.backorgo
        this.$emit('selected', {seat, backorgo})
        // console.log(this.$props.info)
      }
    },
    created () {
      this.handleGetTravelStandard()
    }
  }
</script>
