<template>
  <div class="enhence-passenger-content">
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div class="header-wraper">
        <mt-header class="header" :fixed="false" title="选择人员">
          <mt-button slot="left" icon="back" @click="onClose">
          </mt-button>
        </mt-header>
      </div>
      <div class="tab-bar">
        <span v-for="item in tabs" :class="item.checked ? 'active' : ''" @click="switchTab(item)">{{item.label}}</span>
      </div>
      <div class="search-wrap">
        <div class="search-input-box">
          <ykb-icon type="search" :width="16" :height="16"></ykb-icon>
          <input type="text" name="search" ref="keywords" v-on:input="searching" placeholder="支持姓名、拼音、手机号">
        </div>
      </div>
      <div :class="isSearching ? 'hide' : ''">
        <div class="tab-content-inner" :class="isInner ? '' : 'hide'">
          <div class="tab-content" ref="tabcontent">
            <div class="inner-tab-content">
              <list-view :model="model" :data="this.$store.state.company.companyuserlist"></list-view>
            </div>
          </div>
        </div>
        <div class="tab-content-outer" :class="isInner ? 'hide' : ''">
          <div class="search-by-button" @click="handleAddNewMember">
            <span><img :src="addNewIcon">新增人员</span>
            <img :src="entranceIcon" width="24" class="entrance-icon">
          </div>
          <div class="tab-content" ref="tabcontentOuter">
            <outer-list :model="model" :data="this.$store.state.company.companyOutsideUserList" :isLoading="isLoadingOutPassengers" v-on:modify="handleOnModifyPassenger"></outer-list>
          </div>
        </div>
      </div>
      <div class="search-result-container" ref="searchResultContent" :class="isSearching ? '' : 'hide'">
        <ul>
          <template v-for="passenger in matchedPassengers">
            <li :key="passenger.userSysId" @click="handleCheckItem(passenger)">
              <div class="person-container">
                <span class="check">
                  <img v-if="model === 'multi'" :src="passenger.selected ? checkedIcon : uncheckedIcon">
                  <img v-if="model === 'single'" :src="passenger.selected ? circleCheckedIcon : circleUnCheckedIcon">
                </span>
                <div class="user-info">
                  <div class="top text-left">
                    <span class="name">{{passenger.userName}}</span>
                    <span class="phone">{{passenger.cellPhone}}</span>
                  </div>
                  <div class="position">
                    <span class="dep">{{passenger.departmentName}}</span>
                    <span class="job">{{passenger.title}}</span>
                  </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="passenger-footer">
        <div class="fixed-background" v-show="isExpandPassengers">
          <ul class="choosed-user-list">
            <li v-for="user in this.$store.state.company.selectedPassengers">
              <span class="delete" @click="deletePassengers(user)">
                <img :src="deleteIcon">
              </span>
              <div class="user">
                <span class="name">{{user.userName}} <small>{{user.cellPhone}}</small></span>
                <span class="job">{{user.departmentName}} {{user.title}}</span>
              </div>
            </li>
          </ul>
        </div>
        <span class="choosed text-overflow" @click="viewChoosedPassengers">
          <small>已选({{selectedText.length}})</small>
          {{selectedText.text}}
        </span>
        <span class="arrow-down-up" @click="viewChoosedPassengers">
          <img :src="arrowIcon" width="16">
        </span>
        <span class="confirm" @click="handleConfirmChoose">确定</span>
      </div>
    </mt-popup>
    <id-wallet :active="isIdWalletActive" v-on:closeIdWallet="handleOnCloseWallet" v-on:addedSuccess="handleOnAddOutUserSuccess"></id-wallet>
    <id-modify :active="isModifyActive" v-on:closeModify="handleOnCloseModify" v-on:modifySuccess="handleOnAddOutUserSuccess" :user="modifyUser" v-on:deleteSuccess="handleOnAddOutUserSuccess"></id-modify>
  </div> 
</template>

