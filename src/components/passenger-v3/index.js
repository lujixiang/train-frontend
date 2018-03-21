import passengers from './passengers.vue'

passengers.install = (Vue) => {
  Vue.component('passengerV3', passengers)
}
export default passengers
