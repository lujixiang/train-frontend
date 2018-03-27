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
              <span>{{ticket.go.from_date}}</span>
              <span>{{ticket.go.arrive_time}}</span>
              <span>去程</span>
              <span>{{ticket.go.train_code}}</span>
            </div>
            <div class="bottom">
              <b>{{ticket.go.from_station_name + ' - ' + ticket.go.to_station_name}}</b>
              <span class="seat-type">{{seatObj.go}} &yen; {{priceObj.go}}</span>
            </div>
          </div>
          <div class="line-through"></div>
          <div class="return">
            <div class="top">
              <span>
                <img :src="returnIcon">
              </span>
              <span>{{ticket.back.from_date}}</span>
              <span>{{ticket.back.arrive_time}}</span>
              <span>返程</span>
              <span>{{ticket.back.train_code}}</span>
            </div>
            <div class="bottom">
              <b>{{ticket.back.from_station_name + ' - ' + ticket.back.to_station_name}}</b>
              <span class="seat-type">{{seatObj.back}} &yen; {{priceObj.back}}</span>
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
      seatObj: {
        type: Object,
        default: {},
        require: false
      },
      price: {
        type: Number,
        default: 0,
        require: true
      },
      priceObj: {
        type: Object,
        default: {},
        require: false
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