<script>
  import './less/style.less'
  import { mapActions, mapState } from 'vuex'
  const _ = require('lodash')
  const searchByIcon = require('./images/search-by.svg')
  const entranceIcon = require('@/assets/icons/entrance.png')
  const addNewIcon = require('./images/addnwe.svg')
  const deleteIcon = require('./images/delete.svg')
  const checkedIcon = require('./images/checked.svg')
  const uncheckedIcon = require('./images/unchecked.svg')
  const circleCheckedIcon = require('./images/circle-checked.svg')
  const circleUnCheckedIcon = require('./images/circle-unchecked.svg')
  const fun = require('@/lib/fun')
  export default {
    name: 'EnhancePassengers',
    props: {
      model: {
        type: String,
        default: 'multi',
        require: false
      },
      active: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        searchByIcon,
        entranceIcon,
        addNewIcon,
        deleteIcon,
        windowHeight: window.innerHeight,
        tabs: [{label: '内部同事', checked: true, value: 'inner'}, {label: '外部人员', checked: false, value: 'outer'}],
        isInner: true,
        isIdWalletActive: false,
        isModifyActive: false,
        modifyUser: {}, // 被修改的用户
        isExpandPassengers: false,
        isSearching: false,
        checkedIcon,
        uncheckedIcon,
        circleCheckedIcon,
        circleUnCheckedIcon,
        isLoadingOutPassengers: true
      }
    },
    watch: {
      active: function (newV, oldV) {
        // 如果是newV为true的时候需要判断是否有之前的搜索数据，如果有就要清除
        this.handleRouter(newV)
        if (newV) {
          this.isSearching = false
          this.$refs.keywords.value = ''
          // 首先从缓存里面取值，如果缓存里面不存在则再请求后台获取
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
          this.getOutUser({cacheFirst: true, params: {businessType: '4'}})
          .then(res => {
            this.isLoadingOutPassengers = false
          })
          .catch(e => {
            this.getOutUser({cacheFirst: false, params: {businessType: '4'}})
            .then(res => {
              this.isLoadingOutPassengers = false
            })
            .catch(e => {
              this.isLoadingOutPassengers = false
              this.Toast({message: '登录过期', position: 'bottom'})
            })
          })
        }
      }
    },
    computed: {
      ...mapState('company', {
        matchedPassengers: state => state.matchedPassengers,
        selectedText: state => {
          let sel = state.selectedPassengers
          let length = sel.length
          let text = ''
          sel.forEach(user => {
            text += user.userName + '、'
          })
          text = text.replace(/、$/, '')
          return {text, length}
        }
      }),
      arrowIcon () {
        return this.isExpandPassengers ? require('./images/icon-up.png') : require('./images/icon-down.png')
      }
    },
    methods: {
      ...mapActions(['handleGlobalPopupLayer']),
      ...mapActions('company', ['getInsideCompanyUserList', 'deleteSelectedPassenger', 'searchPassengersBy', 'getOutsideCompanyUserList', 'updateSelectedPassengers', 'switchPassenger', 'getSelectedPassengers']),
      getCompanyUsers (args = {}) {
        return new Promise((resolve, reject) => {
          this.getInsideCompanyUserList({resolve, reject, ...args})
        })
      },
      getOutUser (args = {}) {
        return new Promise((resolve, reject) => {
          this.getOutsideCompanyUserList({resolve, reject, ...args})
        })
      },
      handleOnAddOutUserSuccess (message = '添加成功') {
        this.Toast({message, position: 'bottom'})
        this.handleOnCloseWallet()
        this.Indicator.open({text: '正在刷新列表'})
        this.getOutUser({params: {businessType: '4'}})
        .then(res => {
          this.Indicator.close()
        })
        .catch(e => {
          console.log(e)
        })
      },
      onClose () {
        this.$emit('passengerClose')
      },
      handleRouter (isActive) {
        let This = this
        this.handleGlobalPopupLayer({This, isActive})
      },
      handleOnCloseWallet () {
        this.isIdWalletActive = false
      },
      handleOnCloseModify () {
        this.isModifyActive = !this.isModifyActive
      },
      handleOnModifyPassenger (args) {
        let { user } = args
        this.handleOnCloseModify()
        this.modifyUser = user
      },
      switchTab (e) {
        this.isInner = e.value === 'inner'
        if (!this.isInner) {
          this.isSearching = false
          this.$refs.keywords.value = ''
        }
        _.forEach(this.tabs, item => {
          if (item.value === e.value) {
            item['checked'] = true
          } else {
            item['checked'] = false
          }
        })
      },
      handleAddNewMember () {
        this.isIdWalletActive = true
      },
      handleConfirmChoose () {
        /*
          Name: 乘客名称,
          idcardno: fun.encryptIDNo(身份证号码),
          IdNo: 身份证号码
          UserKey: 用户systemid
          visiable: 是否可见
          isOuter: 是否是外部人
        */
        let { selectedPassengers } = this.$store.state.company
        let { model } = this.$props
        if (model === 'multi') {
          let passengers = []
          _.forEach(selectedPassengers, p => {
            // let doc = p.documentInformationList ? p.documentInformationList[0].documentNO : ''
            let docinfo = ''
            let UserKey = p.userSysId ? p.userSysId : p.id
            let isOuter = !p.isOuter
            let id = ''
            let CellPhone = p.cellPhone
            let idTypeID = '1'
            let Name = p.userName
            if (!isOuter) {
              id = UserKey
            }
            // 防止再次选择人员后出现上一次的证件id清空
            if (p.IdNo && p.IdNo !== '') {
              docinfo = p.IdNo
            } else {
              if (p.documentInformationList && p.documentInformationList.length > 0) {
                if (p.documentInformationList.length === 1) {
                  let singleInfo = p.documentInformationList[0]
                  docinfo = singleInfo.documentNO
                  idTypeID = fun.idTypeTranslate(singleInfo.documentType)
                  if (singleInfo.documentType === 1) {
                    Name = singleInfo.surName + ' ' + singleInfo.givenName
                  }
                  /* 后台的数据库返回 : 1: '护照', 7: '身份证', 3: '台胞证', 5: '港澳通行证' */
                  /* 真实传给供应商的参数： '1': 二代身份证，'C'：港澳通行证, 'G': 台湾通行证，'B'： 护照 */
                } else {
                  p.documentInformationList.forEach(doc => {
                    if (doc.checked) {
                      docinfo = doc.documentNO
                      idTypeID = fun.idTypeTranslate(doc.documentType)
                      if (doc.documentType === 1) {
                        Name = doc.surName + ' ' + doc.givenName
                      }
                    }
                  })
                }
              }
            }
            passengers.push({
              Name,
              idcardno: fun.encryptIDNo(docinfo),
              IdNo: docinfo,
              UserKey,
              id,
              idTypeID,
              userSysId: UserKey,
              visiable: true,
              CellPhone,
              isOuter: !isOuter
            })
          })
          this.$emit('select', passengers)
          this.onClose()
        } else if (model === 'single') {
          this.$emit('select', selectedPassengers[0])
          this.onClose()
        }
      },
      handleMulti (user) {
        const reject = (err) => {
          this.Toast({message: err.msg, position: 'bottom'})
        }
        this.updateSelectedPassengers({user, reject})
      },
      handleCheckItem (args) {
        // console.log(args)
        let { model } = this.$props
        if (model === 'multi') {
          // 这个时候是添加
          this.handleMulti(args)
        } else {
          // 这个时候是切换
          this.switchPassenger({user: args})
        }
      },
      viewChoosedPassengers () {
        this.isExpandPassengers = !this.isExpandPassengers
      },
      deletePassengers (user) {
        const clearAll = () => {
          // 当弹层出行人完全删除以后需要清空父组件里面的所有passengers数据
          this.$emit('clearAllPassengers')
          // 已选择的人员全部清除完以后需要收缩展示人员
          this.isExpandPassengers = false
        }
        const callback = (user) => {
          let docinfo = ''
          try {
            docinfo = user.documentInformationList[0].documentNO
          } catch (e) {
            docinfo = ''
          }
          this.$emit('deleteFromList', {Name: user.userName, idcardno: fun.encryptIDNo(docinfo), IdNo: docinfo, UserKey: user.userSysId, visiable: true, isOuter: false})
        }
        this.deleteSelectedPassenger({user, clearAll, callback})
      },
      searching (e) {
        e = e.target.value || ''
        e = e.replace(/\s+/g, '')
        if (e === '') {
          // 关闭搜索结果
          this.isSearching = false
        } else {
          // 显示搜索结果
          this.isSearching = true
          if (fun.isChineseCharacters(e)) { // 如果是中文，如果是英文分别处理
            this.searchPassengersBy({keyword: e, type: 'chinese'})
          } else if (fun.isNumber(e)) {
            this.searchPassengersBy({keyword: e, type: 'number'})
          } else {
            this.searchPassengersBy({keyword: e, type: 'english'})
          }
        }
      }
    },
    mounted () {
      // 获取已选择的出行人
      this.getSelectedPassengers()
      this.$refs.tabcontent.style.height = this.windowHeight - 170 + 'px'
      this.$refs.tabcontentOuter.style.height = this.windowHeight - 210 + 'px'
      this.$refs.searchResultContent.style.height = this.windowHeight - 170 + 'px'
    }
  }
</script>
