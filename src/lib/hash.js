
const hash = () => {
  const isInString = (str, match) => {
    if (str.indexOf('?') > -1) {
      str = str.split('?')[1]
    } else {
      return false
    }
    return str.indexOf(match) > -1
  }
  return {
    add (hash) {
      let _url = window.location.hash
      let Qindex = -1
      if (!isInString(_url, hash)) {
        Qindex = _url.indexOf('?')
        if (Qindex > -1) {
          hash = window.location.hash + '&' + hash
          window.location.hash = hash
        } else {
          window.location.hash = '?' + hash
        }
      }
    },
    remove (hash) {
      let str = window.location.hash
      let origin = ''
      if (str.indexOf('?') > -1) {
        origin = str.split('?')[0]
        str = str.split('?')[1]
        if (str.indexOf(hash) < 0) {
          return false
        }
      } else {
        return false
      }
      let hashArr = str.split('&')
      let hashIndex = hashArr.indexOf(hash)
      hashArr.splice(hashIndex, 1)
      window.location.hash = origin + '?' + hashArr.join('&')
    }
  }
}

module.exports = hash()
