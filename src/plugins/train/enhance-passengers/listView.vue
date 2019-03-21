<template>
  <div class="list-view-content">
    <template v-if="!lodash.isEmpty(data)">
      <mt-index-list :height="windowHeight">
        <template v-for="(value, key) in data">
          <mt-index-section v-if="value.length > 0" :index="key">
            <template v-for="item in value">
              <div class="user-list-item" @click="handleCheckItem(item)">
                <div class="person-container">
                  <span class="check">
                    <img v-if="model === 'multi'" :src="item.selected ? checkedIcon : uncheckedIcon">
                    <img v-if="model === 'single'" :src="item.selected ? circleCheckedIcon : circleUnCheckedIcon">
                  </span>
                  <div class="user-info">
                    <div class="top text-left">
                      <span class="name text-overflow">{{item.userName}}</span>
                      <span class="phone">{{item.tel}}</span>
                    </div>
                    <div class="position text-left">
                      <span class="dep text-overflow">{{item.departmentName}}</span>
                      <span class="job text-overflow">{{item.title}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </mt-index-section>
        </template>
      </mt-index-list>
    </template>
    <template v-else>
      <div class="loading-spinner">
        <span class="loading-text">努力加载中</span>
        <mt-spinner :size="40" color="#007aff" type="triple-bounce"></mt-spinner>
      </div>
    </template>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import './less/style.less'
  const checkedIcon = require('./images/checked.svg')
  const uncheckedIcon = require('./images/unchecked.svg')
  const circleCheckedIcon = require('./images/circle-checked.svg')
  const circleUnCheckedIcon = require('./images/circle-unchecked.svg')
  const _ = require('lodash')
  export default {
    name: 'ListView',
    props: {
      data: {
        type: Object,
        default: _ => {
          return {}
        },
        require: false
      },
      model: {
        type: String,
        default: 'multi',
        require: false
      }
    },
    data () {
      return {
        lodash: _,
        checkedIcon,
        uncheckedIcon,
        circleCheckedIcon,
        circleUnCheckedIcon,
        windowHeight: window.screen.availHeight - 174
      }
    },
    methods: {
      ...mapActions('company', ['updateSelectedPassengers', 'switchPassenger']),
      handleCheckItem (user) {
        let { model } = this.$props
        if (model === 'single') {
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
        this.updateSelectedPassengers({user, reject})
      }
    }
  }
</script>
