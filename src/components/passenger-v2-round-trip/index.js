import passenger from '../passenger-v2/passengerV2Roundtrip.vue'

passenger.install = (Vue) => {
  Vue.component('passengerRoundTrip', passenger)
}

export default passenger
