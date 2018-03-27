const key = '@TRAIN-'
const mt = {
  GET_TRAIN_LIST: `${key}/GET_TRAIN_LIST`, // 获取火车票列表
  CLEAR_TRAIN_LIST: `${key}/CLEAR_TRAIN_LIST`, // 清除火车票列表
  FILTER_TRAIN_LIST: `${key}/FILTER_TRAIN_LIST`, // 火车票列表页过滤
  GET_TRAIN_TIME_LIST: `${key}/GET_TRAIN_TIME_LIST`, // 获取火车票时间轴信息
  RECORD_SINGLE_TRAIN_INFO: `${key}/RECORD_TRAIN_INFO`, // 保存单个车次信息
  CLEAR_SINGLE_TRAIN_INFO: `${key}/CLEAR_SINGLE_TRAIN_INFO`, // 清除单个车次信息
  GET_SINGLE_TRAIN_INFO: `${key}/GET_SINGLE_TRAIN_INFO`, // 获取单个车次信息
  RECORD_SEAT_INFO: `${key}/RECORD_SEAT_INFO`, // 保存当前所选座位信息
  GET_SEAT_INFO: `${key}/GET_SEAT_INFO`, // 获取所选座位信息
  CLEAR_SEAT_INFO: `${key}/CLEAR_SEAT_INFO`, // 清除所选座位信息
  BOOKING_NOW: `${key}/BOOKING_NOW`, // 火车票预订
  BOOKING_TICKET_FOR_ROUND_TRIP: `${key}/BOOKING_TICKET_FOR_ROUND_TRIP`, // 创建往返火车票订单
  GET_STANDARD_TRAIN_LIST: `${key}/GET_STANDARD_TRAIN`, // 获取符合差旅标准的车次
  GET_ALL_TRAIN_LIST: `${key}/GET_ALL_TRAIN_LIST` // 获取所有的车次
}

module.exports = mt
