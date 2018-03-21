import indexList from './indexList.vue'

indexList.install = (Vue) => {
  Vue.component('indexListSpa', indexList)
}

export default indexList
