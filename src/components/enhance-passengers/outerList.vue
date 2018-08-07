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
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  const checkedIcon = require('./images/checked.svg')
  const uncheckedIcon = require('./images/unchecked.svg')
  const circleCheckedIcon = require('./images/circle-checked.svg')
  const circleUnCheckedIcon = require('./images/circle-unchecked.svg')
  const editIcon = require('./images/edit.svg')
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
        windowHeight: window.screen.availHeight - 214
      }
    },
    methods: {
      ...mapActions('company', ['updateSelectedOuterPassengers', 'switchPassenger']),
      handleCheckItem (user) {
        console.log(user)
        let { model } = this.$props
        if (model === 'single') {
          user['isOuter'] = true
          this.handleSingle(user)
        } else if (model === 'multi') {
          this.handleMulti(user)
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
      handleUpdateUser () {
        console.log('编辑人员')
      }
    }
  }
</script>
