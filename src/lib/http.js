const axios = require('axios')
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const qs = require('qs')
import { Toast } from 'mint-ui'
// const store = require('@/lib/localStorage')['default']
const sessionStore = require('@/lib/sessionStorage')['default']
/*
 more usage visit
 https://github.com/ljharb/qs
 可以参考https://segmentfault.com/q/1010000008698726/a-1020000008699952
 由于axios默认发送数据时是request payload，而并非我们常用的form data格式，所以发送之前需要使用qs模块对其进行处理
*/
const instance = axios.create({
  headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
})
let post = (url, params) => {
  let auth = {}
  if (params && params['token']) {
    auth['token'] = params['token']
  } else {
    auth = JSON.parse(sessionStore.get('auth-user'))
    if (!auth) {
      auth = {}
    }
  }
  return instance.post(url, qs.stringify({...params, token: auth.token}))
  .then(res => {
    if (res.status === 200) {
      return res.data
    }
  })
  .catch(e => {
    Toast({
      position: 'bottom',
      duration: 5000,
      message: '网络错误'
    })
  })
}
export default {
  post
}
