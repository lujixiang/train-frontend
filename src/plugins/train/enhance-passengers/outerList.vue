<template>
  <div class="outer-list-content">
    <template v-if="!isLoading">
      <div class="user-list-wrap">
        <div class="user-list-item" v-for="item in data">
          <div class="person-container">
            <span class="check" @click="handleCheckItem(item)">
              <img v-if="model === 'multi'" :src="item.selected ? checkedIcon : uncheckedIcon">
              <img v-if="model === 'single'" :src="item.selected ? circleCheckedIcon : circleUnCheckedIcon">
            </span>
            <div class="user-info">
              <div class="top text-left">
                <span class="name text-overflow">{{item.userName}}</span>
                <span class="phone text-overflow">{{item.cellPhone}}</span>
                <span class="edit" @click="handleUpdateUser(item)">
                  <img :src="editIcon">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="loading-spinner">
        <span class="loading-text">努力加载中</span>
        <mt-spinner :size="40" color="#17abcb" type="triple-bounce"></mt-spinner>
      </div>
    </template>
    <div class="fixed-background" @click="hideBackground" v-show="isShowIDPicker">
      <ul>
        <li v-for="id in idList" @click.stop="pickID(id.documentId)">
          <span class="check-icon"><img :src="id.checked ? circleCheckedIcon : circleUnCheckedIcon"></span>
          <span>{{getIDName(id.documentType)}}</span>
          <span>{{id.documentNO}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  const checkedIcon = require('./images/checked.svg')
  const uncheckedIcon = require('./images/unchecked.svg')
  const circleCheckedIcon = require('./images/circle-checked.svg')
  const circleUnCheckedIcon = require('./images/circle-unchecked.svg')
  const editIcon = require('./images/edit.svg')
  // const _ = require('lodash')
  export default {
    name: 'outerList',
    props: {
      data: {
        type: Array,
        default: _ => {
          return []
        },
        require: false
      },
      model: {
        type: String,
        default: 'multi',
        require: false
      },
      isLoading: {
        type: Boolean,
        default: true,
        require: false
      }
    },
    data () {
      return {
        checkedIcon,
        uncheckedIcon,
        circleCheckedIcon,
        circleUnCheckedIcon,
        editIcon,
        windowHeight: window.innerHeight - 214,
        isShowIDPicker: false,
        idList: [],
        pickedUser: {}
      }
    },
    methods: {
      ...mapActions('company', ['updateSelectedOuterPassengers', 'switchPassenger', 'pickPassengersID']),
      handleCheckItem (user) {
        let { model } = this.$props
        if (model === 'single') {
          user['isOuter'] = true
          this.handleSingle(user)
        } else if (model === 'multi') {
          if (!user['selected']) {
            if (user.documentInformationList && user.documentInformationList.length > 1) {
              this.idList = user.documentInformationList
              this.pickedUser = user
              this.hideBackground()
            } else {
              this.handleMulti(user)
            }
          } else {
            // 如果存在多证件的情况下需要让用户选择具体哪一个证件
            this.handleMulti(user)
          }
        }
      },
      handleSingle (user) {
        this.switchPassenger({user})
      },
      handleMulti (user) {
        const reject = (err) => {
          this.Toast({
            message: err.msg,
            position: 'bottom'
          })
        }
        const resolve = (res) => {
          console.log(res)
        }
        this.updateSelectedOuterPassengers({user, reject, resolve, isOuter: true})
      },
      handleUpdateUser (user) {
        let { selected } = user
        if (selected) {
          this.handleCheckItem(user)
        }
        this.$emit('modify', {user})
      },
      getIDName (id) {
        if (id === 1) {
          return '护照'
        } else if (id === 7) {
          return '身份证'
        } else if (id === 3) {
          return '台胞证'
        } else if (id === 4) {
          return '港澳通行证'
        }
      },
      pickID (documentId = '') {
        let userid = this.pickedUser.id
        this.pickPassengersID({userid, documentId})
        this.handleMulti(this.pickedUser)
        this.hideBackground()
      },
      hideBackground () {
        this.isShowIDPicker = !this.isShowIDPicker
      }
    }
  }
</script>
