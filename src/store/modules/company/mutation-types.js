const key = '@COMPANY-'
const mt = {
  GET_COMPANY_USER_LIST: `${key}/GET_COMPANY_USER_LIST`, // 获取公司人员列表
  ON_SEARCHING_NAME: `${key}/ON_SEARCHING_NAME`,
  SAVE_CURRENT_USER: `${key}/SAVE_CURRENT_USER`, // 保存当前用户到localStorage里面
  GET_CURRENT_USER: `${key}/GET_CURRENT_USER`, // 获取当前缓存的用户
  SAVE_TRAVELER: `${key}/SAVE_TRAVELER`, // 保存首页切换的出差人员的信息到localStorage里面
  GET_TRAVELER: `${key}/GET_TRAVELER`, // 获取出差人员的信息
  GET_USER_BY_TOKEN: `${key}/GET_USER_BY_TOKEN`, // 根据token获取当前用户
  SAVE_COMPANY_SETTINGS: `${key}/SAVE_COMPANY_SETTINGS`, // 设置公司配置
  GET_COMPANY_SETTINGS: `${key}/GET_COMPANY_SETTINGS`, // 获取公司配置
  GET_STATION_CODE_BY_CITY_NAME: `${key}/GET_STATION_CODE_BY_CITY_NAME`, // 根据城市名称获取城市火车站code
  SAVE_TRAVEL_STANARD: `${key}/SAVE_TRAVEL_STANARD`, // 保存差旅标准
  GET_TRAVEL_STANDARD: `${key}/GET_TRAVEL_STANDARD`, // 获取差旅标准
  GET_LOCAL_STANDARD: `${key}/GET_LOCAL_STANDARD`, // 获取本地保存的差旅标准
  IS_STANDARD_SEAT: `${key}/IS_STANDARD_SEAT`, // 检验是否是合规的车座
  CLEAR_DATA_FROM_STORAGE: `${key}/CLEAR_DATA_FROM_STORAGE` // 清除localStorage里面的部分数据
}

module.exports = mt
