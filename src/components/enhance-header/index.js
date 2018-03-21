import header from './header.vue'

header.install = (Vue) => {
  Vue.component('enhanceHeader', header)
}
export default header
