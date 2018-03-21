<template>
  <div>
    <div class="city-select">
      <div class="departure-city" @click="pickCity($event, fromCity)">
        <div class="location">
          <template v-if="departure === '出发地'">
            <p class="fromCity unactive">{{departure}}</p>
          </template>
          <template v-else>
            <p class="fromCity">{{departure}}</p>
          </template>
        </div>
      </div>
      <div class="switch-city">
        <span class="switch-icon">
          <transition>
            <img @click="switchCity($event, this)" class="switchCity switchIconClassName" width="30" height="30" :src="switchIcon" alt="">
          </transition>
        </span>
      </div>
      <div class="arrival-city" @click="pickCity($event, toCity, 'to')">
        <div class="location">
          <template v-if="arrival === '目的地'">
            <p class="toCity unactive">{{arrival}}</p>
          </template>
          <template v-else>
            <p class="toCity">{{arrival}}</p>
          </template>
        </div>
      </div>
    </div>
    <city-picker v-on:listenToChildEvent="receiveMessageFromChild" :options="citypickeroptions" v-on:onClickBackButton="isShowCityPicker" :isActive="isCityPickerActive"></city-picker>
  </div>
</template>

<script>
  import './less/style.less'
  const switchIcon = require('./images/oneway-to.png')
  const entranceIcon = require('@/assets/icons/entrance.png')
  export default {
    name: 'citySelect',
    props: {
      departure: {
        type: String,
        require: true,
        default: ''
      },
      arrival: {
        type: String,
        require: true,
        default: ''
      },
      departureCode: {
        type: String,
        require: true,
        default: ''
      },
      arrivalCode: {
        type: String,
        require: true,
        default: ''
      }
    },
    data () {
      return {
        switchIcon,
        entranceIcon,
        switchIconClassName: '',
        fromCity: '',
        toCity: '',
        fromStation: '',
        toStation: '',
        isCityPickerActive: false,
        citypickeroptions: {}
      }
    },
    methods: {
      switchCity (el, a) {
        // 当没有选择出发城市和到大城市的时候不触发点击切换事件
        if (this.fromCity === '出发地' || this.toCity === '目的地') {
          return false
        }
        el.target.className = 'rotateIn animated switchCity'
        let fc = this.toCity
        let tc = this.fromCity
        let fs = this.toStation
        let ts = this.fromStation
        this.onCityChange({fromOrTo: 'both', fc, tc, fs, ts})
      },
      pickCity (el, city, fromOrTo = 'from') {
        this.isShowCityPicker()
        this.citypickeroptions = {fromOrTo: fromOrTo, city: city}
      },
      isShowCityPicker () {
        this.isCityPickerActive = !this.isCityPickerActive
      },
      receiveMessageFromChild (data) {
        if (data.fromOrTo === 'to') {
          this.toCity = data.city[0]
        } else if (data.fromOrTo === 'from') {
          this.fromCity = data.city[0]
        }
        this.onCityChange(data)
      },
      onCityChange (args) {
        this.$emit('onCityChange', args)
      }
    },
    created () {
      // 初始化的时候把默认传的参数赋值给当前组件的data
      this.fromCity = this.$props.departure
      this.toCity = this.$props.arrival
      this.fromStation = this.$props.departureCode
      this.toStation = this.$props.arrivalCode
    },
    updated () {
      // 每次点击查询历史记录需要更新搜索城市的数据
      this.fromCity = this.$props.departure
      this.toCity = this.$props.arrival
      this.fromStation = this.$props.departureCode
      this.toStation = this.$props.arrivalCode
    },
    mounted () {
      let switchCity = document.querySelector('.switchCity')
      let fromCity = document.querySelector('.fromCity')
      let toCity = document.querySelector('.toCity')
      // 动画运动结束
      switchCity.addEventListener('webkitAnimationEnd', (e) => {
        switchCity.className = 'switchCity'
        fromCity.className = 'fromCity'
        toCity.className = 'toCity'
      }, false)
      // 动画运动开始
      switchCity.addEventListener('webkitAnimationStart', (e) => {
        fromCity.className = 'fromCity switch-right'
        toCity.className = 'toCity switch-left'
      }, false)
    }
  }
</script>
