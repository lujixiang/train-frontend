<template>
  <div class="station-info-container">
    <div class="start">
      <div class="station">
        {{info.from_station_name}}
      </div>
      <div class="time">
        {{info.start_time}}
      </div>
      <div class="date">
        {{info.from_date}}
      </div>
    </div>
    <div class="train">
      <div class="time">{{info.run_time_text}}</div>
      <div class="list" @click="handleTimeListClick">经停信息</div>
      <div class="no">{{info.train_code}}</div>
    </div>
    <div class="end">
      <div class="station">
        {{info.to_station_name}}
      </div>
      <div class="time">
        {{info.arrive_time}}
      </div>
      <div class="date">
        {{info.to_date}}
      </div>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'stationInfo',
    props: {
      info: {
        type: Object,
        require: false,
        default: {}
      }
    },
    data () {
      return {

      }
    },
    methods: {
      handleTimeListClick () {
        this.$emit('onTimeListClick')
      }
    }
  }
</script>
