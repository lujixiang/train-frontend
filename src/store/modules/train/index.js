import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'

const state = {
  trainlist: {},
  traintimelist: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
