<template>
  <div class="nav-bar-container">
    <div class="tab-box">
      <span v-for="item in tab" :key="item.key" :class="selectedTab === item.key ? 'active' : ''" @click="switchTab(item)">{{item.value}}</span>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'navBar',
    data () {
      return {
        tab: [{key: 'single', value: '单程'}, {key: 'double', value: '往返'}],
        selectedTab: 'single'
      }
    },
    methods: {
      switchTab (e) {
        this.selectedTab = e.key
        this.$emit('tabSwitch', e)
      }
    }
  }
</script>
