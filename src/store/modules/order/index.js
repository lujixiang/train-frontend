import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'

const state = {
  orderDetail: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
