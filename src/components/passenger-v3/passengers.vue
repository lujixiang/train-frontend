<template>
  <div class="passengers-v3-content">
    <div class="search-box">
      ddd
    </div>
    <div class="search-by" @click="searchBy">
      <div class="txt">
        <span>
          <img :src="groupIcon">
        </span>
        <span>{{this.searchByDep ? '按照部门查找' : '按照人员查找'}}</span>
      </div>
      <div class="entrance">
        <ykb-icon :width="12" :height="12" type="disclosureIndicator"></ykb-icon>
      </div>
    </div>
    <div class="passenger-list">
      <div :class="[searchByDep ? '' : 'hide']">按照部门查询</div>
      <div :class="[searchByDep ? 'hide' : '']">
        <mt-index-list>
          <template v-for="(value, key) in this.$store.state.company.companyuserlist">
            <mt-index-section v-if="value.length > 0" :index="key">
              <template v-for="item in value">
                <mt-cell>
                  <div class="index-list-cell">
                    <div class="left" @click="leftClick(item)">
                      <span class="checkbox">
                        <img :src="checkBoxIcon">
                      </span>
                    </div>
                    <div class="middle">
                      <div class="top">
                        <span class="name">{{item.Name}}</span>
                        <span class="phone-number">{{item.tel}}</span>
                      </div>
                      <div class="bottom">
                        <span class="department">{{item.DeptName}}</span>
                        <span class="position">职位</span>
                      </div>
                    </div>
                    <div class="right" @click="edit(item)">
                      <span>
                        <img :src="editIcon">
                      </span>
                    </div>
                  </div>
                </mt-cell>
              </template>
            </mt-index-section>
          </template>
        </mt-index-list>
      </div>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  const groupIcon = require('./images/group.svg')
  const checkBoxIcon = require('./images/check-box.svg')
  const checkBoxIconActive = require('./images/check-box-active.svg')
  const editIcon = require('./images/edit.svg')
  export default {
    name: 'passengerV3',
    props: {
      model: {
        type: String,
        default: 'inner',
        require: false,
        validator: (e) => {
          return e === 'inner' || e === 'outer'
        }
      }
    },
    data () {
      return {
        groupIcon,
        checkBoxIcon,
        checkBoxIconActive,
        editIcon,
        searchByDep: false
      }
    },
    methods: {
      leftClick (item) {
        console.log('左侧点击', item)
      },
      edit (item) {
        console.log('编辑', item)
      },
      searchBy () {
        this.searchByDep = !this.searchByDep
      }
    }
  }
</script>
