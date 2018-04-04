<template>
  <div class="guid-instruction-content">
    <mt-popup v-model="$store.state.train.guidInstruction" popup-transition="popup-fade">
      <span @click="dontshowagain">
        <img :src="guidImage">
      </span>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  const guidImage = require('./images/guide-return-ticket.svg')
  export default {
    name: 'guidInstruction',
    data () {
      return {
        active: true,
        guidImage
      }
    },
    methods: {
      ...mapActions('train', [
        'guidInstruction'
      ]),
      dontshowagain () {
        this.guidInstruction({type: 'insert', guidePage: 'trainOrderRoundTrip'})
      }
    },
    created () {
      const errcallback = (err) => {
        this.Toast({
          message: err.flagmsg,
          position: 'bottom'
        })
      }
      this.guidInstruction({type: 'get', guidePage: 'trainOrderRoundTrip', errcallback})
    }
  }
</script>
