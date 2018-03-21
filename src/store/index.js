import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'
import history from './modules/history'
import train from './modules/train'
import company from './modules/company'
import order from './modules/order'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    GLOBAL_POPUP_LAYER: {
      ACTIVE: false,
      CALLBACK: _ => {}
    },
    // 夜间订票是否提示过的字段，false没有提示，true提示过
    IS_MIDNIGHT_NOTICED: false,
    // 当前是否是夜间，false不是夜间，true是夜间
    IS_MIDNIGHT: false
  },
  mutations: {
    ...mutations
  },
  actions,
  getters,
  modules: {
    history,
    train,
    company,
    order
  },
  strict: debug
})
