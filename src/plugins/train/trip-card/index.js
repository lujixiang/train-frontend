import trip from './trip.vue'

trip.install = (Vue) => {
  Vue.component('tripCard', trip)
}
export default trip
