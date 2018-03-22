import navbar from './navbar.vue'

navbar.install = (Vue) => {
  Vue.component('navBar', navbar)
}
export default navbar
