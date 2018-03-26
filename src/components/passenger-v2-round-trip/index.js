import passenger from './passenger.vue'

passenger.install = (Vue) => {
  Vue.component('passengerRoundTrip', passenger)
}

export default passenger
