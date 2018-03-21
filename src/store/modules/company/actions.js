const key = require('./mutation-types')
const http = require('@/lib/http')['default']
const api = require('@/lib/api')
const DEFAULT_ARGUMENTS = {callback: _ => {}, errcallback: _ => {}}
export const getCompanyUserList = ({ commit }, args) => {
  return http.post(api.getCompanyUserList).then(res => {
    commit(key.GET_COMPANY_USER_LIST, {...args, res})
  })
}
export const onSearchingByName = ({ commit }, args) => {
  commit(key.ON_SEARCHING_NAME, args)
}
export const saveCurrentUser = ({ commit }, args) => {
  commit(key.SAVE_CURRENT_USER, args)
}
export const getCurrentUser = ({ commit }, args) => {
  commit(key.GET_CURRENT_USER, args)
}
export const saveTraveler = ({ commit }, args) => {
  commit(key.SAVE_TRAVELER, args)
}
export const getTraveler = ({ commit }, args) => {
  commit(key.GET_TRAVELER, args)
}
export const saveCompanySettings = ({ commit }, args) => {
  commit(key.SAVE_COMPANY_SETTINGS, args)
}
export const getCompanySettings = ({ commit }, args) => {
  commit(key.GET_COMPANY_SETTINGS, {...DEFAULT_ARGUMENTS, ...args})
}
export const getUserByToken = ({ commit }, args) => {
  let { token } = args
  return http.post(api.getUserInfoByToken, {token})
  .then(res => {
    commit(key.GET_USER_BY_TOKEN, {...args, res})
  })
}
export const getStationCodeByCityName = ({ commit }, args) => {
  let { params } = args
  return http.post(api.getStationCodeByCityName, params)
  .then(res => {
    commit(key.GET_STATION_CODE_BY_CITY_NAME, {...args, res})
  })
}
export const saveTravelStandard = ({ commit }, args) => {
  commit(key.SAVE_TRAVEL_STANARD, args)
}
export const getTravelStandard = ({ commit }, args) => {
  let { params } = args
  return http.post(api.getTravalStandard, params)
  .then(res => {
    commit(key.GET_TRAVEL_STANDARD, {...args, res})
  })
}
export const getLocalStandard = ({ commit }, args) => {
  commit(key.GET_LOCAL_STANDARD, args)
}
export const isStandardSeat = ({ commit }, args) => {
  commit(key.IS_STANDARD_SEAT, {...DEFAULT_ARGUMENTS, ...args})
}
export const clearDataFromLocalStorage = ({ commit }, args) => {
  commit(key.CLEAR_DATA_FROM_STORAGE, args)
}
