<template>
  <div>
    <div class="index-content">
      <banner></banner>
      <city-select :departureCode="fromStation" :departure="fromCity" :arrivalCode="toStation" :arrival="toCity" v-on:onCityChange="onCityChange"></city-select>
      <date-selectCell v-on:onDateChange="onDateChange"></date-selectCell>
      <div @click.stop="changeExcuter">
        <mt-cell title="出行人" class="passenger-cell text-left">
          <span class="traveller">{{traveller}}</span>
          <ykb-icon type="peopleChange" :width="28" :height="28"></ykb-icon>
        </mt-cell>
      </div>
      <mt-cell class="highSpeedTrainOnly text-left" title="只看动车/高铁">
        <mt-switch v-model="isHighSpeedTrainOnly"></mt-switch>
      </mt-cell>
      <mt-button size="normal" type="primary" @click="searching" class="search-hotel-button">查询</mt-button>
      <div class="travel-standard">
        <div class="left">差旅标准</div>
        <div class="right">
          <template v-if="this.$store.state.company.travelStandardUnlimited">
            <p>不限</p>
          </template>
          <template v-else v-for="item in this.$store.state.company.travelStandard.list">
            <p>{{traintyps[item.traintype]}}：{{item['seattype']}}</p>
          </template>
        </div>
      </div>
      <search-history :maxSize="3" v-on:onHistroyRecordClick="historyCallback"></search-history>
    </div>
    <index-list :isSearch="isSearch" v-on:searching="handleOnSearching" v-on:listClick="handleListClick" :active="isShowCompanyUserList" v-on:close="changeExcuter"></index-list>
    <text-alert :active="$store.state.IS_MIDNIGHT && !$store.state.IS_MIDNIGHT_NOTICED" v-on:iknow="doNotShowAgain()"></text-alert>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { collectUserAction } from '@/mixins/collect-data'
