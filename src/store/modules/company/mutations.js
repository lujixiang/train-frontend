const key = require('./mutation-types')
const store = require('@/lib/localStorage')['default']
const sessionStore = require('@/lib/sessionStorage')['default']
const _ = require('lodash')
const g = require('@/definition/g')
const fun = require('@/lib/fun')
const immutable = require('immutable')
const mutations = {
  [key.ON_SEARCHING_NAME] (state, payload) {
    let { keyword } = payload
    // 如果输入的是中文
    if (fun.isChineseCharacters(keyword)) {
      _.forEach(state.USER_LIST, item => {
        if (item.userName.indexOf(keyword) > -1) {
          item.visiable = true
        } else {
          item.visiable = false
        }
      })
    } else {
      // 如果输入的是英文
      _.forEach(state.USER_LIST, item => {
        if (item.py && item.py.indexOf(keyword) > -1 || item.spy && item.spy.indexOf(keyword) > -1) {
          item.visiable = true
        } else {
          item.visiable = false
        }
      })
    }
  },
  [key.UPDATE_TRAVELER] (state, payload) {
    let { user, type } = payload
    /*
      [{userName: user.user_name, userSysId: user.user_sys_key, cellPhone: user.user_phone, IdNo: user.user_passportseno}]
    */
    if (type === 'update') {
      let userSysId = user.user_sys_key || user.user_key
      sessionStore.set('selected-passengers', [{userName: user.user_name, userSysId, cellPhone: user.user_phone, IdNo: user.user_passportseno}])
      sessionStore.set('traveler', user)
    } else if (type === 'delete') {
      sessionStore.clear('traveler')
      sessionStore.clear('selected-passengers')
    }
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
    let { resolve, reject } = payload
    let user = JSON.parse(sessionStore.get('auth-user'))
    if (!user || user && (user['user_name'] === '')) {
      reject({flagmsg: '登录过期，请重新登录'})
    } else {
      sessionStore.set('selected-passengers', [{userName: user.user_name, userSysId: user.user_sys_key, cellPhone: user.user_phone, IdNo: user.user_passportseno}])
      // sessionStore.set('auth-user', payload)
      resolve(user)
    }
  },
  [key.GET_TRAVELER] (state, payload) {
    let { resolve, reject } = payload
    let user = JSON.parse(sessionStore.get('traveler'))
    if (!user || user && (user['user_name'] === '' || user['user_phone'] === '')) {
      reject()
    } else {
      let userSysId = user.user_sys_key || user.user_key
      sessionStore.set('selected-passengers', [{userName: user.user_name, userSysId, cellPhone: user.user_phone, IdNo: user.user_passportseno}])
      resolve(user)
    }
  },
  [key.GET_USER_BY_TOKEN] (state, payload) {
    let { resolve, reject, res, token } = payload
    if (res.flagcode === '200') {
      state.currentUser = payload
      // 保存当前用户
      sessionStore.set('auth-user', {...res.user_info, token})
      resolve(res)
    } else {
      reject(res)
    }
  },
  [key.GET_STATION_CODE_BY_CITY_NAME] (state, payload) {
    let { res, resolve, reject } = payload
    if (res.flagcode === '200') {
      resolve(res)
    } else {
      reject(res)
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
    if (trainType === 'C' || trainType === 'G' || trainType === 'GD' || trainType === 'XGZ') {
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
  },
  // 新版出行人接口对接
  [key.GET_INSIDE_COMPANY_USER_LIST] (state, payload) {
    let { resolve, reject, res, cacheFirst } = payload
    let dataList = []
    let selected = JSON.parse(sessionStore.get('selected-passengers'))
    // 返回已选择出行人的userSystemId
    selected = _.map(selected, m => {
      if (!m['isOuter']) {
        return m.userSysId
      } else {
        return ''
      }
    })
    if (cacheFirst) {
      // 有缓存的情况下直接从缓存取值
      let companyuserlist = JSON.parse(sessionStore.get('companyuserlist'))
      let USER_LIST = JSON.parse(sessionStore.get('USER_LIST'))
      if (companyuserlist && !_.isEmpty(companyuserlist)) {
        state.companyuserlist = companyuserlist
        state.USER_LIST = USER_LIST
        _.forEach(companyuserlist, (value, key) => {
          _.forEach(value, p => {
            if (selected.indexOf(p.userSysId) > -1) {
              // 勾选已经选中的元素
              p['selected'] = true
            } else {
              p['selected'] = false
            }
          })
        })
        _.forEach(USER_LIST, (value, key) => {
          if (selected.indexOf(value.userSysId) > -1) {
            value['selected'] = true
          } else {
            value['selected'] = false
          }
        })
        resolve(companyuserlist)
      } else {
        reject({msg: '没有缓存数据'})
      }
      return false
    }
    try {
      dataList = res
      if (dataList && dataList.flagcode === '200') {
        let personnelList = immutable.List(dataList.data.personnelList)
        let alphabeta = {A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [], J: [], K: [], L: [], M: [], N: [], O: [], P: [], Q: [], R: [], S: [], T: [], U: [], V: [], W: [], X: [], Y: [], Z: []}
        personnelList.map(item => {
          if (_.isString(item['fullPinYin']) && (item['fullPinYin'] !== '')) {
            let b = item['fullPinYin'].substring(0, 1).toUpperCase()
            if (!alphabeta[b]) {
              alphabeta[b] = []
            }
            item['group'] = b
            item['visiable'] = true
            item['py'] = item['fullPinYin'].toUpperCase()
            item['spy'] = item['shortPinYin'].toUpperCase()
            item['tel'] = fun.encryptPhoneNo(item['cellPhone'])
            if (selected.indexOf(item['userSysId']) > -1) {
              item['selected'] = true
            } else {
              item['selected'] = false
            }
            // item['idcardno'] = fun.encryptIDNo(item['IdNo'])
            alphabeta[b].push(item)
          } else {
            // console.log('常用出行人', item)
            // alphabeta['常用出行人'].push(item)
          }
        })
        state.companyuserlist = alphabeta
        state.USER_LIST = personnelList.toJS()
        sessionStore.set('companyuserlist', alphabeta)
        sessionStore.set('USER_LIST', personnelList.toJS())
      } else {
        reject(dataList)
      }
      resolve(dataList)
    } catch (e) {
      console.log(e)
      reject({msg: '登录过期'})
    }
  },
  [key.GET_OUTSIDE_COMPANY_USER_LIST] (state, payload) {
    let { resolve, reject, res, cacheFirst } = payload
    let selected = JSON.parse(sessionStore.get('selected-passengers'))
    // 返回已选择出行人的userSystemId
    selected = _.map(selected, m => {
      if (m['isOuter']) {
        return m.id
      } else {
        return ''
      }
    })
    if (cacheFirst) {
      let companyOutsideUserList = JSON.parse(sessionStore.get('companyOutsideUserList'))
      if (companyOutsideUserList && !_.isEmpty(companyOutsideUserList)) {
        _.forEach(companyOutsideUserList, (value, key) => {
          if (selected.indexOf(value.id) > -1) {
            value['selected'] = true
          }
        })
        state.companyOutsideUserList = companyOutsideUserList
        resolve(companyOutsideUserList)
      } else {
        reject({msg: '没有缓存数据'})
      }
    } else {
      if (res.flagcode === '200') {
        state.companyOutsideUserList = res.data.outPersonnelList
        sessionStore.set('companyOutsideUserList', res.data.outPersonnelList)
        resolve(res.data.outPersonnelList)
      } else {
        reject(res)
      }
    }
  },
  [key.SEARCH_PASSENGERS_BY] (state, payload) {
    let userList = state.USER_LIST
    // matchedPassengers
    let matched = []
    let { keyword, type } = payload
    _.forEach(userList, p => {
      if (type === 'number') {
        if (p.cellPhone.indexOf(keyword) > -1) {
          matched.push(p)
        }
      } else if (type === 'english') {
        keyword = keyword.toUpperCase()
        if (p.fullPinYin && p.fullPinYin.toUpperCase().indexOf(keyword) > -1 || p.spy && p.spy.toUpperCase().indexOf(keyword) > -1) {
          matched.push(p)
        }
      } else {
        if (p.userName.indexOf(keyword) > -1) {
          matched.push(p)
        }
      }
    })
    state.matchedPassengers = matched
  },
  [key.GET_SELECTED_PASSENGERS] (state, payload) {
    let passengers = sessionStore.get('selected-passengers')
    if (passengers && passengers.length) {
      state.selectedPassengers = JSON.parse(passengers)
    } else {
      state.selectedPassengers = []
    }
  },
  [key.SWITCH_PASSENGER] (state, payload) {
    let { user } = payload
    if (user['isOuter']) {
      // 如果是外部人员
      let outList = immutable.List(state.companyOutsideUserList)
      outList.map(p => {
        if (p.id === user.id) {
          p['selected'] = true
          state.selectedPassengers = [user]
        } else {
          p['selected'] = false
        }
      })
      state.companyOutsideUserList = outList.toJS()
    } else {
      // 搜索列表渲染
      let matched = immutable.List(state.matchedPassengers)
      matched.every(p => {
        if (p.userSysId === user.userSysId) {
          p['selected'] = true
        } else {
          p['selected'] = false
        }
      })
      state.matchedPassengers = matched.toJS()
      // 默认列表渲染
      let userList = immutable.List(state.USER_LIST)
      userList.map(p => {
        if (p.userSysId === user.userSysId) {
          // 解决初始化的时候，根据token获取的入住人没有拼音，所以在第一次循环找到当前用户的时候就直接赋值过去
          user['group'] = p['group']
          p['selected'] = true
          state.selectedPassengers = [user]
        } else {
          p['selected'] = false
        }
      })
      state.USER_LIST = userList.toJS()
      // 按照拼音列表渲染
      // let companyuserlist = _.cloneDeep(state.companyuserlist)
      let companyuserlist = immutable.Map(state.companyuserlist)
      companyuserlist.map((list, group) => {
        if (list.length > 0) {
          _.forEach(list, p => {
            if (p.userSysId === user.userSysId) {
              p['selected'] = true
            } else {
              p['selected'] = false
            }
          })
        }
      })
      state.companyuserlist = companyuserlist.toJS()
    }
    sessionStore.set('selected-passengers', [user])
  },
  [key.UPDATE_SELECTED_PASSENGERS] (state, payload) {
    let { user, reject, init } = payload
    let count = 4
    let selectedPassengers = _.cloneDeep(state.selectedPassengers)
    let userList = _.cloneDeep(state.USER_LIST)
    let isReject = false
    if (init || count >= state.selectedPassengers.length || user['selected']) {
      if (init) {
        state.selectedPassengers = [user]
      }
    } else {
      reject({msg: '出行人不能超过5人'})
      return false
    }
    _.forEach(userList, p => {
      if (p.userSysId === user.userSysId) {
        // console.log(p)
        // 解决初始化的时候，根据token获取的入住人没有拼音，所以在第一次循环找到当前用户的时候就直接赋值过去
        user['group'] = p['group']
        if (p['selected']) {
          p['selected'] = false
          state.selectedPassengers = fun.deleteNodeFromArray(selectedPassengers, p, 'userSysId')
        } else {
          p['selected'] = true
          state.selectedPassengers = fun.pushNodeToArray(selectedPassengers, p, 'userSysId')
        }
      }
    })
    if (isReject) {
      // 添加人达到上限需要限制后续操作
      return false
    }
    state.USER_LIST = userList
    /* -------------------------出行人列表------------------------------ */
    let companyuserlist = _.cloneDeep(state.companyuserlist)
    let attr = user.group
    let filterList = companyuserlist[attr]
    _.forEach(filterList, p => {
      if (p.userSysId === user.userSysId) {
        if (p['selected']) {
          p['selected'] = false
          state.selectedPassengers = fun.deleteNodeFromArray(selectedPassengers, p, 'userSysId')
        } else {
          p['selected'] = true
          state.selectedPassengers = fun.pushNodeToArray(selectedPassengers, p, 'userSysId')
        }
      }
    })
    state.companyuserlist = companyuserlist
    let matched = immutable.List(state.matchedPassengers)
    matched.map(p => {
      if (p.userSysId === user.userSysId) {
        if (p['selected']) {
          p['selected'] = false
        } else {
          p['selected'] = true
        }
      }
    })
    state.matchedPassengers = matched.toJS()
    let l = _.cloneDeep(state.selectedPassengers)
    sessionStore.set('selected-passengers', l)
  },
  [key.UPDATE_SELECTED_OUTER_PASSENGERS] (state, payload) {
    let { user, resolve, reject } = payload
    let outerList = immutable.List(state.companyOutsideUserList)
    let selectedPassengers = immutable.List(state.selectedPassengers)
    let count = 4
    outerList.map(p => {
      if (p.id === user.id) {
        if (p['selected']) {
          // 从已选列表里面删除这个人
          p['selected'] = false
          state.selectedPassengers = fun.deleteNodeFromArray(selectedPassengers.toJS(), p, 'id')
        } else {
          if (count >= state.selectedPassengers.length) {
            resolve({msg: true})
          } else {
            reject({msg: '出行人不能超过5人'})
            return false
          }
          // 添加这个人到已选择列表
          p['selected'] = true
          p['isOuter'] = true
          state.selectedPassengers = fun.pushNodeToArray(selectedPassengers.toJS(), p, 'id')
        }
      }
    })
    let l = _.cloneDeep(state.selectedPassengers)
    sessionStore.set('selected-passengers', l)
    state.companyOutsideUserList = outerList.toJS()
  },
  [key.DELETE_SELECTED_PASSENGER] (state, payload) {
    let { user, clearAll, callback } = payload
    // 首先删除已选队列里面的
    let selectedPassengers = immutable.List(state.selectedPassengers).toJS()
    if (user['isOuter']) {
      let companyOutsideUserList = state.companyOutsideUserList
      _.forEach(companyOutsideUserList, (value, key) => {
        if (value.id === user.id) {
          value['selected'] = false
        }
      })
      _.remove(selectedPassengers, (item) => { return item.id === user.id })
      state.selectedPassengers = selectedPassengers
    } else {
      // 找到state里面的数据，并且更新状态为非选择状态
      let companyuserlist = state.companyuserlist
      _.forEach(companyuserlist, (value, key) => {
        _.forEach(value, p => {
          if (p.userSysId === user.userSysId) {
            p['selected'] = false
          }
        })
      })
      let USER_LIST = state.USER_LIST
      _.forEach(USER_LIST, (value, key) => {
        if (value.userSysId === user.userSysId) {
          value['selected'] = false
        }
      })
      let matched = state.matchedPassengers
      _.forEach(matched, (value, key) => {
        if (value.userSysId === user.userSysId) {
          value['selected'] = false
        }
      })
      state.companyuserlist = companyuserlist
      state.USER_LIST = USER_LIST
      state.matchedPassengers = matched
      _.remove(selectedPassengers, (item) => { return item.userSysId === user.userSysId })
      state.selectedPassengers = selectedPassengers
    }
    callback && typeof callback === 'function' && callback(user)
    sessionStore.set('selected-passengers', selectedPassengers)
    if (state.selectedPassengers.length === 0) {
      clearAll()
    }
  },
  [key.SAVE_OUTSIDE_COMPANY_USER] (state, payload) {
    let { resolve, reject, res } = payload
    if (res && res.flagcode === '200') {
      resolve(res)
    } else {
      reject(res)
    }
  },
  [key.DELETE_OUTER_USER] (state, payload) {
    let { resolve, reject, res } = payload
    if (res && res.flagcode === '200') {
      resolve(res)
    } else {
      reject(res)
    }
  },
  [key.PICK_PASSENGERS_ID] (state, payload) {
    let { userid, documentId } = payload
    let outerList = immutable.List(state.companyOutsideUserList)
    outerList.map(user => {
      if (user.id === userid) {
        user.documentInformationList.forEach(doc => {
          if (doc.documentId === documentId) {
            doc['checked'] = true
          } else {
            doc['checked'] = false
          }
        })
      }
    })
    state.companyOutsideUserList = outerList.toJS()
  }
}
export default mutations
