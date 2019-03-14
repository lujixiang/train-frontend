<template>
  <div class="trips-tip-box">
    <span>
      <img width="16" :src="goIcon">
    </span>
    <span>{{moment(info.date).format('YYYY-MM-DD')}}</span>
    <span>{{info.from_station_name + ' - ' + info.to_station_name}}</span>
    <span>{{info.start_time + ' - ' + info.arrive_time}}</span>
  </div>
</template>

<script>
  import './less/style.less'
  const goIcon = require('./images/way-go.svg')
  const moment = require('moment')
  export default {
    name: 'tripTip',
    props: {
      info: {
        type: Object,
        default: _ => {
          return {}
        },
        require: true
      }
    },
    data () {
      return {
        goIcon,
        moment
      }
    }
  }
</script>
