<template>
  <div class="trip-picker-box">
    <div class="go-and-back">
      <template v-for="item in btns">
        <div :class="item.class" :key="item.class" @click="pickTrips({trip: item.mark})">
          <template v-if="selected === 'all'">
            <span class="active">
              <span>
                <img :src="checkActiveIcon">
              </span>
              {{item.label}}
            </span>
          </template>
          <template v-else>
            <template v-if="selected === item.mark">
              <span class="active">
                <span>
                  <img :src="checkActiveIcon">
                </span>
                {{item.label}}
              </span>
            </template>
            <template v-else>
              <span>
                <span>
                  <img :src="checkIcon">
                </span>
                {{item.label}}
              </span>
            </template>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import './less/style-pick.less'
  const checkIcon = require('./images/rectangle.svg')
  const checkActiveIcon = require('./images/rectangle-active.svg')
  export default {
    name: 'tripPicker',
    props: {
      user: {
        type: Object,
        default: {},
        require: false
      }
    },
    data () {
      return {
        checkIcon,
        checkActiveIcon,
        selected: 'all',
        btns: [{label: '去程', class: 'go-trip', mark: 'go'}, {label: '返程', class: 'back-trip', mark: 'back'}]
      }
    },
    computed: {
    },
    methods: {
      pickTrips (args) {
        let { user } = this.$props
        let { trip } = args
        if (this.selected === 'all') {
          if (trip === 'go') {
            this.selected = 'back'
          } else if (trip === 'back') {
            this.selected = 'go'
          }
        } else if (this.selected === 'go') {
          if (trip === 'go') {
            this.Toast({
              message: '去程和返程必选一程',
              position: 'bottom'
            })
            return false
            // this.selected = ''
          } else if (trip === 'back') {
            this.selected = 'all'
          }
        } else if (this.selected === 'back') {
          if (trip === 'go') {
            this.selected = 'all'
          } else if (trip === 'back') {
            this.Toast({
              message: '去程和返程必选一程',
              position: 'bottom'
            })
            return false
            // this.selected = ''
          }
        } else if (this.selected === '') {
          this.selected = trip
        }
        user['trip'] = this.selected
        this.$emit('pickTrip', user)
      }
    }
  }
</script>
