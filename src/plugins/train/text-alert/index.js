import alert from './alert.vue'

alert.install = (Vue) => {
  Vue.component('textAlert', alert)
}
export default alert
