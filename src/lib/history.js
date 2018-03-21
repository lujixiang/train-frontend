import store from './localStorage'
let historyState = []
// 保存历史记录
export const save = (key, value) => {
  if (hasRecord(key, value)) {
    historyState = get(key)
    if (historyState.length > 1) {
      let index = getRecordIndex(key, value, historyState)
      historyState.splice(index, 1)
      historyState.unshift(value)
      store.set(key, historyState)
    }
  } else {
    // 如果没有存储历史，则存入
    historyState = get(key)
    historyState.unshift(value)
    store.set(key, historyState)
  }
}
// 获取历史记录
export const get = key => {
  if (isExists(key)) {
    return JSON.parse(getStorage(key))
  } else {
    return []
  }
}
// 获取storage
const getStorage = (key) => {
  return store.get(key)
}
// 检查是否有存到localStorage里面
const isExists = (key) => {
  return getStorage(key) && getStorage(key).length > 0
}
// 在存之前检查某条单个记录是否存在
const hasRecord = (key, record) => {
  let recordList = get(key)
  for (let i = 0; i < recordList.length; i++) {
    let item = recordList[i]
    if (item['fromCity'] === record['fromCity'] && item['toCity'] === record['toCity']) {
      return true
    }
  }
  return false
}
// 获取单条记录所在数组中的位置
const getRecordIndex = (key, record, recordList) => {
  for (let i = 0; i < recordList.length; i++) {
    let item = recordList[i]
    if (item['fromCity'] === record['fromCity'] && item['toCity'] === record['toCity']) {
      return i
    }
  }
  return -1
}
