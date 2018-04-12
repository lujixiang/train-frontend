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
        <template v-if="!travelStandard.isStandard">
          <div class="is-out-of-standard">
            <ykb-icon type="iconWarn" :width="14" :height="14"></ykb-icon>
            <span class="standard-text">{{travelStandard.detail}}</span>
          </div>
        </template>
      </div>
    </template>
    <template v-if="action !== 'endorse' && action !== 'rebooking'">
      <div class="add-passenger">
        <div class="left-btn" @click="addPassenger({isOuter: false})">
          <ykb-icon type="cross" :width="12" className="add-button"></ykb-icon>
          <span>添加乘车人</span>
        </div>
        <div class="middle-line"></div>
        <div class="right-btn" @click="addPassenger({isOuter: true})">
          <ykb-icon type="cross" :width="12" className="add-button"></ykb-icon>
          <span>添加外部乘车人</span>
        </div>
      </div>
      <add-passenger v-on:addNewMember="handleOnAddNewMember" :active="addPassengerPopupVisible" v-on:close="handleOnCloseAddPassenger"></add-passenger>
      <index-list :isSearch="isSearch" v-on:close="handleOnClose" v-on:searching="handleOnSearching" v-on:listClick="handleListClick" :active="isActivePopup"></index-list>
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
      seat: {
        type: String,
        default: '',
        require: true
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
        isSearch: false,
        popupVisible: false,
        addPassengerPopupVisible: false,
        travelStandard: {},
        currentEditUserKey: ''
      }
    },
    methods: {
      ...mapActions('company', [
        'getCurrentUser',
        'getCompanyUserList',
        'isStandardSeat',
        'onSearchingByName',
        'getTraveler'
      ]),
      ...mapActions('order', [
        'getOrderDetailByOrderId'
      ]),
      addPassenger (args) {
        if (args.isOuter) {
          this.addPassengerPopupVisible = !this.addPassengerPopupVisible
        } else {
          this.handleOnClose()
          this.currentUser.visiable = false
          this.isSearch = false
          document.getElementById('search-name').value = ''
        }
      },
      handleOnAddNewMember (args) {
        // 添加外部联系人
        if (this.$props.maxSize <= this.passengers.length) {
          this.Toast({
            message: '最多只能添加' + this.$props.maxSize + '个乘客',
            position: 'bottom',
            duration: 2000
          })
        } else {
          let user = {}
          user['isOuter'] = true
          user['Name'] = args.username
          user['CellPhone'] = args.phone
          user['idname'] = args.idtypeValue
          user['IdNo'] = args.idno
          user['idtypeid'] = args.id
          user['idcardno'] = args.idno
          user['UserKey'] = 'test_user'
          this.passengers.push(user)
          this.onPassengerChange()
        }
      },
      onPassengerChange () {
        this.$emit('passengerChange', this.passengers)
      },
      addMeAsPassenger (params = {isme: true}) {
        if (this.$props.maxSize <= this.passengers.length) {
          this.Toast({
            message: '最多只能添加' + this.$props.maxSize + '个乘客',
            position: 'bottom',
            duration: 2000
          })
        } else {
          if (params.isme) {
            this.passengers.push(this.currentUser)
            this.currentUser.visiable = false
          } else {
            if (this.isPassengerExist(params.user)) {
              this.Toast({
                message: '不能重复添加' + params.user.Name,
                duration: 5000,
                position: 'bottom'
              })
            } else {
              let user = _.cloneDeep(params.user)
              if (!user.IdNo || !fun.checkID(user.IdNo)) {
                user['IdNo'] = ''
                user['idcardno'] = ''
              }
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
            this.passengers.splice(index, 1)
          }
        })
        this.onPassengerChange()
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
      handleListClick (e) {
        this.addMeAsPassenger({isme: false, user: e})
        this.handleOnClose()
      },
      handleOnClose () {
        this.isActivePopup = !this.isActivePopup
      },
      handleOnCloseAddPassenger () {
        this.addPassengerPopupVisible = !this.addPassengerPopupVisible
      },
      handleOnAddPassengerClose () {
        this.isActiveOutPassenger = !this.isActiveOutPassenger
      },
      handleOnSearching (e) {
        let value = e.value.trim().toUpperCase()
        if (value === '') {
          this.isSearch = false
        } else {
          this.isSearch = true
        }
        this.onSearchingByName({keyword: value, store: this.$store.state.company})
      },
      requestCurrentUser () {
        return new Promise((resolve, reject) => {
          const callback = res => {
            let idcardno = ''
            let IdNo = ''
            if (res && res.user_passportseno && fun.checkID(res.user_passportseno)) {
              idcardno = fun.encryptIDNo(res.user_passportseno)
              IdNo = res.user_passportseno
            }
            this.currentUser = {Name: res.user_name, idcardno, IdNo, UserKey: res.user_key, CellPhone: res.user_phone, visiable: true}
            // 按照需求，获取当前用户以后要默认选择
            if (this.$props.action !== 'endorse' && this.$props.action !== 'rebooking') {
              this.addMeAsPassenger()
            } else {
              this.currentUser.visiable = false
            }
            resolve(res)
          }
          const errcallback = e => {
            this.Toast({
              message: e.flagmsg,
              position: 'bottom',
              duration: 5000
            })
            reject(e)
          }
          this.getCurrentUser({callback, errcallback})
        })
      },
      requestTraveler () {
        return new Promise((resolve, reject) => {
          const callback = res => {
            resolve(res)
          }
          const errcallback = err => {
            reject(err)
          }
          this.getTraveler({callback, errcallback})
        })
      },
      handleIsStandard () {
        return new Promise((resolve, reject) => {
          const callback = res => {
            resolve(res)
          }
          let { train_type } = this.$props.ticket.info
          let { seat } = this.$props
          this.isStandardSeat({label: seat, trainType: train_type, callback})
        })
      },
      getOrderDetail (action = '') {
        let callback = res => {
          this.Indicator.close()
          if (action === 'endorse') {
            _.forEach(res.train_passenger, item => {
              if (item.endorse) {
                this.passengers.push({
                  Name: item.passengersename,
                  idcardno: fun.encryptIDNo(item.passportseno),
                  IdNo: item.passportseno,
                  UserKey: item.userkey,
                  visiable: true,
                  isOuter: item.isOuter
                })
              }
            })
          } else if (action === 'rebooking') {
            _.forEach(res.train_passenger, item => {
              this.passengers.push({
                Name: item.passengersename,
                idcardno: fun.encryptIDNo(item.passportseno),
                IdNo: item.passportseno,
                UserKey: item.userkey,
                visiable: true,
                isOuter: item.isOuter
              })
            })
          }
          this.onPassengerChange()
        }
        let errcallback = err => {
          this.Indicator.close()
          console.log(err)
        }
        let { orderId, userkeys } = this.$store.state.company.companySettings
        let args = {orderid: orderId, userkeys, action}
        this.Indicator.open()
        this.getOrderDetailByOrderId({args, callback, errcallback})
      }
    },
    created () {
      let { action } = this.$props
      if (action === 'endorse' || action === 'rebooking') {
        // 获取当前用户,处理是否超标的问题
        this.requestCurrentUser()
        .then(res => {
          // 判断是否超标
          return this.handleIsStandard()
        })
        .then(res => {
          this.travelStandard = res
        })
        .catch(e => {
          console.log(e)
        })
        // 如果是改签或者预订失败再次预订，则需要获取原订单详情
        this.getOrderDetail(action)
      } else {
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
          this.passengers.push({Name: res.user_name, idcardno, IdNo, UserKey: res.user_key, CellPhone: res.user_phone, visiable: true})
          this.onPassengerChange()
          return res
        })
        .then(res => {
          return this.handleIsStandard()
        })
        .then(res => {
          this.travelStandard = res
        })
        .catch(_ => {
          // 获取当前用户
          this.requestCurrentUser()
          .then(res => {
            // 判断是否超标
            return this.handleIsStandard()
          })
          .then(res => {
            this.travelStandard = res
          })
          .catch(e => {
            console.log(e)
          })
        })
      }
    }
  }
</script>
