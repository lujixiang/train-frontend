<template>
  <div class="date-select-cell-wrap">
    <div class="date-select-cell" @click.stop="showCalendar">
      <template v-if="model === 'single'">
        <ykb-cell :title="[startDate.date, '']" :label="[startWeek, '']"></ykb-cell>
      </template>
      <template v-else-if="model === 'multi'">
        <div class="ykb-cell ykb-cell-without-bottom-border">
          <div class="check-date">
            <div class="check-in">
              <p v-if="startDate.date === '' && startWeek === ''" class="checkin-text">出发日期</p>
              <p v-else class="checkin-date"><span>{{startDate.date}}</span><small>{{startWeek}}</small></p>
            </div>
            <div class="check-out">
              <p v-if="endDate.date === '' && endWeek === ''" class="checkout-text">返程日期</p>
              <p v-else class="checkout-date"><span>{{endDate.date}}</span><small>{{endWeek}}</small></p>
            </div>
          </div>
        </div>
      </template>
      <div>
      </div>
    </div>
    <calendar :defaultStartDate="defaultStartDate" :defaultEndDate="defaultEndDate" :isShowNotice="true" notice="当前车票预售期为30天" :model="model" v-on:onClickBackButton="showCalendar" v-on:onDateChange="setDate" :isActive="popupVisible"></calendar>
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
        startDate: {date: today.format('MM月DD日'), value: today.format('YYYY-MM-DD')},
        endDate: {date: nextDay.format('MM月DD日'), value: nextDay.format('YYYY-MM-DD')},
        startWeek: today.format('dddd'),
        endWeek: nextDay.format('dddd'),
        defaultStartDate: moment(),
        defaultEndDate: moment().add(1, 'day')
      }
    },
    props: {
      model: {
        type: String,
        require: false,
        validator: (e) => {
          return e === 'single' || e === 'multi'
        },
        default: 'single'
      }
    },
    methods: {
      showCalendar () {
        if (this.startDate.value !== this.defaultStartDate.format('YYYY-MM-DD')) {
          this.defaultStartDate = moment(this.startDate.value)
        }
        if (this.endDate.value !== this.defaultEndDate.format('YYYY-MM-DD')) {
          this.defaultEndDate = moment(this.endDate.value)
        }
        this.popupVisible = !this.popupVisible
      },
      setDate (e) {
        // 如果是单日期
        if (e.type === 'single') {
          // 必须声明一个selectedDate，不然数据引用会导致日期显示错误，深拷贝与浅拷贝问题
          let selectedDate = e.date.moment.format('YYYY-MM-DD')
          this.startDate = {date: moment(selectedDate).format('MM月DD日'), value: selectedDate}
          /*
            如果设置了出发日期为了防止用户点击往返tab，这个时候需要更新endDate，防止用户切换到往返tab以后出现返程日期早于出发日期；往后加两天
          */
          this.endDate = {date: moment(selectedDate).add(2, 'days').format('MM月DD日'), value: moment(selectedDate).add(2, 'days').format('YYYY-MM-DD')}
          this.defaultEndDate = moment(selectedDate).add(2, 'days')
          this.startWeek = e.date.weekDay
          this.transferDateToParent({type: 'single', startDate: e.date})
          this.defaultStartDate = moment(selectedDate)
        } else if (e.type === 'multi') {
          // 如果是多日期
          let selectedStartDate = e.startDate.moment.format('YYYY-MM-DD')
          let selectedEndDate = e.endDate.moment.format('YYYY-MM-DD')
          this.startDate = {date: moment(selectedStartDate).format('MM月DD日'), value: selectedStartDate}
          this.endDate = {date: moment(selectedEndDate).format('MM月DD日'), value: selectedEndDate}
          this.startWeek = e.startDate.moment.format('dddd')
          this.endWeek = e.endDate.moment.format('dddd')
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
          this.startDate = {date: d.format('MM月DD日'), value: d.format('YYYY-MM-DD')}
          this.startWeek = d.format('dddd')
        }
      }
    }
  }
</script>
