const key = require('./mutation-types')
// const history = require('@/lib/history')
const history2 = require('@/lib/history-v2')
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
