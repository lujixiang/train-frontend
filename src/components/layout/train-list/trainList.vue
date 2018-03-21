<template>
  <div>
    <div class="train-list-container">
      <datePickerPreviousNext v-on:onDateClicked="handleOnDateClicked" v-on:onChangeDate="handleOnChangeDate"></datePickerPreviousNext>
      <div class="train-list-box">
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
            <!-- <bottom></bottom> -->
          </template>
          <template v-else>
            <template v-if="noSearchResult">
              <NSR></NSR>
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
  export default {
    name: 'trainList',
    data () {
      return {
        searchingDate: '',
        noSearchResult: false,
        popupVisible: false,
        seats: [
          {price: 'yz_price', label: '硬座', left: 'yz_num', code: '1'},
          {price: 'rz_price', label: '软座', left: 'rz_num', code: '2'},
          {price: 'yw_price', label: '硬卧', left: 'yw_num', code: '3'},
          {price: 'rwx_price', label: '软卧', left: 'rw_num', code: '4'},
          {price: 'dw_price', label: '动卧', left: 'dw_num', code: 'F'},
          {price: 'edz_price', label: '二等座', left: 'edz_num', code: 'O'},
          {price: 'ydz_price', label: '一等座', left: 'ydz_num', code: 'M'},
          {price: 'wz_price', label: '无座', left: 'wz_num', code: '1'},
          {price: 'swz_price', label: '商务座', left: 'swz_num', code: '9'},
          {price: 'tdz_price', label: '特等座', left: 'tdz_num', code: 'P'},
          {price: 'gjrw_price', label: '高级软卧', left: 'gjrw_num', code: '6'}
          // {price: 'qtxb_price', label: '其他席别', left: 'qtxb_num'}
        ],
        filterData: {},
        isStandard: true
      }
    },
    methods: {
      ...mapActions([
        'handleMidnightNoticeStatus',
        'handleIsMidnight'
      ]),
      ...mapActions('train', [
        'getTrainList',
        'filterTrainList',
        'recordTrainIonfo',
        'getStandardTrailList'
      ]),
      ...mapActions('company', [
        'getCompanySettings',
        'getLocalStandard'
      ]),
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
        if (this.searchingDate !== '') {
          date = this.searchingDate
        }
        item['date'] = date + ' ' + item.start_time // 在每个车次上添加日期
        const callback = _ => {
          this.$router.push({name: 'TrainDetail', query: {date: date, from_station: item.from_station_code, to_station: item.to_station_code, train_no: item.train_no, train_code: item.train_code, from_city: fromCity, to_city: toCity}})
        }
        this.recordTrainIonfo({info: item, callback})
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
        this.$router.replace({name: 'TrainList', query: {...query, date}})
        this.requestTrainList(args)
      },
      handleOnDateClicked (date) {
        this.handleOnChangeDate({date, type: true})
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
        this.Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        // 列表获取完成以后的回调函数
        let callback = (e) => {
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
            this.Toast({
              message: e.flagmsg,
              position: 'bottom',
              duration: 5000
            })
          }
          this.Indicator.close()
          this.noSearchResult = true
        }
        this.getTrainList({args, callback, errcallback})
      }
    },
    beforeCreate () {
      let { fromCity, toCity } = this.$route.query
      this.$route.meta.title = fromCity + ' - ' + toCity
    },
    created () {
      // 获取公司配置
      this.getCompanySettings()
      let { fromCity, toCity } = this.$route.query
      this.$route.meta.title = fromCity + ' - ' + toCity
    },
    mounted () {
      this.requestTrainList()
    }
  }
</script>
