import passenger from './passenger.vue'

passenger.install = (Vue) => {
  Vue.component('passengerV2', passenger)
}

export default passenger
