import trainOrder from './trainOrder.vue'

trainOrder.install = (Vue) => {
  Vue.component('trainOrderRoundTrip', trainOrder)
}

export default trainOrder
