<template>
  <div class="datepicker-next-previous">
    <div class="previous-button" @click.stop="changeDateByClickingButton('prev')">
      <span>前一天</span>
    </div>
    <div class="calendar-box" @click.stop="handleActiveCalendar">
      <span class="pickerdate">{{today}} {{dateWeek}}</span>
    </div>
    <div class="next-button" @click.stop="changeDateByClickingButton('next')">
      <span>后一天</span>
    </div>
    <calendar :isShowNotice="true" notice="当前车票预售期为30天" model="single" :defaultStartDate="currentDate" v-on:onClickBackButton="handleActiveCalendar" v-on:onDateChange="setDate" :isActive="isActiveCalendar"></calendar>
  </div>
</template>

<script>
  import './less/style.less'
  const previousIcon = require('./images/previous.png')
  const nextIcon = require('./images/next.png')
  const calendarIcon = require('./images/calendar.png')
  const moment = require('moment')
  export default {
    name: 'datepicker-previous-next',
    data () {
      return {
        previousIcon,
        nextIcon,
        calendarIcon,
        today: moment().format('MM月DD日'),
        dateWeek: moment().format('dddd'),
        isActiveCalendar: false,
        fromCity: '',
        toCity: '',
        date: '',
        currentDate: moment(),
        trainType: ''
      }
    },
    methods: {
      handleActiveCalendar () {
        this.isActiveCalendar = !this.isActiveCalendar
      },
      changeDateByClickingButton (type = 'next') {
        let rightNow = this.currentDate
        let x = type === 'next' ? 1 : -1
        if (x < 0 && this.date === moment().format('YYYY-MM-DD')) {
          return false
        }
        let what = rightNow.add(x, 'day')
        this.date = what.format('YYYY-MM-DD')
        this.currentDate = what
        this.today = what.format('MM月DD日')
        this.dateWeek = what.format('dddd')
        this.$emit('onChangeDate', {type, date: what})
      },
      setDate (e) {
        this.dateWeek = e.date.moment.format('dddd')
        this.today = e.date.moment.format('MM月DD日')
        this.date = e.date.moment.format('YYYY-MM-DD')
        this.currentDate = e.date.moment
        this.$emit('onDateClicked', e.date.moment)
      }
    },
    created () {
      // let { date } = this.$props.query
      let { date } = this.$route.query
      this.today = moment(date).format('MM月DD日')
      this.dateWeek = moment(date).format('dddd')
      this.currentDate = moment(date)
    },
    mounted () {
      // let { fromCity, toCity, trainType, date } = this.$props.query
      let { fromCity, toCity, trainType, date } = this.$route.query
      this.fromCity = fromCity
      this.toCity = toCity
      this.date = date
      this.trainType = trainType
    }
  }
</script>
