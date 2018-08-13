const key = require('./mutation-types')
const http = require('@/lib/http')['default']
const api = require('@/lib/api')
const DEFAULT_ARGUMENTS = {callback: _ => {}, errcallback: _ => {}}
export const onSearchingByName = ({ commit }, args) => {
  commit(key.ON_SEARCHING_NAME, args)
}
export const saveCurrentUser = ({ commit }, args) => {
  commit(key.SAVE_CURRENT_USER, args)
}
export const getCurrentUser = ({ commit }, args) => {
  commit(key.GET_CURRENT_USER, args)
}
export const updateTraveler = ({ commit }, args) => {
  commit(key.UPDATE_TRAVELER, args)
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
// 新版出行人接口对接
export const getInsideCompanyUserList = ({ commit }, args) => {
  let { params, cacheFirst } = args
  if (cacheFirst) {
    commit(key.GET_INSIDE_COMPANY_USER_LIST, params)
  } else {
    return http.post(api.traveling.insideCompanyUserList, params)
    .then(res => {
      commit(key.GET_INSIDE_COMPANY_USER_LIST, {...args, res})
    })
  }
}
export const getOutsideCompanyUserList = ({ commit }, args) => {
  let { params, cacheFirst } = args
  if (cacheFirst) {
    commit(key.GET_OUTSIDE_COMPANY_USER_LIST, params)
  } else {
    return http.post(api.traveling.outsideCompanyUserList, params)
    .then(res => {
      commit(key.GET_OUTSIDE_COMPANY_USER_LIST, {...args, res})
    })
  }
}
export const searchPassengersBy = ({ commit }, args) => {
  commit(key.SEARCH_PASSENGERS_BY, args)
}
export const switchPassenger = ({ commit }, args) => {
  commit(key.SWITCH_PASSENGER, args)
}
export const getSelectedPassengers = ({ commit }, args) => {
  commit(key.GET_SELECTED_PASSENGERS, args)
}
export const updateSelectedPassengers = ({ commit }, args) => {
  commit(key.UPDATE_SELECTED_PASSENGERS, {...DEFAULT_ARGUMENTS, ...args})
}
export const updateSelectedOuterPassengers = ({ commit }, args) => {
  commit(key.UPDATE_SELECTED_OUTER_PASSENGERS, {...args})
}
export const deleteSelectedPassenger = ({ commit }, args) => {
  commit(key.DELETE_SELECTED_PASSENGER, args)
}
export const addOutsideUser = ({ commit }, args) => {
  let { params, cacheFirst } = args
  if (cacheFirst) {
    commit(key.SAVE_OUTSIDE_COMPANY_USER, {...args})
  } else {
    return http.post(api.traveling.addOutsideUser, params)
    .then(res => {
      commit(key.SAVE_OUTSIDE_COMPANY_USER, {...args, res})
    })
  }
}
export const deleteOuteUser = ({ commit }, args) => {
  let { params } = args
  return http.post(api.traveling.deleteOutsideUser, params)
  .then(res => {
    commit(key.DELETE_OUTER_USER, {...args, res})
  })
}
export const pickPassengersID = ({ commit }, args) => {
  commit(key.PICK_PASSENGERS_ID, args)
}
