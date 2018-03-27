const key = require('./mutation-types')
const store = require('@/lib/localStorage')['default']
const sessionStore = require('@/lib/sessionStorage')['default']
const _ = require('lodash')
const g = require('@/definition/g')
const fun = require('@/lib/fun')
const mutations = {
  [key.GET_COMPANY_USER_LIST] (state, payload) {
    let { res, callback, errcallback } = payload
    if (res && res.flagcode === '200') {
      let alphabeta = {}
      let userList = res.user_list
      _.forEach(userList, item => {
        let b = item['FullPinYin'].substring(0, 1).toUpperCase()
        if (!alphabeta[b]) {
          alphabeta[b] = []
        }
        item['group'] = b
        item['visiable'] = true
        item['py'] = item['FullPinYin'].toUpperCase()
        item['spy'] = item['ShortPinYin'].toUpperCase()
        item['tel'] = fun.encryptPhoneNo(item['CellPhone'])
        item['idcardno'] = fun.encryptIDNo(item['IdNo'])
        alphabeta[b].push(item)
      })
      let copyUserList = _.cloneDeep(userList) // 这里一定要深拷贝一份数据，不然后面搜索会很惊喜
      state.companyuserlist = alphabeta
      state.USER_LIST = copyUserList
      callback(res)
    } else {
      errcallback(res)
    }
  },
  [key.ON_SEARCHING_NAME] (state, payload) {
    let { keyword } = payload
    // 如果输入的是中文
    if (fun.isChineseCharacters(keyword)) {
      _.forEach(state.USER_LIST, item => {
        if (item.Name.indexOf(keyword) > -1) {
          item.visiable = true
        } else {
          item.visiable = false
        }
      })
    } else {
      // 如果输入的是英文
      _.forEach(state.USER_LIST, item => {
        if (item.py.indexOf(keyword) > -1 || item.spy.indexOf(keyword) > -1) {
          item.visiable = true
        } else {
          item.visiable = false
        }
      })
    }
  },
  [key.SAVE_CURRENT_USER] (state, payload) {
    sessionStore.set('auth-user', payload)
    // store.set('auth-user', payload)
  },
  [key.SAVE_TRAVELER] (state, payload) {
    store.set('traveler', payload)
  },
  [key.SAVE_COMPANY_SETTINGS] (state, payload) {
    sessionStore.set('company-settings', payload)
    state.companySettings = payload
  },
  [key.GET_COMPANY_SETTINGS] (state, payload) {
    let { errcallback, callback } = payload
    let settings = JSON.parse(sessionStore.get('company-settings'))
    state.companySettings = settings
    if (settings) {
      callback && typeof callback === 'function' && callback(settings)
    } else {
      errcallback && typeof errcallback === 'function' && errcallback(settings)
    }
  },
  [key.GET_CURRENT_USER] (state, payload) {
    let { errcallback, callback } = payload
    let user = JSON.parse(sessionStore.get('auth-user'))
    if (!user || user && (user['user_name'] === '')) {
      errcallback({flagmsg: '登录过期，请重新登录'})
    } else {
      callback(user)
    }
  },
  [key.GET_TRAVELER] (state, payload) {
    let { callback, errcallback } = payload
    let user = JSON.parse(store.get('traveler'))
    if (!user || user && (user['user_name'] === '' || user['user_phone'] === '')) {
      errcallback()
    } else {
      callback(user)
    }
  },
  [key.GET_USER_BY_TOKEN] (state, payload) {
    let { callback, errcallback, res } = payload
    if (res.flagcode === '200') {
      state.currentUser = payload
      callback(res)
    } else {
      errcallback(res)
    }
  },
  [key.GET_STATION_CODE_BY_CITY_NAME] (state, payload) {
    let { res, callback, errcallback } = payload
    if (res.flagcode === '200') {
      callback(res)
    } else {
      errcallback(res)
    }
  },
  [key.SAVE_TRAVEL_STANARD] (state, payload) {
    let standard = {}
    let trainTypeBinary = 0
    _.forEach(payload, item => {
      if (item['traintype'] === 'G') {
        trainTypeBinary += 4
      } else if (item['traintype'] === 'D') {
        trainTypeBinary += 2
      } else {
        trainTypeBinary += 1
      }
    })
    if (trainTypeBinary === 0) {
      trainTypeBinary = 7
    }
    standard['trainTypeBinary'] = trainTypeBinary
    standard['list'] = payload
    store.set('travel-standard', standard)
    state.travelStandard = standard
  },
  [key.GET_LOCAL_STANDARD] (state, payload) {
    let { callback } = payload
    let standard = JSON.parse(store.get('travel-standard'))
    callback(standard)
  },
  [key.GET_TRAVEL_STANDARD] (state, payload) {
    let { res, callback, errcallback } = payload
    if (res.flagcode === '200') {
      state.travelStandardUnlimited = res.standard === 'unlimited'
      callback(res.data)
    } else {
      errcallback(res)
    }
  },
  [key.IS_STANDARD_SEAT] (state, payload) {
    let { trainType, label, callback } = payload
    let trainTypeLabel
    if (trainType === 'C' || trainType === 'G') {
      // 高铁标准
      trainType = 'G'
      trainTypeLabel = '高铁'
    } else if (trainType === 'D') {
      // 动车标准
      trainType = 'D'
      trainTypeLabel = '动车'
    } else {
      // 其他车次标准
      trainTypeLabel = '其他'
      trainType = 'O'
    }
    let standard = JSON.parse(store.get('travel-standard')) || {list: []}
    let seats = []
    let hasStandard = false
    _.forEach(standard.list, item => {
      if (item.traintype === trainType) {
        // 找到对应的合规车次
        hasStandard = true
        if (item.seattype.indexOf(';') > -1) {
          seats = item.seattype.split(';')
          if (seats.indexOf(label) > -1) {
            // 找到对应的车次，并找到该车次下符合标准的座席
            callback({isStandard: true, detail: g.standardText.SEAT.STANDARD})
          } else {
            // 找到对应的车次，但是没有找到对应车次的座席
            let detail = trainTypeLabel + label + '不符合您的差旅标准'
            callback({isStandard: false, detail})
          }
        } else {
          if (item.seattype === '') {
            callback({isStandard: false, detail: g.standardText.SEAT.OUT_OF_STANDARD})
          } else {
            seats = item.seattype
            if (seats === label) {
              callback({isStandard: true, detail: g.standardText.SEAT.STANDARD})
            } else {
              let detail = trainTypeLabel + label + '不符合您的差旅标准'
              callback({isStandard: false, detail})
            }
          }
        }
      }
    })
    if (!hasStandard) {
      // 没有找到对应的车次，也没有找到对应的座席
      callback({isStandard: false, detail: g.standardText.TRAIN.OUT_OF_STANDARD})
    }
  },
  [key.CLEAR_DATA_FROM_STORAGE] (state, payload) {
    // 清除storage里面的数据
    store.clear(payload, true)
  }
}
export default mutations
