<template>
  <div class="index-list-content">
    <mt-popup v-model="active" position="bottom" class="index-list-popup">
      <div class="index-list-header" >
        <action-sheet-header title="选择乘车人" v-on:confirm="onClose" v-on:cancel="onClose"></action-sheet-header>
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
            <div class="empty-bottom">已经到底啦</div>
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
    name: 'indexListSpa',
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
    methods: {
      ...mapActions('company', [
        'getCompanyUserList'
      ]),
      searching (e) {
        this.$emit('searching', e.target)
      },
      onListClick (e) {
        this.$emit('listClick', e)
      },
      onClose () {
        this.$emit('close')
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
