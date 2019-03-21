<template>
  <div class="passenger-content">
    <template v-for="item in this.passengers">
      <div class="passengers">
        <div class="person-info">
          <div class="info">
            <div class="user">
              <span class="name">{{item.Name}}</span>
              <span class="tickets-type">成人票</span>
            </div>
            <template v-if="item.idcardno === '' || item.IdNo === '' || !checkID(item.IdNo) && !item.isOuter">
              <div class="id">
                <span>
                  <img :src="editIcon" width="14" height="14" alt="">
                  <span class="text-input" @click="typeIntoIDNO(item)">请输入身份证号码</span>
                </span>
              </div>
            </template>
            <template v-else>
              <div class="id">{{item.idcardno}}</div>
            </template>
          </div>
          <template v-if="action !== 'endorse' && action !== 'rebooking'">
            <div class="delete" @click="handleDeletePassenger($event, item)">
              <ykb-icon type="delete" :width="20" :height="20"></ykb-icon>
            </div>
          </template>
        </div>
        <template v-for="(item, i) in travelStandard">
          <div v-if="!item.isStandard" class="is-out-of-standard">
            <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
            <span class="standard-text">{{item.detail}}</span>
            <span class="label">{{i === 0 ? '去程' : '返程'}}</span>
          </div>
        </template>
        <trip-picker :user="item" v-on:pickTrip="onPassengerChange"></trip-picker>
      </div>
    </template>
    <template v-if="action !== 'endorse' && action !== 'rebooking'">
      <div class="add-passenger">
        <div class="left-btn" @click="addPassenger({isOuter: false})">
          <ykb-icon type="cross" :width="12" className="add-button"></ykb-icon>
          <span>添加乘车人</span>
        </div>
      </div>
      <enhance-passengers v-on:clearAllPassengers="handleOnPassengerEmpty" :active="isActivePopup" v-on:passengerClose="handleOnClose" v-on:select="handleOnSelectPassengers" v-on:deleteFromList="handleDeleteFromList"></enhance-passengers>
    </template>
    <edit-id :active="popupVisible" v-on:closeEditIdBox="handleOnCloseEditIdBox" v-on:confirmEdit="handleConfirmEidt"></edit-id>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const fun = require('@/lib/fun')
  const editIcon = require('./images/edit.png')
  const _ = require('lodash')
  export default {
    name: 'passenger',
    props: {
      maxSize: {
        type: Number,
        default: 5,
        require: false
      },
      goSeat: {
        type: String,
        default: '',
        require: false
      },
      backSeat: {
        type: String,
        default: '',
        require: false
      },
      ticket: {
        type: Object,
        default: _ => {
          return {}
        },
        require: true
      },
      action: {
        type: String,
        default: '',
        require: false
      }
    },
    data () {
      return {
        editIcon,
        checkID: fun.checkID,
        passengers: [],
        currentUser: {},
        isActivePopup: false,
        popupVisible: false,
        travelStandard: [],
        currentEditUserKey: ''
      }
    },
    methods: {
      ...mapActions('company', ['getCurrentUser', 'getCompanyUserList', 'isStandardSeat', 'getTraveler', 'deleteSelectedPassenger']),
      addPassenger (args) {
        this.handleOnClose()
        this.currentUser.visiable = false
      },
      onPassengerChange () {
        this.$emit('passengerChange', this.passengers)
      },
      handleOnPassengerEmpty () {
        this.passengers = []
      },
      addMeAsPassenger (params = {isme: true}) {
        if (this.$props.maxSize <= this.passengers.length) {
          this.Toast({message: '最多只能添加' + this.$props.maxSize + '个乘客', position: 'bottom'})
        } else {
          if (params.isme) {
            this.passengers.push(this.currentUser)
            this.currentUser.visiable = false
          } else {
            if (this.isPassengerExist(params.user)) {
              this.Toast({message: '不能重复添加' + params.user.Name, duration: 5000})
            } else {
              let user = _.cloneDeep(params.user)
              if (!user.IdNo || !fun.checkID(user.IdNo)) {
                user['IdNo'] = ''
                user['idcardno'] = ''
              }
              user['trip'] = 'all'
              this.passengers.push(user)
            }
          }
        }
        this.onPassengerChange()
      },
      isPassengerExist (user) {
        let isExist = false
        this.passengers.forEach(item => {
          if (item['UserKey'] === user['UserKey']) {
            isExist = true
          }
        })
        return isExist
      },
      handleDeletePassenger (el, item) {
        let UserKey = item.UserKey
        this.passengers.forEach((item, index) => {
          if (item.UserKey === UserKey) {
            // this.passengers.splice(index, 1)
            this.handleLabelClick(item)
          }
        })
        this.onPassengerChange()
      },
      handleLabelClick (node) {
        let { isOuter } = node
        let passengers = _.cloneDeep(this.passengers)
        if (isOuter) {
          this.passengers = fun.deleteNodeFromArray(passengers, node, 'UserKey')
          this.deleteSelectedPassenger({user: node, clearAll: () => {}})
        } else {
          this.passengers = fun.deleteNodeFromArray(passengers, node, 'UserKey')
          // 删除完当前的入住人以后还需要把store里面的数据更新一下
          this.deleteSelectedPassenger({user: node, clearAll: () => {}})
        }
      },
      handleOnCloseEditIdBox () {
        this.popupVisible = !this.popupVisible
      },
      handleConfirmEidt (idno) {
        this.passengers.forEach(res => {
          if (res.UserKey === this.currentEditUserKey) {
            res.idcardno = fun.encryptIDNo(idno)
            // res.idcardno = idno.replace(/^(\d{4})(\d+)(\d{4})$/, '$1**********$3')
            res.IdNo = idno
          }
        })
        this.handleOnCloseEditIdBox()
      },
      typeIntoIDNO (args) {
        this.handleOnCloseEditIdBox()
        this.currentEditUserKey = args.UserKey
      },
      handleOnSelectPassengers (passengers) {
        /*
          Name: 乘客名称,
          idcardno: fun.encryptIDNo(身份证号码),
          IdNo: 身份证号码
          UserKey: 用户systemid
          visiable: 是否可见
          isOuter: 是否是外部人
        */
        // 默认必须加上往返两程的参数，不然到下单页无法正确计算价格
        this.passengers = _.forEach(passengers, p => { p['trip'] = 'all' })
        this.$emit('passengerChange', passengers)
      },
      handleDeleteFromList (user) {
        let { isOuter } = user
        let passengers = _.cloneDeep(this.passengers)
        if (isOuter) {
          this.passengers = fun.deleteNodeFromArray(passengers, user, 'id')
        } else {
          this.passengers = fun.deleteNodeFromArray(passengers, user, 'UserKey')
        }
        this.handleOnSelectPassengers(this.passengers)
      },
      handleOnClose () {
        this.isActivePopup = !this.isActivePopup
      },
      handleOnAddPassengerClose () {
        this.isActiveOutPassenger = !this.isActiveOutPassenger
      },
      requestCurrentUser () {
        return new Promise((resolve, reject) => {
          this.getCurrentUser({resolve, reject})
        })
      },
      requestTraveler () {
        return new Promise((resolve, reject) => {
          this.getTraveler({resolve, reject})
        })
      },
      handleIsStandard (args) {
        return new Promise((resolve, reject) => {
          const callback = res => {
            resolve(res)
          }
          let trainType = ''
          let seat = ''
          if (args === 'go') {
            trainType = this.$props.ticket.go.info.train_type
            seat = this.$props.goSeat
          } else if (args === 'back') {
            trainType = this.$props.ticket.back.info.train_type
            seat = this.$props.backSeat
          }
          this.isStandardSeat({label: seat, trainType, callback})
        })
      },
      handleRoundTripStandard () {
        return Promise.all([this.handleIsStandard('go'), this.handleIsStandard('back')])
      }
    },
    created () {
      // 首先获取travellers，如果有traveller则显示traveller如果没有则显示当前用户
      this.requestTraveler()
      .then(res => {
        let idcardno = ''
        let IdNo = ''
        if (res && res.user_passportseno && fun.checkID(res.user_passportseno)) {
          // idcardno = res.user_passportseno.replace(/^(\d{4})(\d+)(\d{4})$/, '$1**********$3')
          idcardno = fun.encryptIDNo(res.user_passportseno)
          IdNo = res.user_passportseno
        }
        this.passengers.push({Name: res.user_name, idcardno, IdNo, userSysId: res.user_sys_key, UserKey: res.user_sys_key, CellPhone: res.user_phone, visiable: true, trip: 'all'})
        this.onPassengerChange()
        return res
      })
      .then(res => {
        return this.handleRoundTripStandard()
      })
      .then(res => {
        this.travelStandard = res
      })
      .catch(_ => {
        // 获取当前用户
        this.requestCurrentUser()
        .then(res => {
          let idcardno = ''
          let IdNo = ''
          if (res && res.user_passportseno && fun.checkID(res.user_passportseno)) {
            idcardno = fun.encryptIDNo(res.user_passportseno)
            IdNo = res.user_passportseno
          }
          this.currentUser = {Name: res.user_name, idcardno, IdNo, userSysId: res.user_sys_key, UserKey: res.user_key, CellPhone: res.user_phone, visiable: true, trip: 'all'}
          // 按照需求，获取当前用户以后要默认选择
          if (this.$props.action !== 'endorse' && this.$props.action !== 'rebooking') {
            this.addMeAsPassenger()
          } else {
            this.currentUser.visiable = false
          }
          // 判断是否超标
          return this.handleRoundTripStandard()
        })
        .then(res => {
          this.travelStandard = res
        })
        .catch(e => {
          console.log(e)
          this.Toast({message: e.flagmsg, position: 'bottom'})
        })
      })
    }
  }
</script>
