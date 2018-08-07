import passenger from './passenger.vue'

passenger.install = (Vue) => {
  Vue.component('enhancePassengers', passenger)
}
export default passenger
