const key = '@ORDER-'
const mt = {
  // 根据orderid获取订单详情
  GET_ORDER_DETAIL_BY_ORDER_ID: `${key}/GET_ORDER_DETAIL_BY_ORDER_ID`,
  // 火车票预订失败，重新预订价格变高需要走审批，取消订单
  CANCEL_ORDER_BY_ORDER_ID: `${key}/CANCEL_ORDER_BY_ORDER_ID`
}

module.exports = mt
