<template>
  <div class="tree-item-content">
    <div class="tree-view-list">
      <div class="tree-department center-box">
        <span class="department-name text-left text-overflow">{{node.departmentName}}</span>
        <span class="count-passengers">({{node.userCounts}}人)</span>
        <span class="span-icon" @click="handleExpand">
          <img width="16" :src="expandIcon">
        </span>
      </div>
      <div class="tree-expand center-box" :class="isExpand ? '' : 'hide'">
        <ul>
          <template v-if="node.departmentModelList.length > 0">
            <!-- <li :key="node.id"> -->
            <tree-view :data="node.departmentModelList"></tree-view>
            <!-- </li> -->
          </template>
          <template v-for="person in node.personnelList">
            <li :key="person.userSysId">
              <div class="person-container">
                <span class="check" @click="handleCheckItem(person)">
                  <img :src="person.selected ? checkedIcon : uncheckedIcon">
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
    </div>
  </div>
</template>

<script>
  const checkedIcon = require('./images/checked.svg')
  const uncheckedIcon = require('./images/unchecked.svg')
  import { mapActions } from 'vuex'
  export default {
    name: 'treeItem',
    props: {
      node: {
        type: Object,
        default: () => {
          return {}
        },
        require: false
      }
    },
    computed: {
      expandIcon () {
        return this.isExpand ? require('./images/minus.svg') : require('./images/plus.svg')
      }
    },
    data () {
      return {
        checkedIcon,
        uncheckedIcon,
        isExpand: false
      }
    },
    methods: {
      ...mapActions('company', ['updateSelectedPassengers']),
      handleExpand () {
        this.isExpand = !this.isExpand
      },
      handleCheckItem (e) {
        const confirm = (e) => {
          // let { currentRoom, rooms } = this.$store.state.company
          // return rooms['room_' + currentRoom].length < 2
          return true
        }
        const reject = () => {
          this.Toast({
            message: '每个房间最多只能入住两人！',
            position: 'bottom'
          })
        }
        this.updateSelectedPassengers({user: e, confirm, reject})
      }
    }
  }
</script>
