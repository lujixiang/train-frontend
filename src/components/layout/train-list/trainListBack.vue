<template>
  <div>
    <div class="train-list-container">
      <datePickerPreviousNext v-on:onDateClicked="handleOnDateClicked" v-on:onChangeDate="handleOnChangeDate"></datePickerPreviousNext>
      <template v-if="this.$store.state.history.roundTripForGo !== ''">
        <trip-tip :info="this.$store.state.history.roundTripForGo"></trip-tip>
      </template>
      <div class="train-list-box" ref="listBox">
        <article>
          <template v-if="this.$store.state.train.trainlist.length > 0">
            <ul>
              <template v-for="item in this.$store.state.train.trainlist">
                <template v-if="item.visiable">
                  <template v-if="item.is_choose">
                    <li @click="jumpIntoDetail($event, item)">
                      <div class="container">
                        <div class="from">
                          <time class="from-time">{{item.start_time}}</time>
                          <span class="station-name">{{item.from_station_name}}</span>
                        </div>
                        <div class="train-number">
                          <div class="total-time">{{item.run_time_text}}</div>
                          <div class="arrow">
                            <ykb-icon type="ticketToE4" :solo="true" :height="9"></ykb-icon>
                          </div>
                          <div class="number">{{item.train_code}}</div>
                        </div>
                        <div class="to">
                          <time class="to-time">{{item.arrive_time}}</time>
                          <span class="station-name">{{item.to_station_name}}</span>
                        </div>
                        <div class="price">
                          <small class="small">&yen;</small>
                          <em>{{item.price}}</em>
                          <small>起</small>
                        </div>
                      </div>
                      <div class="seat-left">
                        <template v-for="e in seats">
                          <template v-if="item[e.price] !== '--' && item[e.left] !== '--'">
                            <div v-if="item[e.left] !== '0'" class="zw">
                              <span>{{e.label}}:</span>
                              <span>{{item[e.left]}}张</span>
                            </div>
                            <div v-else class="zw disable">
                              <span>{{e.label}}:</span>
                              <span>{{item[e.left]}}张</span>
                            </div>
                          </template>
                        </template>
                      </div>
                    </li>
                  </template>
                  <template v-else>
                    <li class="disable">
                      <div class="container">
                        <div class="from">
                          <time class="from-time">{{item.start_time}}</time>
                          <span class="station-name">{{item.from_station_name}}</span>
                        </div>
                        <div class="train-number">
                          <div class="total-time">{{item.run_time_text}}</div>
                          <div class="arrow">
                            <ykb-icon type="ticketToE4" :solo="true" :height="9"></ykb-icon>
                          </div>
                          <div class="number">{{item.train_code}}</div>
                        </div>
                        <div class="to">
                          <time class="to-time">{{item.arrive_time}}</time>
                          <span class="station-name">{{item.to_station_name}}</span>
                        </div>
                        <div class="price">
                          <span class="sold-out">无票</span>
                        </div>
                      </div>
                      <div class="seat-left">
                        <template v-for="e in seats">
                          <div v-if="item[e.price] !== '--' && item[e.left] !== '--'" class="zw disable">
                            <span>{{e.label}}:</span>
                            <span>{{item[e.left]}}张</span>
                          </div>
                        </template>
                      </div>
                    </li>
                  </template>
                </template>
              </template>
            </ul>
          </template>
          <template v-else>
            <template v-if="noSearchResult">
              <NSR v-on:pageRefresh="handleOnPageRefresh"></NSR>
            </template>
          </template>
        </article>
      </div>
    </div>
    <filterBar v-on:isStandard="handleIsStandard" v-on:onFliterConfirmClick="onFiltering"></filterBar>
    <text-alert :active="$store.state.IS_MIDNIGHT && !$store.state.IS_MIDNIGHT_NOTICED" v-on:iknow="doNotShowAgain()"></text-alert>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import './less/style.less'
  const G = require('@/definition/g')
  import { collectUserAction } from '@/mixins/collect-data'
  const sessionStore = require('@/lib/sessionStorage')['default']
  const seats = G.seats
  export default {
    name: 'backTrainList',
    mixins: [collectUserAction],
    data () {
      return {
        searchingDate: '',
        noSearchResult: false,
        popupVisible: false,
        seats,
        filterData: {},
        isStandard: true,
        serviceProvider: '',
        windowHeight: window.innerHeight
      }
    },
    methods: {
      ...mapActions(['handleMidnightNoticeStatus', 'handleIsMidnight']),
      ...mapActions('train', ['getTrainList', 'filterTrainList', 'recordTrainIonfo', 'getStandardTrailList']),
      ...mapActions('company', ['getCompanySettings']),
      ...mapActions('history', ['recordRoundTripInfo']),
      doNotShowAgain () {
        this.handleMidnightNoticeStatus({isActive: true})
      },
      isMidnight (e) {
        if (e.nightOrderFlag) {
          this.handleIsMidnight({isActive: true})
        }
      },
      jumpIntoDetail (el, item) {
        let { fromCity, toCity, date } = this.$route.query
        let serviceProvider = this.serviceProvider
        if (this.searchingDate !== '') {
          date = this.searchingDate
        }
        item['date'] = date + ' ' + item.start_time // 在每个车次上添加日期
        const callback = _ => {
          this.$router.push({name: 'TrainDetailRoundTrip', query: {date: date, from_station: item.from_station_code, to_station: item.to_station_code, train_no: item.train_no, train_code: item.train_code, from_city: fromCity, to_city: toCity, serviceProvider}})
        }
        this.recordRoundTripInfo({go: '', back: item, callback})
      },
      onFiltering (args) {
        let { isStandard, value } = args
        this.filterData = {type: 'filter', value, isStandard}
        this.filterTrainList({type: 'filter', value, isStandard})
      },
      handleIsStandard (args) {
        this.isStandard = args
        this.filterData['isStandard'] = args
      },
      handleOnChangeDate (args) {
        let query = this.$route.query
        let date = args.date.format('YYYY-MM-DD')
        this.searchingDate = date
        // 切换日期查询火车票需要修改对应路由上的日期参数
        this.$router.replace({name: 'BackTrainList', query: {...query, date}})
        this.requestTrainList(args)
      },
      handleOnDateClicked (date) {
        this.handleOnChangeDate({date, type: true})
      },
      handleOnPageRefresh () {
        this.requestTrainList()
      },
      requestTrainList (params = {}) {
        this.noSearchResult = false
        let { date, fromStation, toStation, trainType } = this.$route.query
        if (params.type) {
          date = params.date.format('YYYY-MM-DD')
        }
        let args = {
          train_date: date,
          to_station: toStation,
          from_station: fromStation,
          needdistance: 1,
          purpose_codes: 'ADULT',
          train_type: trainType
        }
        this.Indicator.open({text: '加载中...', spinnerType: 'fading-circle'})
        // 列表获取完成以后的回调函数
        let callback = (e) => {
          this.serviceProvider = e.serviceprovider_flag
          this.collectUserData({action: 'train-query'}, {result: e})
          sessionStore.set('return_queryKey', e.queryKey)
          this.isMidnight(e)
          this.Indicator.close()
          if (!this.filterData.type) {
            let { trainType } = this.$route.query
            let value = {type: 'train-type', label: '车次类型', list: []}
            if (parseInt(trainType) === 1) {
              // 只是高铁
              value.list = [{className: 'active', value: 'g'}, {className: 'active', value: 'd'}]
            }
            value = [value]
            this.filterData = {type: 'filter', isStandard: this.isStandard, value}
          }
          this.filterTrainList(this.filterData)
        }
        let errcallback = e => {
          this.isMidnight(e)
          if (e.flagcode !== '204') {
            this.Toast({message: e.flagmsg, position: 'bottom'})
          }
          this.Indicator.close()
          this.noSearchResult = true
        }
        this.getTrainList({args, callback, errcallback})
      }
    },
    beforeCreate () {
      let { fromCity, toCity, trip } = this.$route.query
      let roundTripText = trip === 'go' ? '去程：' : '返程：'
      this.$route.meta.title = roundTripText + fromCity + ' - ' + toCity
    },
    created () {
      // 获取公司配置
      this.getCompanySettings()
      let { fromCity, toCity, trip } = this.$route.query
      let roundTripText = trip === 'go' ? '去程：' : '返程：'
      this.$route.meta.title = roundTripText + fromCity + ' - ' + toCity
    },
    mounted () {
      this.$refs.listBox.style.height = this.windowHeight - 112 + 'px'
      this.requestTrainList()
    }
  }
</script>
