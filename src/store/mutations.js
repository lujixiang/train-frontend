const key = require('./mutation-types')
const mutations = {
  [key.GLOBAL_POPUP_LAYER] (state, payload) {
    state.GLOBAL_POPUP_LAYER.ACTIVE = payload.isActive
    state.GLOBAL_POPUP_LAYER.CALLBACK = payload.This.onClose
  },
  [key.IS_MIDNIGHT_NOTICED] (state, payload) {
    state.IS_MIDNIGHT_NOTICED = payload.isActive
  },
  [key.IS_MIDNIGHT] (state, payload) {
    if (payload.isActive) {
      state.IS_MIDNIGHT = payload.isActive
    } else {
      state.IS_MIDNIGHT = payload.res.nightOrderFlag
      // 当不是夜间的时候需要直接订票不进行任何提示；当此时是夜间并且已经提示过后的时候也需要直接跳过去下订单
      if (!payload.res.nightOrderFlag || payload.res.nightOrderFlag && state.IS_MIDNIGHT_NOTICED) {
        payload.callback()
      }
    }
  }
}
export default mutations
