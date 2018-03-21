const key = require('./mutation-types')
const _ = require('lodash')
// const store = require('@/lib/localStorage')['default']
const mutations = {
  [key.GET_ORDER_DETAIL_BY_ORDER_ID] (state, payload) {
    let { callback, errcallback, res, args } = payload
    // orderDetail
    if (res.flagcode === '200') {
      if (args.action === 'rebooking') {
        // 重新预订
      } else if (args.action === 'endorse') {
        _.forEach(res.train_passenger, p => {
          if (args.userkeys.indexOf(p.userkey) > -1) {
            // 如果是改签的乘客，则需要标记一下
            p['endorse'] = true
          } else {
            p['endorse'] = false
          }
        })
      }
      state.orderDetail = res
      callback(res)
    } else {
      errcallback(res)
    }
  },
  [key.CANCEL_ORDER_BY_ORDER_ID] (state, payload) {
    let { callback, errcallback, res } = payload
    console.log(res)
    if (res.flagcode === '200') {
      callback(res)
    } else {
      errcallback(res)
    }
  }
}
export default mutations
