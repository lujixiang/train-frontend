const key = require('./mutation-types')
const http = require('@/lib/http')['default']
const api = require('@/lib/api')
export const getTrainList = ({ commit }, opt) => {
  commit(key.CLEAR_TRAIN_LIST)
  let { args } = opt
  return http.post(api.getTrainList, args)
  .then(res => {
    commit(key.GET_TRAIN_LIST, {...opt, res})
  })
}
export const getAllTrainList = ({ commit }, args) => {
  commit(key.GET_ALL_TRAIN_LIST, args)
}
export const getStandardTrailList = ({ commit }, args) => {
  commit(key.GET_STANDARD_TRAIN_LIST, args)
}
export const getTrainTimeList = ({ commit }, opt) => {
  let { args } = opt
  args['train_date'] = args['date']
  return http.post(api.getSingleTrainInfo, args)
  .then(res => {
    commit(key.GET_TRAIN_TIME_LIST, {...opt, res})
  })
}
export const filterTrainList = ({ commit }, opt) => {
  // FILTER_TRAIN_LIST
  commit(key.FILTER_TRAIN_LIST, opt)
}
// 记录单个车次的列车信息
export const recordTrainIonfo = ({ commit }, args) => {
  commit(key.RECORD_SINGLE_TRAIN_INFO, args)
}
// 清除单个车次的列车信息
export const clearTrainInfo = ({ commit }, args) => {
  commit(key.CLEAR_SINGLE_TRAIN_INFO, args)
}
// 获取单个车次的列车信息
export const getTrainInfo = ({ commit }, args) => {
  commit(key.GET_SINGLE_TRAIN_INFO, args)
}
export const recordSeatInfo = ({ commit }, args) => {
  commit(key.RECORD_SEAT_INFO, args)
}
export const getSeatInfo = ({ commit }, args) => {
  commit(key.GET_SEAT_INFO, args)
}
// 火车票预订
export const bookingNow = ({ commit }, args) => {
  let { params } = args
  return http.post(api.createTrainOrder, params)
  .then(res => {
    commit(key.BOOKING_NOW, {...args, res})
  })
}
