<template>
  <div class="ykb-search-history">
    <template v-if="this.$store.state.history.historyRecord.length > 0">
      <h3 class="title">历史查询</h3>
      <ul>
        <template v-if="this.$store.state.history.historyRecord.length > this.$props.maxSize">
          <li :key="item.key" v-for="item in this.$store.state.history.historyRecord.slice(0, this.$props.maxSize)" @click.stop="handleRecordListClick($event, item.value)">
            {{item.value.fromCity}}
            -
            {{item.value.toCity}}
          </li>
        </template>
        <template v-else>
          <li :key="item.key" v-for="item in this.$store.state.history.historyRecord" @click.stop="handleRecordListClick($event, item.value)">
            {{item.value.fromCity}}
            -
            {{item.value.toCity}}
          </li>
        </template>
      </ul>
    </template>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  export default {
    name: 'searchHistory',
    data () {
      return {
        lastActiveNode: null
      }
    },
    props: {
      maxSize: {
        type: Number, // 这个参数是默认显示的历史记录的数目，默认最多显示10条历史记录
        default: 10,
        require: false
      }
    },
    methods: {
      ...mapActions('history', [
        'getSearchHistory'
      ]),
      handleRecordListClick (el, item) {
        if (!this.lastActiveNode) {
        } else {
          this.lastActiveNode.target.className = ''
        }
        this.lastActiveNode = el
        el.target.className = 'active'
        this.$emit('onHistroyRecordClick', item)
      }
    },
    mounted () {
      // 初始化的时候获取本地缓存修改state
      this.getSearchHistory(_ => {
        this.recordList = this.$store.state.history.historyRecord
      })
    }
  }
</script>
