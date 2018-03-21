<template>
  <div class="date-select-cell-wrap">
    <div class="date-select-cell" @click.stop="showCalendar">
      <template v-if="model === 'single'">
        <ykb-cell :title="[startDate, '']" :label="[startWeek, '']"></ykb-cell>
      </template>
      <template v-else>
        <div class="ykb-cell">
          <div class="check-date">
            <div class="cell-icon">
              <img width="20" height="20" :src="dateIcon" alt="日期icon">
            </div>
            <div class="check-in">
              <p class="checkin-text">入住</p>
              <p class="checkin-date"><span>{{startDate}}</span><small>{{startWeek}}</small></p>
            </div>
            <div class="to"></div>
            <div class="check-out">
              <p class="checkout-text">离店</p>
              <p class="checkout-date"><span>{{endDate}}</span><small>{{endWeek}}</small></p>
            </div>
          </div>
          <div class="arrow-icon">
            <span class="total-night">{{diff}}晚</span>
            <span>
              <img :src="entranceIcon" width="20" height="20" alt="进入的icon">
            </span>
          </div>
        </div>
      </template>
      <div>
      </div>
    </div>
    <calendar :defaultStartDate="defaultStartDate" :isShowNotice="true" notice="当前车票预售期为30天" model="single" v-on:onClickBackButton="showCalendar" v-on:onDateChange="setDate" :isActive="popupVisible"></calendar>
  </div>
</template>

<script>
  import './less/style.less'
  const dateIcon = require('@/assets/icons/date.png')
  const entranceIcon = require('@/assets/icons/entrance.png')
  const moment = require('moment')
  moment.locale('zh-CN')
  let today = moment()
  let nextDay = moment().add(1, 'day')
  export default {
    name: 'dateSelectCell',
    data () {
      return {
        popupVisible: false,
        dateIcon,
        entranceIcon,
        startDate: today.format('MM月DD日'),
        endDate: nextDay.format('MM月DD日'),
        startWeek: today.format('dddd'),
        endWeek: nextDay.format('dddd'),
        diff: 1,
        defaultStartDate: moment()
      }
    },
    props: {
      model: {
        type: String,
        require: false,
        default: 'single'
      }
    },
    methods: {
      showCalendar () {
        this.popupVisible = !this.popupVisible
      },
      setDate (e) {
        // 如果是单日期
        if (e.type === 'single') {
          this.startDate = e.date.moment.format('MM月DD日')
          this.startWeek = e.date.weekDay
          this.transferDateToParent({type: 'single', startDate: e.date})
          this.defaultStartDate = e.date.moment
        } else if (e.type === 'multi') {
          // 如果是多日期
          this.startDate = e.startDate.moment.format('MM月DD日')
          this.endDate = e.endDate.moment.format('MM月DD日')
          this.startWeek = e.startDate.moment.format('dddd')
          this.endWeek = e.endDate.moment.format('dddd')
          this.diff = e.endDate.moment.diff(e.startDate.moment, 'days')
          this.transferDateToParent({type: 'multi', startDate: e.startDate, endDate: e.endDate})
        }
      },
      transferDateToParent (args) {
        this.$emit('onDateChange', args)
      }
    },
    created () {
      if (this.$props.model === 'single') {
        this.transferDateToParent({type: 'single', startDate: {moment: moment()}})
      } else if (this.$props.model === 'multi') {
        this.transferDateToParent({type: 'multi', startDate: {moment: moment()}, endDate: {moment: moment().add(1, 'day')}})
      }
    },
    mounted () {
      let { date } = this.$route.query
      if (date) {
        let d = moment(date)
        this.defaultStartDate = d
        if (d.isAfter(moment())) {
          this.startDate = d.format('MM月DD日')
          this.startWeek = d.format('dddd')
        }
      }
    }
  }
</script>
