const Base64 = require('js-base64')['Base64']
module.exports = {
  version: '20171116', // 发布版本需要加的缓存的版本
  Base64,
  filterBarText: { // 过滤条文案，可配置不要写死
    TIME_FROM_MORNING_TO_NIGHT: '出发早到晚',
    TIME_FROM_NIGHT_TO_MORNING: '出发晚到早',
    PRICE_FROM_LOW_TO_HIGH: '价格低到高',
    PRICE_FROM_HIGH_TO_LOW: '价格高到低',
    STANDARD: '合规车次',
    ALL: '所有车次'
  },
  standardText: { // 超标文案
    SEAT: {
      OUT_OF_STANDARD: '当前座席不符合您的差旅标准！',
      STANDARD: '符合差旅标准！'
    },
    TRAIN: {
      OUT_OF_STANDARD: '当前车次不符合您的差旅标准！'
    }
  },
  ENDORSE_TEXT: '改签/变更到站可能会产生一定的费用，具体费用将根据12306最新给出的退改政策执行。',
  ENDORSE_SUCCESS_TEXT: '已提交改签申请，成功后将在“我的订单”展示具体的车次信息。',
  REBOOKING_SUCCESS_TEXT: '已提交重新预订申请，成功后将在“我的订单”展示具体的车次信息。',
  NEED_APPROVAL_TEXT: '您当前的订单金额超过原订单的金额，需经过审批通过后完成订单。',
  seats: [
    {price: 'wz_price', label: '无座', left: 'wz_num', code: '1'},
    {price: 'yz_price', label: '硬座', left: 'yz_num', code: '1'},
    {price: 'rz_price', label: '软座', left: 'rz_num', code: '2'},
    {price: 'yw_price', label: '硬卧', left: 'yw_num', code: '3'},
    {price: 'edz_price', label: '二等座', left: 'edz_num', code: 'O'},
    {price: 'rwx_price', label: '软卧', left: 'rw_num', code: '4'},
    {price: 'dw_price', label: '动卧', left: 'dw_num', code: 'F'},
    {price: 'ydz_price', label: '一等座', left: 'ydz_num', code: 'M'},
    {price: 'swz_price', label: '商务座', left: 'swz_num', code: '9'},
    {price: 'tdz_price', label: '特等座', left: 'tdz_num', code: 'P'},
    {price: 'gjrw_price', label: '高级软卧', left: 'gjrw_num', code: '6'}
  ]
}
