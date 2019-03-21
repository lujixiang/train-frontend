<template>
  <div id="container">
    <div class="passengers-content">
      <div class="tab-passengers">
        <template v-for="tab in ['inner', 'outer']">
          <div :class="tab" @click="tabSwitch(tab)">
            <span :class="[activedTab === tab ? 'active' : '']">{{tab === 'inner' ? '内部同事' : '外部人员'}}</span>
          </div>
        </template>
      </div>
      <div class="tab-content">
        <passenger-v3 :model="activedTab"></passenger-v3>
      </div>
      <div class="tab-footer">
        <div class="choosed-passengers" @click="viewChoosedPassengers">
          <span class="label">已选(5):</span>
          <span class="value">
            <span class="names">
              张三、李四...
            </span>
            <span class="updown-icon">
              <img width="14" height="auto" :src="upOrDownIcon">
            </span>
          </span>
        </div>
        <div class="confirm-button">
          <mt-button type="primary">确定</mt-button>
        </div>
      </div>
      <mt-popup v-model="isPopupActive" class="popup-choosed-passengers" position="bottom">
        <ul class="choosed-user-list">
          <li>
            <div class="left" @click="deletePassenger()">
              <ykb-icon type="delete" :width="20" :height="20"></ykb-icon>
            </div>
            <div class="right">
              <div class="top">
                <span class="name">人名</span>
                <span class="phone-number">18701727828</span>
              </div>
              <div class="bottom">
                <span class="department">部门</span>
                <span class="position">职位</span>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <ykb-icon type="delete" :width="20" :height="20"></ykb-icon>
            </div>
            <div class="right">
              <div class="top">
                <span class="name">人名</span>
                <span class="phone-number">18701727828</span>
              </div>
              <div class="bottom">
                <span class="department">部门</span>
                <span class="position">职位</span>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <ykb-icon type="delete" :width="20" :height="20"></ykb-icon>
            </div>
            <div class="right">
              <div class="top">
                <span class="name">人名</span>
                <span class="phone-number">18701727828</span>
              </div>
              <div class="bottom">
                <span class="department">部门</span>
                <span class="position">职位</span>
              </div>
            </div>
          </li>
        </ul>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import './less/style.less'
  export default {
    name: 'passengers',
    data () {
      return {
        activedTab: 'inner',
        isPopupActive: false
      }
    },
    computed: {
      upOrDownIcon () {
        return require(`./images/icon-${this.isPopupActive ? 'down' : 'up'}.png`)
      }
    },
    methods: {
      ...mapActions('company', [
        'getCompanyUserList'
      ]),
      tabSwitch (a) {
        this.activedTab = a
      },
      viewChoosedPassengers () {
        this.isPopupActive = !this.isPopupActive
      },
      deletePassenger () {
        console.log('删除乘车人')
      }
    },
    created () {
      // console.log('开始发送请求')
      this.getCompanyUserList()
    }
  }
</script>
