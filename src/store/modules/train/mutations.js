const key = require('./mutation-types')
const _ = require('lodash')
const store = require('@/lib/localStorage')['default']
const moment = require('moment')
const fun = require('@/lib/fun')
const g = require('@/definition/g')
const f = g.filterBarText
const mutations = {
  [key.GET_TRAIN_LIST] (state, payload) {
    let { res, args, callback, errcallback } = payload
    if (res && res.flagcode === '200') {
      _.forEach(res.data, item => {
        if (item['train_type'] === 'D') {
          item['binary'] = 2
        } else if (item['train_type'] === 'G') {
          item['binary'] = 4
        } else {
          item['binary'] = 1
        }
        if (args['train_type'] === '0' || args['train_type'] === 0) {
          // 全部车次
          item['visiable'] = true
        } else if (args['train_type'] === '1' || args['train_type'] === 1) {
          // 只看高铁
          if (item['train_type'] === 'D' || item['train_type'] === 'G') {
            item['visiable'] = true
          } else {
            item['visiable'] = false
          }
        }
        item['run_time_sort'] = parseInt(item['run_time'].replace(':', ''))
        item['start_time_sort'] = parseInt(item['start_time'].replace(':', ''))
        item['arrive_time_sort'] = parseInt(item['arrive_time'].replace(':', ''))
        let hm = item['run_time'].split(':')
        if (hm[0] === '00') {
          item['run_time_text'] = hm[1] + '分'
        } else {
          item['run_time_text'] = item['run_time'].replace(':', '时') + '分'
        }
      })
      state.trainlist = res.data
      callback(res)
    } else {
      res ? errcallback(res) : 1
    }
  },
  [key.GET_ALL_TRAIN_LIST] (state, payload) {
    let cloneTrainList = _.cloneDeep(state.trainlist)
    _.forEach(cloneTrainList, item => {
      item['visiable'] = true
    })
    state.trainlist = cloneTrainList
  },
  [key.GET_STANDARD_TRAIN_LIST] (state, payload) {
    /*
      高铁 动车 其他
      1    0    0
      0    1    0
      0    0    1
    */
    let standard = JSON.parse(store.get('travel-standard'))
    if (!standard) {
      return false
    }
    let cloneTrainList = _.cloneDeep(state.trainlist)
    _.forEach(cloneTrainList, item => {
      if ((item['binary'] & standard.trainTypeBinary) !== 0) {
        item['visiable'] = true
      } else {
        item['visiable'] = false
      }
    })
    state.trainlist = cloneTrainList
  },
  [key.CLEAR_TRAIN_LIST] (state, payload) {
    state.trainlist = []
  },
  [key.FILTER_TRAIN_LIST] (state, payload) {
    let { type, isStandard, value } = payload
    let cloneTrainList = _.cloneDeep(state.trainlist)
    if (type === 'time') {
      let positive = 1
      if (payload.value === f.TIME_FROM_MORNING_TO_NIGHT) {
        positive = 1
      } else if (payload.value === f.TIME_FROM_NIGHT_TO_MORNING) {
        positive = -1
      }
      state.trainlist = _.sortBy(cloneTrainList, item => { return positive * item.start_time_sort })
    } else if (type === 'price') {
      let positive = 1
      if (payload.value === f.PRICE_FROM_LOW_TO_HIGH) {
        positive = 1
      } else if (payload.value === f.PRICE_FROM_HIGH_TO_LOW) {
        positive = -1
      }
      state.trainlist = _.sortBy(cloneTrainList, item => { return positive * item.price })
    } else if (type === 'filter') {
      // 多条件组合过滤
      let departureConditionCollection = []
      let traintypeConditionCollection = []
      let arrivalConditionCollection = []
      _.forEach(value, (value, key) => {
        if (value.type === 'departure') {
          // 出发时间过滤
          _.forEach(value.list, el => {
            if (el.className === 'active') {
              let s = parseInt(el.value.split('-')[0])
              let b = parseInt(el.value.split('-')[1])
              departureConditionCollection.push(item => {
                return item.start_time_sort >= s && item.start_time_sort <= b
              })
            }
          })
        } else if (value.type === 'train-type') {
          // 火车类型过滤
          _.forEach(value.list, el => {
            if (el.className === 'active') {
              if (el.value === 'g') {
                traintypeConditionCollection.push(item => {
                  return item.train_type === 'G'
                })
              } else if (el.value === 'k') {
                traintypeConditionCollection.push(item => {
                  return item.train_type === 'K' || item.train_type === 'Z' || item.train_type === 'T' || item.train_type === '1'
                })
              } else if (el.value === 'd') {
                traintypeConditionCollection.push(item => {
                  return item.train_type === 'D'
                })
              }
            }
          })
        } else if (value.type === 'arrival') {
          // 到达时间过滤
          _.forEach(value.list, el => {
            if (el.className === 'active') {
              let s = parseInt(el.value.split('-')[0])
              let b = parseInt(el.value.split('-')[1])
              arrivalConditionCollection.push(item => {
                return item.arrive_time_sort >= s && item.arrive_time_sort <= b
              })
            }
          })
        }
      })
      state.trainlist = _.forEach(cloneTrainList, item => {
        if (fun.functionCollection(departureConditionCollection, item) && fun.functionCollection(arrivalConditionCollection, item) && fun.functionCollection(traintypeConditionCollection, item)) {
          item['visiable'] = true
          if (isStandard) {
            // 如果是在合规的情况下做筛选，则需要进行位运算
            let standard = JSON.parse(store.get('travel-standard')) || {trainTypeBinary: 0}
            if ((item['binary'] & standard.trainTypeBinary) === 0) {
              item['visiable'] = false
            }
          }
        } else {
          item['visiable'] = false
        }
      })
    }
  },
  [key.GET_TRAIN_TIME_LIST] (state, payload) {
    let { res, args, callback, errcallback } = payload
    if (res.flagcode === '200') {
      let index = []
      _.forEach(res.data, item => {
        if (item.station_name === args.fs || item.station_name === args.ts) {
          item['mark'] = true
          item['during'] = false
          index.push(parseInt(item.station_no))
        } else {
          if (index.length === 1 && parseInt(item.station_no) > index[0]) {
            item['during'] = true
          } else if (index.length === 2 && parseInt(item.station_no) < index[1]) {
            item['during'] = true
          }
          item['mark'] = false
        }
      })
      // state.traintimelist = res.data
      let key = args.train_code + args.train_no
      let obj = _.cloneDeep(state.traintimelist)
      obj[key] = res.data
      state.traintimelist = obj
      // state.traintimelist[key] = res.data
      callback(res)
    } else {
      errcallback(res)
    }
  },
  [key.RECORD_SINGLE_TRAIN_INFO] (state, payload) {
    let {callback, info} = payload
    store.set('train-info', info)
    callback && callback()
  },
  [key.CLEAR_SINGLE_TRAIN_INFO] (state, payload) {

  },
  [key.GET_SINGLE_TRAIN_INFO] (state, payload) {
    let { callback, args } = payload
    let info = null
    if (args.ajax) {
      info = args.data
    } else {
      info = JSON.parse(store.get('train-info'))
    }
    let {
      from_station_name,
      to_station_name,
      start_time,
      arrive_time,
      train_code,
      run_time_text,
      run_time,
      date
    } = info
    let hm = run_time.split(':')
    let fromDate = moment(date).format('MM月DD日')
    let toDate = moment(date).add(hm[0], 'hour').add(hm[1], 'minute')
    let fromWeek = moment(date).format('dddd')
    let toWeek = toDate.format('dddd')
    toDate = toDate.format('MM月DD日')
    let result = {
      from_station_name,
      to_station_name,
      start_time,
      arrive_time,
      train_code,
      run_time_text,
      date,
      to_date: toDate,
      from_date: fromDate,
      from_week: fromWeek,
      to_week: toWeek,
      info: info
    }
    callback(result)
  },
  [key.RECORD_SEAT_INFO] (state, payload) {
    store.set('selected-seat', payload)
  },
  [key.GET_SEAT_INFO] (state, payload) {
    let result = JSON.parse(store.get('selected-seat'))
    let { callback } = payload
    callback(result)
  },
  [key.BOOKING_NOW] (state, payload) {
    let { callback, errcallback, res } = payload
    if (res.flagcode === '200') {
      callback(res)
    } else {
      errcallback(res)
    }
  },
  [key.BOOKING_TICKET_FOR_ROUND_TRIP] (state, payload) {
    let { callback, errcallback, res } = payload
    if (res.flagcode === '200') {
      callback(res)
    } else {
      errcallback(res)
    }
  }
}
export default mutations
