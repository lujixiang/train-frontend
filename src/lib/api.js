module.exports = {
  // 获取用户所在城市
  getCurrentCity: '/ykb_train/user_location',
  // 获取火车票列表
  getTrainList: '/ykb_train/train_query',
  // 获取单个列车的信息
  getSingleTrainInfo: '/ykb_train/get_train_info',
  // 根据token获取当前用户信息
  getUserInfoByToken: '/ykb_train/get_user_info_by_token',
  // 创建本地订单,改签
  createTrainOrder: '/ykb_train/createdTrainOrder',
  // 根据token获取公司人员列表
  getCompanyUserList: '/ykb_train/get_company_staffs_by_token',
  // 根据城市名称获取火车站code
  getStationCodeByCityName: '/ykb_train/get_train_station_by_station_name',
  // 获取差旅标准
  getTravalStandard: '/ykb_train/user_business_trip_standard',
  // 根据orderid获取订单详情
  getOrderDetailByOrderID: '/ykb_train/get_train_order_by_id',
  // 根据orderid取消order
  cancelOrderByOrderID: '/ykb_train/orderBecomeInvalid',
  // 是否是12306停止服务时间
  isMidnight: '/ykb_train/nightOrder',
  // 获取企业微信js签名
  getWechatJSSign: '/ykb_train/wxApi'
}
