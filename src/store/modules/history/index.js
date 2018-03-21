import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'

const state = {
  historyRecord: [],
  selctedCityRecord: [],
  currentLocation: ''
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
