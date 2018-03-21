const key = require('./mutation-types')
const http = require('@/lib/http')['default']
const api = require('@/lib/api')

export const getOrderDetailByOrderId = ({ commit }, opt) => {
  let { args } = opt
  return http.post(api.getOrderDetailByOrderID, args)
  .then(res => {
    commit(key.GET_ORDER_DETAIL_BY_ORDER_ID, {res, ...opt})
  })
}
export const cancelOrderByOrderId = ({ commit }, opt) => {
  let { args } = opt
  console.log(args)
  return http.post(api.cancelOrderByOrderID, args)
  .then(res => {
    commit(key.CANCEL_ORDER_BY_ORDER_ID, {res, ...opt})
  })
}
