const G = require('@/definition/g')
const getKey = key => {
  return G.Base64.encode(key)
}
class SessionStorage {
  constructor (prefix = 'ykb-mobile') {
    this._prefix = prefix
    this._version = G.version
    this._store = global.sessionStorage
  }
  set (key = '', val) {
    key = this._prefix + '@' + this._version + '@' + String(key)
    this._store.setItem(getKey(key), JSON.stringify(val))
  }
  get (key) {
    key = this._prefix + '@' + this._version + '@' + String(key)
    return this._store.getItem(getKey(key))
  }
  setEvery (keyArr, valArr) {
    for (let i = 0; i < keyArr.length; i++) {
      this.set(keyArr[i], valArr[i])
    }
  }
  clear (arr = [], isArryItem = false) {
    if (isArryItem) {
      for (let i = 0; i < arr.length; i++) {
        let key = this._prefix + '@' + this._version + '@' + String(arr[i])
        this._store.removeItem(getKey(key))
      }
    } else {
      this._store.removeItem(getKey(arr))
    }
  }
}
let store = new SessionStorage()
export default store
