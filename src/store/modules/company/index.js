import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'

const state = {
  companyuserlist: {},
  USER_LIST: [],
  currentUser: {},
  companySettings: {},
  travelStandard: {},
  travelStandardUnlimited: false,
  selectedPassengers: [],
  companyOutsideUserList: [],
  matchedPassengers: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
