<template>
  <section class="section ykb-input-search">
    <div class="search-container">
      <div class="left">
        <span class="search-icon">
          <ykb-icon type="search" :solo="true" :width="16" :height="16"></ykb-icon>
        </span>
        <input v-on:input="searching" v-on:focus="focus" v-on:blur="blur" class="search-input" :maxlength="maxlength" :placeholder="placeholder" name="search"  type="text">
      </div>
    </div>
    <div class="search-result" :class="this.isSearching ? '' : 'hide'">
      <!-- <p>搜索结果</p> -->
      <ul class="result-container">
        <li v-for="item in this.matchedData" @click="handleCityClick($event, item)" class="city-list">{{item[0]}}</li>
      </ul>
    </div>
  </section>
</template>

<script>
  import './less/style.less'
  const _ = require('lodash')
  const fun = require('@/lib/fun')
  export default {
    name: 'search',
    data () {
      return {
        matchedData: [],
        isSearching: false
      }
    },
    props: {
      placeholder: {
        type: String,
        require: false
      },
      maxlength: {
        type: String,
        require: false,
        default: 10
      },
      data: {
        type: Array,
        require: false,
        default: []
      }
    },
    methods: {
      matchCity (type = 'english', keywords = '', data = []) {
        this.matchedData = []
        if (type === 'chinese') {
          _.forEach(data, item => {
            if (item[0].indexOf(keywords) > -1) {
              this.matchedData.push(item)
            }
          })
        } else {
          _.forEach(data, item => {
            if (keywords.length === 1) {
              // 检验关键词开始
              if (_.startsWith(item[1], keywords)) {
                this.matchedData.push(item)
              }
            } else if (keywords.length >= 2) {
              if (item[2].indexOf(keywords) > -1 || item[1].indexOf(keywords) > -1) {
                this.matchedData.push(item)
              }
            }
          })
        }
      },
      handleCityClick (el, item) {
        this.$emit('onSelectCity', item)
      },
      focus () {
        this.$emit('focus')
      },
      blur () {
        this.$emit('blur')
      },
      searching (e) {
        e = e.target.value || ''
        e = e.replace(/\s+/g, '')
        let aCityData = this.$props.data
        if (e === '') {
          // 关闭搜索结果
          this.matchedData = []
          this.isSearching = false
        } else {
          // 显示搜索结果
          this.isSearching = true
          if (fun.isChineseCharacters(e)) { // 如果是中文，如果是英文分别处理
            this.matchCity('chinese', e, aCityData)
          } else {
            this.matchCity('english', e.toLocaleLowerCase(), aCityData)
          }
        }
      }
    },
    mounted () {
      // let aInput = document.getElementsByClassName('search-input')[0]
      // let aSearchResultBox = document.getElementsByClassName('search-result')[0]
      // let aCityData = this.$props.data

      // aInput.addEventListener('input propertychange', e => {
      //   let val = aInput.value
      //   if (val === '') {
      //     aSearchResultBox.className = 'search-result hide'
      //     this.matchedData = []
      //     return false
      //   }
      //   aSearchResultBox.className = 'search-result'
      //   if (/^[\u4e00-\u9fa5]+$/i.test(val)) { // 如果是中文，如果是英文分别处理
      //     this.matchCity('chinese', val, aCityData)
      //   } else {
      //     this.matchCity('english', val.toLocaleLowerCase(), aCityData)
      //   }
      // })
    }
  }
</script>
