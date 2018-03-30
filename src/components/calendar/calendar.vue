<template>
  <div class="ykb-calendar">
    <mt-popup v-model="isActive" position="bottom" :closeOnClickModal="false">
      <div class="calendar-container" v-on:click.stop="">
        <div class="header-box">
          <mt-header :fixed="false" :title="dateTitle">
            <mt-button slot="left" icon="back" @click="onClose">返回</mt-button>
          </mt-header>
          <template v-if="isShowNotice">
            <div class="notice">
              {{notice}}
            </div>
          </template>
          <div class="week-bar">
            <span class="weekend">日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span class="weekend">六</span>
          </div>
        </div>
        <div class="body">
          <template v-for="(date, attr, index) in this.dates">
            <section class="monthly">
              <h2>{{date[8].moment.format('YYYY年MM月')}}</h2>
              <template v-for="(day, index) in date">
                <span :key="day.key" v-if="!day.moment"></span>
                <span v-else v-on:click.stop="handleClickDate(day.key, $event)" :key="day.key" :weekDay="day.weekDay" :date="day.moment.format('YYYY-MM-DD')" :class="day.className">{{day.dateMark}}</span>
              </template>
            </section>
          </template>
          <div class="empty"></div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const moment = require('moment')
  const _ = require('lodash')
  const backIcon = require('./images/back.png')
  const fun = require('@/lib/fun')
  export default {
    name: 'calendar',
    data () {
      return {
        dates: {},
        durationDates: [],
        startDate: '',
        endDate: '',
        backIcon,
        dateTitle: '选择日期'
      }
    },
    props: {
      isActive: {
        type: Boolean,
        default: false,
        require: false
      },
      model: {
        type: String,
        default: 'single', // single , multi,这个参数是控制显示多选日期（multi）和单选日期（single）
        validator: (e) => {
          return e === 'single' || e === 'multi'
        },
        require: false
      },
      defaultStartDate: {
        type: Object,
        default: _ => {
          // 这个参数是控制默认传过来的起始日期，不传则为当天
          return moment()
        },
        require: false
      },
      defaultEndDate: {
        type: Object,
        default: _ => {
          // 这个参数是控制默认传过来的结束日期，不传则为当前加一天，仅限多日期选择时用
          return moment().add(1, 'day')
        },
        require: false
      },
      isShowNotice: {
        type: Boolean,
        default: true,
        require: false
      },
      notice: {
        type: String,
        default: '公告',
        require: false
      },
      maxDays: {
        type: Number,
        default: 29,
        require: false
      }
    },
    watch: {
      isActive: function (cV, oV) {
        if (cV) {
          this.highLightDefaultDate()
        }
        this.handleRouter(cV)
      },
      model: function (cV, oV) {
        // 当切换tab的时候重新创建日期组件，防止上一次的样式影响当前样式
        this.createMonth()
      }
    },
    methods: {
      ...mapActions([
        'handleGlobalPopupLayer'
      ]),
      createMonth () {
        let lastTime = moment().add(-1, 'month')
        let dates = {}
        let weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        let dayCounter = 0 // 天数计数器
        _.forEach([0, 1], val => {
          let nextTime = lastTime.add(1, 'month')
          let nextMonth = nextTime.format('MM')
          let nextYear = nextTime.format('YYYY')
          dates['_' + val] = []
          let countDays = this.getDaysFromYearAndMonth(nextYear, nextMonth)
          for (let i = 1; i <= countDays; i++) {
            let j = i < 10 ? '0' + i : i
            let date = moment(nextYear + nextMonth + j)
            if (i === 1) {
              for (let k = 0; k < date.day(); k++) {
                dates['_' + val].push({ })
              }
            }
            let isAfter = date.diff(moment().format('YYYY-MM-DD'), 'days') >= 0
            let dateMark = date.diff(moment().format('YYYY-MM-DD'), 'days') === 0 ? '今天' : i
            let className = isAfter ? (date.day() === 0 || date.day() === 6 ? 'weekend-mark' : '') : 'disable'
            let weekDay = weekText[date.day()]
            if (dateMark === '今天') {
              className += ' red-mark'
            }
            if (isAfter) {
              ++dayCounter
            }
            if (dayCounter > this.$props.maxDays) {
              className += ' disable'
            }
            let key = '_' + val + '__' + i
            dates['_' + val].push({
              key: key,
              dateMark: dateMark,
              year: nextYear,
              month: nextMonth,
              date: i,
              moment: date,
              weekDay: weekDay,
              className: className,
              oldClassName: ''
            })
          }
        })
        this.dates = dates
      },
      getDaysFromYearAndMonth (year, month) { // 根据某年某月获取某年某月总共有多少天
        return new Date(year, parseInt(month, 10), 0).getDate()
      },
      findDomDataByKey (key) {
        let attr = key.split('__')
        let node = null
        _.forEach(this.dates[attr[0]], val => {
          if (val.key === key) {
            node = val
          }
        })
        return node
      },
      addClassForDurationNode (args) {
        // 防止node越来越多（都是些重复的数据）
        this.durationDates = []
        let { fromDate, toDate } = args
        _.forEach(this.dates, lineArr => {
          _.forEach(lineArr, val => {
            if (val.date) {
              if (val.moment.isBetween(fromDate, toDate)) {
                this.durationDates.push(val)
                val.className = 'active-during'
              }
            }
          })
        })
      },
      clearDurationClass () {
        _.forEach(this.durationDates, val => {
          val.className = ''
        })
      },
      onClose () {
        // 在选择多日期的时候，关闭弹窗之前需要先判断是否已经选择了往返日期，如果只选择一个或者没有选择因该强制让用户选择完
        if (this.$props.model === 'multi') {
          if (this.startDate === '') {
            this.Toast({
              message: '请选择出发日期',
              position: 'bottom'
            })
            return false
          }
          if (this.endDate === '') {
            this.Toast({
              message: '请选择返程日期',
              position: 'bottom'
            })
            return false
          }
        }
        this.$emit('onClickBackButton')
      },
      handleSingleDateModel (node) {
        this.startDate.className = ''
        node.className = 'active single'
        this.startDate = node
        this.sendMessageToParent({type: 'single', date: node})
        this.onClose()
      },
      sendMessageToParent (args) {
        this.$emit('onDateChange', args)
      },
      handleClickDate (key) {
        let node = this.findDomDataByKey(key)
        // 首先应该判断当前日期是否可以点击，不可以点击直接返回，不做什么操作
        if (fun.hasClass(node.className, 'disable')) {
          return false
        }
        // 判断是什么模式的日历
        // 如果model 是single，则是单选日期，如果是multi则是多选日期
        if (!this.$props.model || this.$props.model === 'single') {
          this.handleSingleDateModel(node)
          return false
        } else if (this.$props.model === 'multi') {
          // 如果已经是两次点击了，则清除之前的两次点击，按当前点击次数算作第一次，并且清除duration的节点
          if (this.startDate !== '' && this.endDate !== '') {
            this.startDate.className = this.startDate.oldClassName
            this.endDate.className = this.endDate.oldClassName
            this.startDate = ''
            this.endDate = ''
            this.clearDurationClass()
          }
          // 判断是不是第一次点击
          if (this.startDate !== '') {
            // 判断是不是同一个元素
            if (this.startDate.key === node.key) {
              // 如果是同一个元素，则清除当前元素的active，并且清除date里面的startDate
              node.className = node.oldClassName
              this.startDate = ''
              this.dateTitle = '选择去程日期'
            } else {
              // 如果点击的不是同一个元素，则给当前元素添加active，同时更新endDate，保存当前class的值
              node.oldClassName = node.className
              node.className = 'active'
              if (node.moment.isBefore(this.startDate.moment)) {
                this.endDate = this.startDate
                this.startDate = node
              } else {
                this.endDate = node
              }
              this.startDate.className = 'active startdate'
              this.endDate.className = 'active enddate'
              // 获取两次点击的node节点，然后把两个node时间节点之间的节点添加duration
              let {startDate, endDate} = this
              this.addClassForDurationNode({fromDate: startDate.moment.format('YYYY-MM-DD'), toDate: endDate.moment.format('YYYY-MM-DD')})
              this.sendMessageToParent({type: 'multi', startDate: startDate, endDate: endDate})
              this.onClose()
              this.dateTitle = '选择日期'
            }
          } else {
            this.startDate = node
            node.oldClassName = node.oldClassName
            node.className = 'active'
            this.dateTitle = '选择返程日期'
          }
        }
      },
      highLightDefaultDate () {
        // 如果是单日期模式，则默认高亮显示当天；如果是多日期模式，则默认高亮显示当天和第二天
        let today = this.$props.defaultStartDate.format('YYYY-MM-DD')
        let theOtherDay = this.$props.defaultEndDate.format('YYYY-MM-DD')
        if (this.$props.model === 'single') {
          if (this.startDate === '') {
            _.forEach(this.dates, lineArr => {
              _.forEach(lineArr, val => {
                if (val.date) {
                  if (val.moment.format('YYYY-MM-DD') === today) {
                    val.className = 'active single'
                    this.startDate = val
                  }
                }
              })
            })
          } else {
            _.forEach(this.dates, lineArr => {
              _.forEach(lineArr, val => {
                if (val.date) {
                  if (val.moment.format('YYYY-MM-DD') === today) {
                    val.className = 'active single'
                    this.startDate = val
                  } else {
                    if (fun.hasClass(val.className, 'active')) {
                      val.className = ''
                    }
                  }
                }
              })
            })
          }
        } else if (this.$props.model === 'multi') {
          if (this.startDate === '' || this.endDate === '') {
            _.forEach(this.dates, lineArr => {
              _.forEach(lineArr, val => {
                if (val.date) {
                  if (val.moment.format('YYYY-MM-DD') === today) {
                    val.className = 'active startdate'
                    this.startDate = val
                  }
                  if (val.moment.format('YYYY-MM-DD') === theOtherDay) {
                    val.className = 'active enddate'
                    this.endDate = val
                  }
                  if (val.moment.format('YYYY-MM-DD') !== theOtherDay && val.moment.format('YYYY-MM-DD') !== today) {
                    // val.className = ''
                  }
                }
              })
            })
          } else {
            _.forEach(this.dates, lineArr => {
              _.forEach(lineArr, val => {
                if (val.date) {
                  if (val.moment.format('YYYY-MM-DD') === this.startDate.moment.format('YYYY-MM-DD')) {
                    val.className = 'active startdate'
                    this.startDate = val
                  }
                  if (val.moment.format('YYYY-MM-DD') === this.endDate.moment.format('YYYY-MM-DD')) {
                    val.className = 'active enddate'
                    this.endDate = val
                  }
                }
              })
            })
          }
          this.addClassForDurationNode({fromDate: this.defaultStartDate.format('YYYY-MM-DD'), toDate: this.defaultEndDate.format('YYYY-MM-DD')})
        }
      },
      handleRouter (isActive) {
        let This = this
        this.handleGlobalPopupLayer({This, isActive})
      }
    },
    mounted () {
      this.createMonth()
      this.highLightDefaultDate()
    }
  }
</script>
