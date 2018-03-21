<template>
  <div class="index-list-content">
    <!-- closeOnClickModal禁止点击遮罩层关闭弹层 -->
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div style="height: 100px;">
        <div style="height: 40px">
          <mt-header class="header" :fixed="false" title="选择乘车人">
            <mt-button slot="left" icon="back" @click="onClose">
              <span>返回</span>
            </mt-button>
          </mt-header>
        </div>
        <div class="search-box">
          <input type="text" id="search-name" v-on:input="searching" placeholder="按照姓名、拼音、首字母搜索">
        </div>
      </div>
      <template v-if="isSearch">
        <div class="search-result">
          <ul>
            <template v-for="item in this.$store.state.company.USER_LIST">
              <li @click.stop="onListClick(item)" v-if="item.visiable">
                <span>{{item.Name}}</span>
              </li>
            </template>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="index-list-box">
          <mt-index-list>
            <template v-for="(value, key) in this.$store.state.company.companyuserlist">
              <mt-index-section v-if="value.length > 0" :index="key">
                <template v-for="item in value">
                  <div @click.stop="onListClick(item)">
                    <mt-cell v-if="item.visiable" :title="item.Name"></mt-cell>
                  </div>
                </template>
              </mt-index-section>
            </template>
            <div class="empty-bottom"></div>
          </mt-index-list>
        </div>
      </template>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const backIcon = require('./images/back.png')
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
        backIcon
      }
    },
    watch: {
      active: function (cV, oV) {
        this.handleRouter(cV)
      }
    },
    methods: {
      ...mapActions('company', [
        'getCompanyUserList'
      ]),
      ...mapActions([
        'handleGlobalPopupLayer'
      ]),
      searching (e) {
        this.$emit('searching', e.target)
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
      }
    },
    mounted () {
      // 当公司用户列表为空的时候去请求公司人员列表
      if (this.$store.state.company.companyuserlist && this.$store.state.company.companyuserlist.length === 0) {
        const callback = res => {}
        const errcallback = res => {}
        this.getCompanyUserList({callback, errcallback})
      }
    }
  }
</script>
