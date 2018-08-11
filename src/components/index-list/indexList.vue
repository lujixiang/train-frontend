<template>
  <div class="index-list-content">
    <!-- closeOnClickModal禁止点击遮罩层关闭弹层 -->
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div style="height: 40px">
        <mt-header class="header" :fixed="false" title="选择乘车人">
          <mt-button slot="left" icon="back" @click="onClose">
            <span></span>
          </mt-button>
        </mt-header>
      </div>
      <div class="search-wrap">
        <div class="search-input-box">
          <ykb-icon type="search" :width="16" :height="16"></ykb-icon>
          <input type="text" name="search" ref="keywords" v-model="keywords" v-on:input="searching" placeholder="按照姓名、拼音、首字母搜索">
        </div>
      </div>
      <template v-if="isSearch">
        <div class="search-result">
          <ul>
            <template v-for="item in this.$store.state.company.USER_LIST">
              <li @click.stop="onListClick(item)" v-if="item.visiable">
                <span>{{item.userName}}</span>
              </li>
            </template>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="index-list-box">
          <template v-if="lodash.isEmpty(this.$store.state.company.companyuserlist)">
            <div class="loading-spinner">
              <span class="loading-text">努力加载中</span>
              <mt-spinner :size="40" color="#17abcb" type="triple-bounce"></mt-spinner>
            </div>
          </template>
          <template v-else>
            <mt-index-list :height="height">
              <template v-for="(value, key) in this.$store.state.company.companyuserlist">
                <mt-index-section v-if="value.length > 0" :index="key">
                  <template v-for="item in value">
                    <div @click.stop="onListClick(item)">
                      <mt-cell v-if="item.visiable" :title="item.userName"></mt-cell>
                    </div>
                  </template>
                </mt-index-section>
              </template>
            </mt-index-list>
          </template>
        </div>
      </template>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const backIcon = require('./images/back.png')
  const _ = require('lodash')
  export default {
    name: 'indexList',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      },
      isSearch: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        backIcon,
        lodash: _,
        height: window.innerHeight - 85,
        keywords: ''
      }
    },
    watch: {
      active: function (cV, oV) {
        this.handleRouter(cV)
        // 首先从缓存里面取值，如果缓存里面不存在则再请求后台获取
        if (cV) {
          this.keywords = ''
          this.getCompanyUsers({cacheFirst: true})
          .then(res => {
          })
          .catch(e => {
            this.getCompanyUsers({cacheFirst: false, params: {businessType: '4'}})
            .then(res => {
            })
            .catch(e => {
              this.Toast({message: '登录过期', position: 'bottom'})
            })
          })
        }
      }
    },
    methods: {
      ...mapActions('company', ['getInsideCompanyUserList']),
      ...mapActions(['handleGlobalPopupLayer']),
      searching (e) {
        this.$emit('searching', this.keywords)
      },
      onListClick (e) {
        this.$emit('listClick', e)
      },
      onClose () {
        this.$emit('close')
      },
      handleRouter (isActive) {
        let This = this
        this.handleGlobalPopupLayer({This, isActive})
      },
      getCompanyUsers (args = {}) {
        return new Promise((resolve, reject) => {
          this.getInsideCompanyUserList({resolve, reject, ...args})
        })
      }
    }
  }
</script>
