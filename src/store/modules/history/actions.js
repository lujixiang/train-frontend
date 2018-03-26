const key = require('./mutation-types')
const http = require('@/lib/http')['default']
const api = require('@/lib/api')
export const recordSearchHistory = ({ commit }, args) => {
  commit(key.RECORD_SEARCH_HISTORY, args)
}
export const getSearchHistory = ({ commit }, args) => {
  commit(key.GET_SEARCH_HISTORY, args)
}
export const recordSelectedCitys = ({ commit }, args) => {
  commit(key.RECORD_SELECTED_CITYS, args)
}
export const getSelectedCitys = ({ commit }, args) => {
  commit(key.GET_SELECTED_CITYS, args)
}
export const getGDcity = ({ commit }, args) => {
  return http.post(api.getCurrentCity).then(res => {
    commit(key.GET_CURRENT_CITY, {...args, res})
  })
}
export const recordRoundTripInfo = ({ commit }, args) => {
  commit(key.RECORD_ROUND_TRIP_INFO, args)
}
export const getRoundTripInfo = ({ commit }, args) => {
  commit(key.GET_ROUND_TRIP_INFO, args)
}
export const recordRoundTripSeat = ({ commit }, args) => {
  commit(key.RECORD_ROUND_TRIP_SEAT, args)
}
export const getRoundTripSeat = ({ commit }, args) => {
  commit(key.GET_ROUND_TRIP_SEAT, args)
}
export const getWechatJSSign = ({ commit }, args) => {
  let { params, callback, errcallback } = args
  return http.post(api.getWechatJSSign, params).then(res => {
    commit(key.GET_WECHAT_JSSIGN, {callback, errcallback, res})
  })
}
