<template>
  <div class="ykb-filter-bar">
    <mt-tabbar v-model="selected" :fixed="true">
      <mt-tab-item key="1" id="time-tab">
        <img slot="icon" width="16" height="16" :src="timeIcon">
        <span>{{timeLabel}}</span>
      </mt-tab-item>
      <mt-tab-item key="2" id="price-tab">
        <img slot="icon" width="16" height="16" :src="priceIcon">
        <span>{{priceLabel}}</span>
      </mt-tab-item>
      <mt-tab-item key="3" id="standard-tab">
        <img slot="icon" width="16" height="16" :src="standardIcon">
        <span>{{standardLabel}}</span>
      </mt-tab-item>
      <mt-tab-item key="4" id="filter-tab">
        <img slot="icon" width="16" height="16" :src="filterIcon">
        <span>{{filterLabel}}</span>
      </mt-tab-item>
    </mt-tabbar>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="popup-filter">
        <div class="header">
          <span class="back-icon" @click="onBack">取消</span>
          <span>筛选</span>
          <span class="confirm" @click="handleConfirm">确定</span>
        </div>
        <div class="body">
          <div class="container">
            <template v-for="dom in filterDataV2">
              <div :key="dom.type" class="filter-item">
                  <div class="title">
                    <span class="text">{{dom.label}}</span>
                  </div>
                  <div class="filter-content">
                    <ul>
                      <template v-for="e in dom.list">
                        <template v-if="e.className === 'active'">
                          <li :key="e.value" class="active" @click="handleFilterClick($event, e, dom.label)">
                            <span class="icon"></span>
                            <span class="text">{{e.label}}</span>
                          </li>
                        </template>
                        <template v-else>
                          <li :key="e.value" @click="handleFilterClick($event, e, dom.label)">
                            <span class="icon"></span>
                            <span class="text">{{e.label}}</span>
                          </li>
                        </template>
                      </template>
                    </ul>
                  </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const timeIcon = require('./images/list-by-time.svg')
  const priceIcon = require('./images/list-by-price.svg')
  const filterIcon = require('./images/list-screen.svg')
  const standardIcon = require('./images/list-by-specification.svg')
  const g = require('@/definition/g')
  const f = g.filterBarText
  export default {
    name: 'filterBar',
    data () {
      return {
        timeIcon,
        priceIcon,
        filterIcon,
        standardIcon,
        popupVisible: false,
        timeLabel: '时间',
        timeIndex: 0,
        standardLabel: f.STANDARD,
        standardIndex: 0,
        priceLabel: '价格',
        priceIndex: 0,
        filterLabel: '筛选',
        selected: 'standard-tab',
        filterDataV2: [
          {
            label: '车次类型',
            type: 'train-type',
            list: [
              {label: '高铁（G/C）', class: 'train-number', className: '', value: 'g'},
              {label: '动车（D）', class: 'train-number', className: '', value: 'd'},
              {label: '普通(Z/K/T/P/L)', class: 'train-number', className: '', value: 'k'}
            ]
          },
          {
            label: '出发时间',
            type: 'departure',
            list: [
              {label: '0点-6点', class: 'departure', className: '', value: '0-600'},
              {label: '6点-12点', class: 'departure', className: '', value: '600-1200'},
              {label: '12点-18点', class: 'departure', className: '', value: '1200-1800'},
              {label: '18点-24点', class: 'departure', className: '', value: '1800-2400'}
            ]
          },
          {
            label: '到达时间',
            type: 'arrival',
            list: [
              {label: '0点-6点', class: 'arrival', className: '', value: '0-600'},
              {label: '6点-12点', class: 'arrival', className: '', value: '600-1200'},
              {label: '12点-18点', class: 'arrival', className: '', value: '1200-1800'},
              {label: '18点-24点', class: 'arrival', className: '', value: '1800-2400'}
            ]
          }
        ],
        selectedFilterData: []
      }
    },
    methods: {
      ...mapActions('train', [
        'filterTrainList',
        'getAllTrainList',
        'getStandardTrailList'
      ]),
      handleTabClick (args) {
        let t = {
          'time-tab': [f.TIME_FROM_MORNING_TO_NIGHT, f.TIME_FROM_NIGHT_TO_MORNING],
          'price-tab': [f.PRICE_FROM_LOW_TO_HIGH, f.PRICE_FROM_HIGH_TO_LOW],
          'standard-tab': [f.STANDARD, f.ALL]
        }
        switch (args) {
          case 'time-tab':
            this.hourglassLabel = '耗时'
            this.priceLabel = '价格'
            this.timeIndex = (++this.timeIndex) % 2
            this.timeLabel = t['time-tab'][this.timeIndex]
            this.onHandleSort({type: 'time', value: this.timeLabel})
            break
          case 'standard-tab':
            this.timeLabel = '时间'
            this.priceLabel = '价格'
            this.standardIndex = (++this.standardIndex) % 2
            this.standardLabel = t['standard-tab'][this.standardIndex]
            this.onHandleSort({type: 'standard', value: this.standardLabel})
            // 点击合规或不合规的时候要清除之前的筛选条件
            this.restoreFilterData()
            break
          case 'price-tab':
            this.timeLabel = '时间'
            this.hourglassLabel = '耗时'
            this.priceIndex = (++this.priceIndex) % 2
            this.priceLabel = t['price-tab'][this.priceIndex]
            this.onHandleSort({type: 'price', value: this.priceLabel})
            break
          case 'filter-tab':
            this.timeLabel = '时间'
            this.hourglassLabel = '耗时'
            this.priceLabel = '价格'
            this.popupVisible = !this.popupVisible
            break
        }
      },
      onBack () {
        this.popupVisible = !this.popupVisible
      },
      restoreFilterData () {
        // 清空过滤数据
        this.filterDataV2.forEach(item => {
          item['list'].forEach(e => {
            e.className = ''
          })
        })
      },
      handleFilterClick (el, args, type) {
        this.filterDataV2.forEach(item => {
          if (item['label'] === type) {
            item['list'].forEach(e => {
              if (args.label === e.label) {
                if (e.className === 'active') {
                  e.className = ''
                } else {
                  e.className = 'active'
                }
              }
            })
          }
        })
        this.selectedFilterData = this.filterDataV2
      },
      handleConfirm () {
        let isStandard = this.standardLabel === f.STANDARD
        this.$emit('onFliterConfirmClick', {isStandard, value: this.filterDataV2})
        this.onBack()
      },
      onHandleSort (args) {
        if (args.type !== 'standard') {
          this.filterTrainList(args)
        } else {
          this.handleStandard(args.value)
        }
      },
      handleStandard (args) {
        this.$emit('isStandard', args === f.STANDARD)
        if (args === f.ALL) {
          this.getAllTrainList()
        } else if (args === f.STANDARD) {
          this.getStandardTrailList()
        }
      }
    },
    mounted () {
      let aTabItem = document.getElementsByClassName('mint-tab-item')
      for (let i = 0; i < aTabItem.length; i++) {
        aTabItem[i].addEventListener('click', _ => {
          this.handleTabClick(this.selected)
        })
      }
    }
  }
</script>