import './less/style.less'
export default {
  name: 'content',
  mixins: [collectUserAction],
  data () {
    return {
      isHighSpeedTrainOnly: false,
      traintyps: {O: '其他', G: '高铁', D: '动车'},
      fromCity: '出发地', // 设置默认的出发城市
      toCity: '目的地', // 设置默认的到达城市
      fromStation: '',
      toStation: '',
      fromDate: '', // 出发日期
      record: {fromCity: '北京', toCity: '上海', fromStation: 'BJP', toStation: 'SHH'},
      recordList: [],
      traveller: '',
      isShowCompanyUserList: false,
      isSearch: false,
      companySettings: {},
      isMidnight: false
    }
  },
  methods: {
    ...mapActions(['handleMidnightNoticeStatus', 'handleIsMidnight']),
    ...mapActions('history', ['recordSearchHistory', 'getSearchHistory']),
    ...mapActions('company', ['getCurrentUser', 'updateTraveler', 'getTraveler', 'getTravelStandard', 'saveTravelStandard', 'getCompanySettings', 'onSearchingByName', 'clearDataFromLocalStorage']),
    doNotShowAgain () {
      this.handleMidnightNoticeStatus({isActive: true})
    },
    searching () {
      if (this.fromCity === '出发地') {
        this.Toast({message: '出发地不能为空', position: 'bottom'})
        return false
      }
      if (this.toCity === '目的地') {
        this.Toast({message: '目的地不能为空', position: 'bottom'})
        return false
      }
      if (this.toCity === this.fromCity) {
        this.Toast({message: '出发地与目的地一致，请重新填写', position: 'bottom'})
        return false
      }
      let trainType = this.isHighSpeedTrainOnly ? 1 : 0
      this.record = {fromCity: this.fromCity, toCity: this.toCity, fromStation: this.fromStation, toStation: this.toStation}
      this.recordSearchHistory(this.record)
      this.$router.push({name: 'TrainList', query: {fromCity: this.fromCity, toCity: this.toCity, date: this.fromDate, trainType, fromStation: this.fromStation, toStation: this.toStation, backDate: this.toDate, roundTrip: 'single', trip: ''}})
    },
    handleOnSearching (e) {
      let value = e.trim().toUpperCase()
      if (value === '') {
        this.isSearch = false
      } else {
        this.isSearch = true
      }
      this.onSearchingByName({keyword: value})
    },
    changeExcuter () {
      this.isSearch = false
      this.isShowCompanyUserList = !this.isShowCompanyUserList
    },
    handleListClick (args) {
      this.changeExcuter()
      this.traveller = args.userName
      let idno = ''
      if (args.documentInformationList) {
        idno = args.documentInformationList[0].documentNO
      }
      console.log(args)
      this.updateTraveler({user: {user_name: args.userName, user_passportseno: idno, user_sys_key: args.userSysId, user_phone: args.cellPhone}, type: 'update'})
      this.requestTravelStandard({user: {user_phone: args.cellPhone}})
      .then(res => {
        this.saveTravelStandard(res)
      })
      .catch(err => {
        this.Toast({message: err.flagmsg, position: 'bottom'})
      })
    },
    requestTravelStandard (args = {}) {
      let { user } = args
      return new Promise((resolve, reject) => {
        const callback = res => {
          resolve(res)
        }
        const errcallback = err => {
          reject(err)
        }
        let { companyId, cooperatorId } = this.companySettings
        this.getTravelStandard({params: {cooperator_id: cooperatorId, company_id: companyId, phone: user.user_phone}, callback, errcallback})
      })
    },
    historyCallback (args) {
      this.fromCity = args.fromCity
      this.toCity = args.toCity
      this.fromStation = args.fromStation
      this.toStation = args.toStation
    },
    onCityChange (data) {
      if (data.fromOrTo === 'to') {
        this.toCity = data.city[0]
        this.toStation = data.city[4]
      } else if (data.fromOrTo === 'from') {
        this.fromCity = data.city[0]
        this.fromStation = data.city[4]
      } else if (data.fromOrTo === 'both') {
        this.fromCity = data.fc
        this.toCity = data.tc
        this.fromStation = data.fs
        this.toStation = data.ts
      }
    },
    onDateChange (data) {
      if (data.type === 'single') {
        this.fromDate = data.startDate.moment.format('YYYY-MM-DD')
      }
    },
    requestUser () {
      // 首先要判断traveler存在与否，如果不存在则请求，如果存在则直接获取
      return new Promise((resolve, reject) => {
        this.getCurrentUser({resolve, reject})
      })
    },
    requestTraveler () {
      return new Promise((resolve, reject) => {
        this.getTraveler({resolve, reject})
      })
    }
  },
  created () {
    this.getCompanySettings({
      callback: res => {
        this.companySettings = res
      }
    })
    this.requestTraveler()
    .then(res => {
      // 如果获取到traveler则直接显示获取到的值
      this.traveller = res.user_name
      this.requestTravelStandard({user: res})
      .then(res => {
        this.collectUserData({action: 'train-travelStandard'}, {standard: res})
        this.saveTravelStandard(res)
      })
      .catch(err => {
        // 当获取差旅标准为空的时候要把当前用户给清除
        this.traveller = ''
        this.clearDataFromLocalStorage(['traveler', 'auth-user'])
        this.Toast({message: err.flagmsg, position: 'bottom'})
      })
    })
    .catch(_ => {
      // 如果没有获取到traveler，则请求当前用户
      this.requestUser()
      .then(res => {
        this.traveller = res.user_name
        // 获取差旅标准
        this.requestTravelStandard({user: res})
        .then(res => {
          this.collectUserData({action: 'train-travelStandard'}, {standard: res})
          this.saveTravelStandard(res)
        })
        .catch(err => {
          this.clearDataFromLocalStorage(['auth-user'])
          this.Toast({message: err.flagmsg, position: 'bottom'})
        })
      })
      .catch(err => {
        // 如果当前用户登录过期则提示用户登录未登录
        this.Toast({message: err.flagmsg, position: 'bottom'})
      })
    })
  },
  mounted () {
    let { fromCity, toCity, date, fromStation, toStation } = this.$route.query
    if (fromCity && toCity && fromStation && toStation) {
      this.fromStation = fromStation
      this.toStation = toStation
      this.fromCity = fromCity
      this.toCity = toCity
      this.record = this.$route.query
      this.fromDate = date
    } else {
      // 如果已经存在历史记录，则每次返回到首页的时候按照最后一次的历史记录进行展示
      this.getSearchHistory(_ => {
        this.recordList = this.$store.state.history.historyRecord
        if (this.recordList.length > 0) {
          this.fromCity = this.recordList[0].value.fromCity
          this.toCity = this.recordList[0].value.toCity
          this.fromStation = this.recordList[0].value.fromStation
          this.toStation = this.recordList[0].value.toStation
        }
      })
    }
  }
}
</script>
