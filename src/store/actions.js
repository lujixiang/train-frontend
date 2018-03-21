const key = require('./mutation-types')
const http = require('@/lib/http')['default']
const api = require('@/lib/api')
export const handleGlobalPopupLayer = ({ commit }, args) => {
  commit(key.GLOBAL_POPUP_LAYER, args)
}
export const handleMidnightNoticeStatus = ({ commit }, args) => {
  commit(key.IS_MIDNIGHT_NOTICED, args)
}
export const handleIsMidnight = ({ commit }, args) => {
  // commit(key.IS_MIDNIGHT, args)
  return http.post(api.isMidnight).then(res => {
    commit(key.IS_MIDNIGHT, {...args, res})
  })
}
