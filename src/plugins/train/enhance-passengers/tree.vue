<template>
  <div class="tree-view-content" ref="treeViewContent">
    <template v-if="data.length > 0">
      <template v-for="item in data">
        <tree-item :node="item"></tree-item>
      </template>
      <!-- <div class="tree-view-list">
        <div class="tree-department center-box">
          <span class="department-name text-left text-overflow">{{item.departmentName}}</span>
          <span class="count-passengers">({{item.userCounts}}人)</span>
          <span class="span-icon">
            <img width="16" :src="plusIcon">
          </span>
        </div>
        <div class="tree-expand center-box">
          <ul>
            <template v-for="person in item.personnelList">
              <li :key="person.userSysId">
                <div class="person-container">
                  <span class="check">
                    <img :src="uncheckedIcon">
                  </span>
                  <div class="user-info">
                    <div class="top text-left">
                      <span class="name">{{person.userName}}</span>
                      <span class="phone">{{person.cellPhone}}</span>
                    </div>
                    <div class="position">
                      <span class="dep">{{person.departmentName}}</span>
                      <span class="job">{{person.title}}</span>
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div> -->
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
  import './less/style.less'
  export default {
    name: 'treeView',
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        },
        require: false
      }
    },
    data () {
      return {}
    },
    mounted () {
      // this.$refs.treeViewContent.style.height = window.screen.availHeight - 214 + 'px'
    }
  }
</script>
