// 检查给定字符串里面是否含有某个字符串，用于检验dom元素上是否含有某个className
export const hasClass = (str = '', target = '') => {
  str = str.split(' ')
  for (let i = 0; i < str.length; i++) {
    if (str[i] === target) {
      return true
    }
  }
  return false
}
export const functionCollection = (arr, args) => {
  let result = false
  if (arr.length === 0) {
    return true
  }
  arr.forEach(item => {
    if (item(args)) {
      result = true
    }
  })
  return result
}
export const checkID = (socialNo) => {
  if (socialNo === '') {
    return false
  }
  if (socialNo.length !== 15 && socialNo.length !== 18) {
    return false
  }
  let area = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
  if (area[parseInt(socialNo.substr(0, 2))] === null) {
    return false
  }
  if (socialNo.length === 15) {
    let pattern = /^\d{15}$/
    if (pattern.exec(socialNo) === null) {
      return false
    }
    let birth = parseInt('19' + socialNo.substr(6, 2))
    let month = socialNo.substr(8, 2)
    let day = parseInt(socialNo.substr(10, 2))
    switch (month) {
      case '01':
      case '03':
      case '05':
      case '07':
      case '08':
      case '10':
      case '12':
        if (day > 31) {
          return false
        }
        break
      case '04':
      case '06':
      case '09':
      case '11':
        if (day > 30) {
          return false
        }
        break
      case '02':
        if ((birth % 4 === 0 && birth % 100 !== 0) || birth % 400 === 0) {
          if (day > 29) {
            return false
          }
        } else {
          if (day > 28) {
            return false
          }
        }
        break
      default:
        return false
    }
    let nowYear = new Date().getYear()
    if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
      return false
    }
    return true
  }
  let Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]
  let lSum = 0
  let nNum = 0
  for (let i = 0; i < 17; ++i) {
    if (socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9') {
      return false
    } else {
      nNum = socialNo.charAt(i) - '0'
    }
    lSum += nNum * Wi[i]
  }
  if (socialNo.charAt(17) === 'X' || socialNo.charAt(17) === 'x') {
    lSum += 10 * Wi[17]
  } else if (socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9') {
    return false
  } else {
    lSum += (socialNo.charAt(17) - '0') * Wi[17]
  }
  if ((lSum % 11) === 1) {
    return true
  } else {
    return false
  }
}
// 身份证号码中间加星
export const encryptIDNo = (idno) => {
  var reg = /x$/i
  if (reg.test(idno)) {
    // 如果末尾是X
    return idno.replace(/^(\d{4})(\d+)(\d{3})(\D{1})$/, '$1**********$3$4')
  } else {
    return idno.replace(/^(\d{4})(\d+)(\d{4})$/, '$1**********$3')
  }
}
// 手机号码中间加星
export const encryptPhoneNo = (no) => {
  return no.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}
// 判断是否是微信
export const isWechat = _ => {
  let ua = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
  return ua && ua[0] === 'micromessenger'
}
// 判断是否是企业微信
export const isWechatWork = _ => {
  let ua = window.navigator.userAgent.toLowerCase().match(/wxwork/i)
  return ua && ua[0] === 'wxwork'
}
// 判断手机号码是否符合手机号规则
export const checkMobile = (mobile) => {
  // 简单校验手机号码，只保证第一位是1，并且长度是11位
  let reg = /^1\d{10}$/
  return reg.test(mobile)
}
// 判断输入的是否是中文汉字
export const isChineseCharacters = (str) => {
  return /^[\u4e00-\u9fa5]+$/i.test(str)
}
// 判断输入的是否是数字
export const isNumber = (num) => {
  num = parseInt(num)
  return /^\d{1,}$/i.test(num)
}
// 校验是否是拼音
export const isPinyin = (str) => {
  return /^[a-zA-Z]+$/.test(str)
}
// 校验出生年月日，格式YYYYMMDD,例如19950308
export const isValidateBirthday = (date) => {
  return /^\d{8}$/.test(date)
}
export const deleteNodeFromArray = (arr, node, key) => {
  arr.forEach((e, i) => {
    if (e && e.length) {
      e.forEach((o, j) => {
        if (o[key] === node[key]) {
          e.splice(j, 1)
          if (e.length === 0) {
            arr.splice(i, 1)
          }
        }
      })
    } else {
      // 如果不是数组的情况直接删除
      if (e[key] === node[key]) {
        arr.splice(i, 1)
      }
    }
  })
  return arr
}
export const pushNodeToArray = (arr, node, key) => {
  let exists = false
  arr.forEach((e, i) => {
    if (node[key] === e[key]) {
      exists = true
    }
  })
  if (!exists) {
    arr.push(node)
  }
  return arr
}
export const getIOSversion = () => {
  let agent = navigator.userAgent.toLowerCase()
  let version = ''
  if (agent.indexOf('like mac os x') > 0) {
    let regStr = /os [\d.]*/gi
    let info = agent.match(regStr)
    version = (info + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
    let versionStr = version + ''
    if (versionStr !== 'undefined' && versionStr.length > 0) {
      return version
    } else {
      return 8
    }
  } else {
    return 9
  }
}
export const idTypeTranslate = (id) => {
  /* 后台的数据库返回 : 1: '护照', 7: '身份证', 3: '台胞证', 5: '港澳通行证' */
  /* 真实传给供应商的参数： '1': 二代身份证，'C'：港澳通行证, 'G': 台湾通行证，'B'： 护照 */
  if (id === 1) {
    return 'B'
  } else if (id === 7) {
    return '1'
  } else if (id === 3) {
    return 'G'
  } else if (id === 5) {
    return 'C'
  }
}
export const freeStyleLog = () => {
  console && console.log('%c', 'margin: 30px; padding:30px 120px;background: url("https://www.51ykb.com/Content/themes/default/images/Logon/logo_anti.svg") no-repeat;')
  console && console.log(`%c 云快报出品 %c 小样我就知道你进来偷看人家代码 - Just be free %c`, 'background:#35495e ; font-size: 20px; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#17abcb ; padding: 1px; border-radius: 0 3px 3px 0; font-size: 20px;  color: #fff', 'background:transparent')
}
