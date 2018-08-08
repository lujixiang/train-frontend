<template>
  <div class="id-wallet-content">
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div class="header-wraper">
        <mt-header class="header" :fixed="false" title="编辑人员">
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
          <template v-for="card in idCollections">
            <id-card ref="idcard" :key="card.key" :guid="card.key" v-on:delete="handleDeleteIDCard" v-on:viewpassport="handleViewPassport" v-on:openDate="handleOnDatePicker" :card="card"></id-card>
          </template>
          <div @click="addNewId" class="add-new-id" v-show="isShowAddButton">
            <span>
              <img :src="addNewIcon">
              添加证件
            </span>
          </div>
        </div>
      </div>
      <div class="modify-footer">
        <span class="delete" @click="handleDeleteOutUser">删除</span>
        <span class="confirm" @click="confirmAdded">确定</span>
      </div>
    </mt-popup>
    <!-- <id-notice :active="isShowNotice" :rule="rule" v-on:closeNotice="isShowNotice = !isShowNotice"></id-notice> -->
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import './less/style.less'
  const _ = require('lodash')
  const fun = require('@/lib/fun')
  const exclamatoryIcon = require('./images/gantanhao.svg')
  const questionIcon = require('./images/questionmark.svg')
  const addNewIcon = require('./images/add.svg')
  export default {
    name: 'idModify',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      },
      user: {
        type: Object,
        default: _ => {
          return {}
        },
        require: true
      }
    },
    data () {
      return {
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
        guid: 0
      }
    },
    watch: {
      user: function (newV, oldV) {
        if (newV) {
          this.loaded()
        }
      }
    },
    computed: {
      isShowAddButton () {
        return this.idCollections.length < 4
      }
    },
    methods: {
      ...mapActions(['handleGlobalPopupStack']),
      ...mapActions('company', ['addOutsideUser', 'getCurrentUser', 'deleteOuteUser']),
      onClose () {
        this.$emit('closeModify')
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
        this.$refs.picker.open()
      },
      addNewOutsideUser (args) {
        let { infoList, delIds } = args
        let { currentUser, passengerName, contactNumber } = this
        let params = {
          chineseName: passengerName,
          linkPhone: contactNumber,
          userId: currentUser.user_sys_key,
          delIds, // 删除的userid
          outUserId: '', // 如果为空则是插入，如果有值则为修改
          infoList: JSON.stringify(infoList) // 暂时不考虑这个字段
        }
        return new Promise((resolve, reject) => {
          this.addOutsideUser({resolve, reject, params})
        })
      },
      handleDeleteOutUser () {
        this.Indicator.open()
        let { id } = this.$props.user
        let params = {outUserId: id}
        return new Promise((resolve, reject) => {
          this.deleteOuteUser({resolve, reject, params})
        })
        .then(res => {
          this.onClose()
          this.Indicator.close()
          this.$emit('deleteSuccess', '删除成功')
          console.log(res)
        })
        .catch(e => {
          this.Indicator.close()
          this.Toast({message: e.flagmsg, position: 'bottom'})
          console.log(e)
        })
      },
      handleGetCurrentUser () {
        return new Promise((resolve, reject) => {
          this.getCurrentUser({resolve, reject})
        })
      },
      checkUserInfo (components) {
        let testThrouth = true
        let message = ''
        let infoList = []
        /*
          documentType:"",documentNO:"",birthday:"",givenName:"",surName:""
        */
        _.forEach(components, component => {
          let userInfo = component.userInfo
          if (userInfo.key === 1) {
            if (userInfo.firstName === '') {
              testThrouth = false
              message = '姓（拼音）不能为空'
            }
            if (userInfo.lastName === '') {
              testThrouth = false
              message = '名（拼音）不能为空'
            }
          } else if (userInfo.key === 7) {
            if (!fun.checkID(userInfo.idNo) || userInfo.idNo === '') {
              testThrouth = false
              message = '身份证不正确'
            }
          }
          if (userInfo.idNo === '') {
            testThrouth = false
            message = '证件号不能为空'
          }
          if (userInfo.birthday === '') {
            testThrouth = false
            message = '出生日期不能为空'
          }
          infoList.push({documentType: userInfo.key, documentNO: userInfo.idNo, birthday: userInfo.birthday, givenName: userInfo.firstName, surName: userInfo.lastName})
        })
        return {testThrouth, infoList, message}
      },
      confirmAdded () {
        let { testThrouth, infoList, message } = this.checkUserInfo(this.$refs.idcard)
        console.log(infoList)
        if (this.passengerName === '') {
          this.Toast({
            message: '请输入正确的中文姓名',
            position: 'bottom'
          })
          return false
        }
        if (!fun.checkMobile(this.contactNumber)) {
          this.Toast({
            message: '请输入正确的手机号码',
            position: 'bottom'
          })
          return false
        }
        // 这个时候需要判定是否添加了证件
        if (this.idCollections.length === 0) {
          this.Toast({message: '请添加证件', position: 'bottom'})
          return false
        }
        if (!testThrouth) {
          this.Toast({message, position: 'bottom'})
          return false
        }
        let delIds = '' // 需要删除的用户id
        this.Indicator.open()
        this.addNewOutsideUser({infoList, delIds})
        .then(res => {
          this.Indicator.close()
          this.onClose()
          this.$emit('addedSuccess', '添加成功')
        })
        .catch(e => {
          this.Indicator.close()
          this.Toast({message: e.flagmsg, position: 'bottom'})
        })
      },
      getGuid () {
        this.guid = this.guid + 1
        return this.guid
      },
      addNewId () {
        this.idCollections.push({key: this.getGuid()})
      },
      handleDeleteIDCard (card) {
        let ids = _.cloneDeep(this.idCollections)
        _.remove(ids, (item, index) => { return item.key === card.key })
        this.idCollections = ids
      },
      loaded () {
        let { cellPhone, userName, documentInformationList } = this.$props.user
        this.contactNumber = cellPhone
        this.passengerName = userName
        if (documentInformationList) {
          let ids = []
          _.forEach(documentInformationList, item => {
            item['key'] = this.getGuid()
            ids.push(item)
          })
          this.idCollections = _.cloneDeep(ids)
        }
      }
    },
    mounted () {
      this.$refs.idBody.style.height = this.windowHeight - 88 + 'px'
      // this.loaded()
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
