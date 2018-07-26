<template>
  <div class="ykb-city-picker">
    <mt-popup v-model="isActive" position="right" :closeOnClickModal="false">
      <div class="citypicker-container" v-on:click.stop="">
        <div class="header-box">
          <div class="header">
            <span class="back-icon" v-on:click.stop="onClose">
              <img :src="backIcon" width="16" height="16" alt="">
              <span></span>
            </span>
            <span class="title">选择城市</span>
          </div>
          <div class="search-bar">
            <search :data="cityList.cityList" maxlength="20" placeholder="请输入车站名称（如北京，bj，beijing）" v-on:onSelectCity="pickCityFromSearch" v-on:focus="handleOnFocus" v-on:blur="handleOnBlur"></search>
          </div>
        </div>
        <div class="body" :class="this.isFocus ? 'hide' : ''" ref="bodyBox">
          <template v-if="$store.state.history.currentLocation === ''">
            <section class="current-city">
              <p class="title-box" @click="getCurrentCity">
                <ykb-icon type="location" :width="16" :height="16"></ykb-icon>
                <span class="text-left title">点击定位当前位置</span>
              </p>
            </section>
          </template>
          <template v-else>
            <section class="current-city">
              <p class="title-box-unactive">
                <span class="text-left ml10 title">当前城市</span>
              </p>
              <ul class="city-container" :class="isSupportFlex ? 'flex' : 'float'">
                <li @click="pickCity($event, $store.state.history.currentLocation)">{{$store.state.history.currentLocation[0]}}</li>
              </ul>
            </section>
          </template>
          <template v-if="$store.state.history.selctedCityRecord.length > 0">
            <section class="recent-history">
              <p class="title-box">
                <span class="text-left ml10 title">历史查询</span>
              </p>
              <ul class="city-container" :class="isSupportFlex ? 'flex' : 'float'">
                <li v-for="item in $store.state.history.selctedCityRecord" @click="pickCity($event, item.node)">
                  {{item.node[0]}}
                </li>
              </ul>
            </section>
          </template>
          <section class="dd">
            <p class="title-box">
              <span class="text-left ml10 title">热门城市</span>
            </p>
            <ul class="city-container" :class="isSupportFlex ? 'flex' : 'float'">
              <li v-for="item in cityList.hotList" @click="pickCity($event, item)">
                {{item[0]}}
              </li>
            </ul>
          </section>
          <section class="alphabeta">
            <p class="title-box">
              <span class="text-left ml10 title">按字母查询</span>
            </p>
              <ul :class="isSupportFlex ? 'flex' : 'float'">
                <li v-for="item in alphabeta" :_key="item.label ? item.label : item" :class="item.className" @click="clickAlphaBeta(item, $event)">
                  {{item.label ? item.label : item}}
                </li>
              </ul>
          </section>
          <section class="dd">
            <ul class="city-container" :class="isSupportFlex ? 'flex' : 'float'">
              <li v-for="item in selectedCitys[currentCharacter]" @click="pickCity($event, item)">
                {{item[0]}}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import './less/style.less'
  const _ = require('lodash')
  const backIcon = require('./images/back.png')
  const cityList = require('./citydata')
  const fun = require('@/lib/fun')
  const iosVersion = fun.getIOSversion()
  console.log(iosVersion)
  export default {
    name: 'cityPicker',
    data () {
      return {
        isShow: false,
        backIcon,
        inputValue: '',
        alphabeta: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
        cityList,
        selectedCitys: [],
        currentCharacter: '',
        lastCityNode: null,
        isFocus: false,
        isSupportFlex: iosVersion > 8
      }
    },
    watch: {
      isActive: function (cV, oV) {
        this.handleRouter(cV)
      }
    },
    props: {
      isActive: {
        type: Boolean,
        default: false,
        require: false
      },
      options: {
        type: Object,
        default: _ => {
          return {}
        },
        require: false
      }
    },
    methods: {
      ...mapActions('history', [
        'recordSelectedCitys',
        'getSelectedCitys',
        'getGDcity'
      ]),
      ...mapActions([
        'handleGlobalPopupLayer'
      ]),
      handleOnFocus () {
        this.isFocus = true
      },
      handleOnBlur () {
        let aInput = document.getElementsByClassName('search-input')[0]
        if (aInput.value === '') {
          this.isFocus = false
        }
      },
      getCurrentCity () {
        this.getGDcity({
          errcallback: err => {
            this.Toast({
              message: err.flagmsg,
              position: 'bottom',
              duration: 5000
            })
          }
        })
      },
      pickCity (el, city) {
        // 如果有class则不是第一次进来
        if (this.lastCityNode) {
          // 如果是同一个元素则直接返回，不做任何处理
          if (city[0] === this.lastCityNode.city[0]) {
            return false
          } else {
            // 如果不是同一个元素，则清除上一个的class，加上当前的class
            this.lastCityNode.el.target.className = ''
          }
        }
        this.lastCityNode = {city: city, el: el}
        el.target.className = 'active li'
        let fromOrTo = this.$props.options.fromOrTo
        this.transforCityToParent({city: city, fromOrTo: fromOrTo})
        this.recordSelectedCitys(city)
        this.onClose()
      },
      pickCityFromSearch (city) {
        this.onClose()
        this.isFocus = false
        let fromOrTo = this.$props.options.fromOrTo
        this.transforCityToParent({city: city, fromOrTo: fromOrTo})
        this.recordSelectedCitys(city)
      },
      transforCityToParent (args = {}) {
        this.$emit('listenToChildEvent', args)
      },
      clickAlphaBeta () {
        // 防止二次点击同一个元素
        if (fun.hasClass(arguments[1].target.className, 'active')) {
          return false
        }
        this.clearClassName()
        let alpha = arguments[0]
        let arrIndex = 0
        alpha = _.isObject(alpha) ? alpha.label : alpha
        _.forEach(this.alphabeta, (val, index) => {
          if (val.label && val.label === alpha || val === alpha) {
            arrIndex = index
          }
        })
        this.alphabeta.splice(arrIndex, 1, {label: alpha, className: 'active'})
        this.currentCharacter = alpha.toLowerCase()
        this.findCityFromStartWord(alpha)
      },
      clearClassName () {
        _.forEach(this.alphabeta, val => {
          if (val.className !== '') {
            delete val.className
          }
        })
      },
      findCityFromStartWord () {
        let character = arguments[0].toLowerCase()
        if (!this.selectedCitys[character]) {
          this.selectedCitys[character] = []
        }
        _.forEach(this.cityList.cityList, val => {
          if (_.startsWith(val[1], character)) {
            this.selectedCitys[character].push(val)
          }
        })
      },
      onClose () {
        this.$emit('onClickBackButton')
      },
      handleRouter (isActive) {
        let This = this
        this.handleGlobalPopupLayer({This, isActive})
      }
    },
    created () {
      this.getSelectedCitys()
    },
    mounted () {
      this.Toast({message: iosVersion})
      let windowHeight = window.innerHeight
      this.$refs.bodyBox.style.height = windowHeight - 100 + 'px'
    }
  }
</script>
