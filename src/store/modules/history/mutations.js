const key = require('./mutation-types')
// const history = require('@/lib/history')
const store = require('@/lib/localStorage')['default']
const history2 = require('@/lib/history-v2')
const _ = require('lodash')
const moment = require('moment')
const mutations = {
  [key.RECORD_SEARCH_HISTORY] (state, payload) {
    let k = payload['fromStation'] + payload['toStation']
    history2.save('search-history', {key: k, value: {fromCity: payload.fromCity, toCity: payload.toCity, fromStation: payload.fromStation, toStation: payload.toStation}})
    state.historyRecord = history2.get('search-history')
  },
  [key.GET_SEARCH_HISTORY] (state, payload) {
    state.historyRecord = history2.get('search-history')
    payload && typeof payload === 'function' && payload()
  },
  [key.RECORD_SELECTED_CITYS] (state, payload) {
    history2.save('selected-city', {key: payload[1], node: payload})
    state.selctedCityRecord = history2.get('selected-city')
  },
  [key.GET_SELECTED_CITYS] (state, payload) {
    state.selctedCityRecord = history2.get('selected-city')
    payload && typeof payload === 'function' && payload()
  },
  [key.GET_CURRENT_CITY] (state, payload) {
    let { res, errcallback } = payload
    if (res.flagcode === '200') {
      let data = res.data
      let city = [data['station_name'], res['station_pinyin'], data['station_simply_pinyin'], '', data['station_code'], data['station_number']]
      state.currentLocation = city
    } else {
      errcallback(res)
    }
  },
  [key.RECORD_ROUND_TRIP_INFO] (state, payload) {
    let { go, back, callback } = payload
    if (go !== '') {
      state.roundTripForGo = go
      store.set('train-info-go', go)
    }
    if (back !== '') {
      state.roundTripForBack = back
      store.set('train-info-back', back)
    }
    callback()
  },
  [key.RECORD_ROUND_TRIP_SEAT] (state, payload) {
    console.log(payload)
    store.set('selected-seat-round-trip', payload)
  },
  [key.GET_ROUND_TRIP_SEAT] (state, payload) {
    let result = JSON.parse(store.get('selected-seat-round-trip'))
    let { callback } = payload
    callback(result)
  },
  [key.GET_ROUND_TRIP_INFO] (state, payload) {
    let { callback } = payload
    let result = {}
    _.forEach(['go', 'back'], e => {
      let info = JSON.parse(store.get('train-info-' + e))
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
      let r = {
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
      result[e] = r
    })
    callback(result)
  },
  [key.GET_WECHAT_JSSIGN] (state, payload) {
    let { res, callback, errcallback } = payload
    if (res.flagcode === '200') {
      callback(JSON.parse(res.data))
    } else {
      errcallback(res.flagmsg)
    }
  }
}
export default mutations
