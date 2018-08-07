<template>
  <div class="id-wallet-content">
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div class="header-wraper">
        <mt-header class="header" :fixed="false" title="新增人员">
          <mt-button slot="left" icon="back" @click="onClose">
            <!-- <span>返回</span> -->
          </mt-button>
        </mt-header>
      </div>
      <div class="id-body" ref="idBody">
        <div class="personal-info">
          <div class="form-group">
            <div class="input-item">
              <label>中文姓名*</label>
              <input type="text" name="name" placeholder="请输入中文姓名" v-model="passengerName">
              <span class="right-icon" @click="noticeAlert">
                <img :src="exclamatoryIcon">
              </span>
            </div>
            <div class="input-item">
              <label>手机号*</label>
              <input type="text" name="phone-number" placeholder="请输入手机号码" v-model="contactNumber">
              <span class="right-icon">
                <!-- <img :src="exclamatoryIcon"> -->
              </span>
            </div>
          </div>
        </div>
        <div class="wallet-collections">
          <!-- <template v-for="card in idCollections">
            <id-card :key="card.key" :guid="card.key" v-on:delete="handleDeleteIDCard" :isConfirm="isConfirm" v-on:viewpassport="handleViewPassport" v-on:openDate="handleOnDatePicker"></id-card>
          </template> -->
          <!-- <div @click="addNewId" class="add-new-id">
            <span>
              <img :src="addNewIcon">
              添加证件
            </span>
          </div> -->
        </div>
      </div>
      <div class="wallet-footer" @click="confirmAdded">
        <span>完成</span>
      </div>
    </mt-popup>
    <!-- <id-notice :active="isShowNotice" :rule="rule" v-on:closeNotice="isShowNotice = !isShowNotice"></id-notice> -->
    <!-- <mt-datetime-picker
      ref="picker"
      type="date"
      :startDate="startDate"
      :endDate="endDate"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      v-model="pickerVisible">
    </mt-datetime-picker> -->
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import './less/style.less'
  const _ = require('lodash')
  const moment = require('moment')
  const exclamatoryIcon = require('./images/gantanhao.svg')
  const questionIcon = require('./images/questionmark.svg')
  const addNewIcon = require('./images/add.svg')
  export default {
    name: 'idWallet',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        startDate: new Date(new Date().getFullYear() - 70, 0, 1),
        endDate: new Date(new Date().getFullYear(), 0, 1),
        exclamatoryIcon,
        questionIcon,
        addNewIcon,
        passengerName: '',
        contactNumber: '',
        isShowNotice: false,
        rule: 'chineseName',
        currentUser: {},
        idCollections: [],
        windowHeight: window.innerHeight,
        guid: 0,
        isConfirm: false,
        pickerVisible: ''
      }
    },
    methods: {
      ...mapActions(['handleGlobalPopupStack']),
      ...mapActions('company', ['addOutsideUser', 'getCurrentUser']),
      onClose () {
        this.$emit('closeIdWallet')
      },
      noticeAlert () {
        this.rule = 'chineseName'
        this.isShowNotice = !this.isShowNotice
      },
      handleViewPassport (args) {
        this.rule = args.rule
        this.isShowNotice = !this.isShowNotice
      },
      handleOnDatePicker () {
        console.log('zopud')
        this.$refs.picker.open()
      },
      handleConfirm (d) {
        let date = moment(d).format('YYYY-MM-DD')
        console.log(date)
      },
      addNewOutsideUser () {
        let { currentUser, passengerName, contactNumber } = this
        let params = {
          chineseName: passengerName,
          linkPhone: contactNumber,
          userId: currentUser.UserId,
          outUserId: '', // 如果为空则是插入，如果有值则为修改
          infoList: '' // 暂时不考虑这个字段
        }
        return new Promise((resolve, reject) => {
          this.addOutsideUser({resolve, reject, params})
        })
      },
      handleGetCurrentUser () {
        return new Promise((resolve, reject) => {
          this.getCurrentUser({resolve, reject})
        })
      },
      confirmAdded () {
        this.isConfirm = true
        if (this.passengerName === '') {
          this.Toast({
            message: '请输入正确的中文姓名',
            position: 'bottom'
          })
          return false
        }
        if (this.contactNumber === '') {
          this.Toast({
            message: '请输入正确的11位手机号码',
            position: 'bottom'
          })
          return false
        }
        this.Indicator.open()
        this.addNewOutsideUser()
        .then(res => {
          this.Indicator.close()
          this.$emit('addedSuccess')
        })
        .catch(e => {
          this.Indicator.close()
          this.Toast({message: e.msg, position: 'bottom'})
        })
      },
      addNewId () {
        this.guid = this.guid + 1
        this.idCollections.push({key: this.guid})
      },
      handleDeleteIDCard (card) {
        let ids = _.cloneDeep(this.idCollections)
        _.remove(ids, (item, index) => { return item.key === card.key })
        this.idCollections = ids
      }
    },
    mounted () {
      this.$refs.idBody.style.height = this.windowHeight - 88 + 'px'
      this.handleGetCurrentUser()
      .then(res => {
        this.currentUser = res
      })
      .catch(e => {
        console.log(e)
      })
    }
  }
</script>
