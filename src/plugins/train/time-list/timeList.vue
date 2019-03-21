<template>
  <div class="ykb-time-list">
    <mt-popup v-model="isActive" position="bottom" :closeOnClickModal="false">
      <section class="list-container">
        <div class="list-header">
          <span>{{this.$props.title}}</span>
        </div>
        <div class="list-title">
          <span v-for="title in this.$props.tableTitle">{{title}}</span>
        </div>
        <div class="list-data">
          <div class="data-contain">
            <template v-if="this.$store.state.train.traintimelist && this.$store.state.train.traintimelist[info.train_code + info.train_no]">
              <template v-for="item in this.$store.state.train.traintimelist[info.train_code + info.train_no]">
                <div class="station" :class="item.mark ? 'active' : ''">
                  <span>{{item.station_no}}</span>
                  <span>{{item.station_name}}</span>
                  <span>{{item.arrive_time}}</span>
                  <span>{{item.start_time}}</span>
                  <span>{{item.stopover_time}}</span>
                </div>
              </template>
            </template>
          </div>
        </div>
        <div class="list-bottom">
          <ykb-icon :onclick="closePopup" type="cancel"></ykb-icon>
        </div>
      </section>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  export default {
    name: 'TimeList',
    props: {
      isActive: {
        type: Boolean,
        default: false,
        require: false
      },
      title: {
        type: String,
        default: '列表',
        require: false
      },
      tableTitle: {
        type: Array,
        default: [],
        require: true
      },
      info: {
        type: Object,
        default: _ => {
          return {}
        },
        require: false
      },
      fromStation: {
        type: String,
        default: '',
        require: false
      },
      toStation: {
        type: String,
        default: '',
        require: false
      }
    },
    data () {
      return {
        isAjaxSend: false
      }
    },
    methods: {
      ...mapActions('train', [
        'getTrainTimeList'
      ]),
      closePopup () {
        this.Indicator.close()
        this.$emit('onClose')
      },
      requestTrainTimeList () {
        this.Indicator.open({
          text: '用户校验中...',
          spinnerType: 'fading-circle'
        })
        let args = this.$route.query
        let callback = res => {
          this.Indicator.close()
        } // res是返回的数据
        let errcallback = e => {
          this.Toast({
            message: e.flagmsg,
            position: 'bottom',
            duration: 5000
          })
        }
        args['fs'] = this.$props.fromStation
        args['ts'] = this.$props.toStation
        this.getTrainTimeList({args, callback, errcallback})
      }
    },
    beforeUpdate () {
      let key = this.$props.info.train_code + this.$props.info.train_no
      if (this.$store.state.train.traintimelist && this.$store.state.train.traintimelist[key]) {
      } else {
        if (this.$props.isActive && !this.isAjaxSend) {
          // 防止多次触发
          this.isAjaxSend = !this.isAjaxSend
          // 防止过滤的时候触发请求，只有在展开的时候才能让他触发请求
          this.requestTrainTimeList()
        }
      }
    }
  }
</script>
