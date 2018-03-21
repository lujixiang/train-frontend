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
          <div :key="item.price" @click="selectSeat(item)" class="seat-box" :class="item.price === selectedSeatLabel ? 'active' : ''">
            <span class="selected">
              <img :src="selectedIcon">
            </span>
            <span class="seat-level">{{item.label}}</span>
            <span class="price">&yen; {{info.info[item.price]}}</span>
            <span class="left">{{info.info[item.left]}} 张</span>
            <span class="standard">
              <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
              <span>超标</span>
            </span>
          </div>
        </template>
      </template>
      <!-- <div class="seat-box">
        <span class="seat-level">二等座</span>
        <span class="price">&yen; 262</span>
        <span class="left">3 张</span>
        <span class="standard">
          <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
          <span>超标</span>
        </span>
      </div>
      <div class="seat-box">
        <span class="seat-level">二等座</span>
        <span class="price">&yen; 262</span>
        <span class="left">3 张</span>
        <span class="standard">
          <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
          <span>超标</span>
        </span>
      </div>
      <div class="seat-box">
        <span class="seat-level">二等座</span>
        <span class="price">&yen; 262</span>
        <span class="left">3 张</span>
        <span class="standard">
          <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
          <span>超标</span>
        </span>
      </div>
      <div class="seat-box active">
        <span class="selected">
          <img :src="selectedIcon">
        </span>
        <span class="seat-level">二等座</span>
        <span class="price">&yen; 262</span>
        <span class="left">3 张</span>
        <span class="standard">
          <ykb-icon type="iconWarn" :width="12" :height="12"></ykb-icon>
          <span>超标</span>
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  const selectedIcon = require('./images/seat-sel.svg')
  // const _ = require('lodash')
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
        selectedSeatLabel: ''
      }
    },
    methods: {
      selectSeat (seat) {
        this.selectedSeatLabel = seat.price
        const backorgo = this.backorgo
        this.$emit('selected', {seat, backorgo})
        console.log(seat)
        // console.log(this.$props.info)
      }
    }
  }
</script>
