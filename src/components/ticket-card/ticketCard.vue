<template>
  <div class="ticket-card-container">
    <template v-if="trips === 'single'">
      <div class="single">
        <div class="title">
          <span class="date">{{ticket.bookingDate}}</span>
          <span class="week"> {{ticket.from_week}}</span>
        </div>
        <div class="line-through"></div>
        <div class="body">
          <div class="from-station">
            <strong>{{ticket.from_station_name}}</strong>
            <time>{{ticket.start_time}}</time>
            <span>{{seat}}</span>
          </div>
          <div class="to">
            <div class="train-no">{{ticket.train_code}}</div>
            <div class="time">
              <span>
                <ykb-icon :solo="true" type="useTimeWhite" :width="13" :height="13"></ykb-icon>
                <span>{{ticket.run_time_text}}</span>
              </span>
            </div>
          </div>
          <div class="to-station">
            <strong>{{ticket.to_station_name}}</strong>
            <time>{{ticket.arrive_time}}</time>
            <span class="price">&yen;{{price}}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="trips === 'double'">
      <div class="double">
        <div class="trip-box">
          <div class="go">
            <div class="top">
              <span>
                <img :src="goIcon">
              </span>
              <span>8月15日</span>
              <span>06:12</span>
              <span>去程</span>
              <span>D636</span>
            </div>
            <div class="bottom">
              <b>武汉 - 上海虹桥</b>
              <span class="seat-type">一等座 &yen; 262</span>
            </div>
          </div>
          <div class="line-through"></div>
          <div class="return">
            <div class="top">
              <span>
                <img :src="goIcon">
              </span>
              <span>8月15日</span>
              <span>06:12</span>
              <span>去程</span>
              <span>D636</span>
            </div>
            <div class="bottom">
              <b>上海虹桥 - 武汉</b>
              <span class="seat-type">一等座 &yen; 262</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import './less/style.less'
  const goIcon = require('./images/way-go.svg')
  const returnIcon = require('./images/way-back.svg')
  export default {
    name: 'ticketCard',
    props: {
      ticket: {
        type: Object,
        default: {},
        require: true
      },
      seat: {
        type: String,
        default: '',
        require: true
      },
      price: {
        type: Number,
        default: '',
        require: true
      },
      trips: {
        type: String,
        default: 'single', // double
        validator: (e) => {
          return e === 'single' || e === 'double'
        },
        require: false
      }
    },
    data () {
      return {
        goIcon,
        returnIcon
      }
    }
  }
</script>
