// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
// import router from './router'
import 'normalize.css/normalize.css'
import 'animate.css/animate.min.css'
import '@/less/base.less'
import store from './store'
const FastClick = require('fastclick')
FastClick.attach(document.body)
const sessionStore = require('@/lib/sessionStorage')['default']
const G = require('@/definition/g')
const PluginManager = require('@/definition/pluginManager')['default']
const pluginManager = new PluginManager(Vue, Router)
/*
  ----------------------------------------第三方UI库------------------------------------------
*/
import { Button, Cell, Checklist, Switch, Popup, Tabbar, TabItem, Header, IndexList, IndexSection, Indicator, Toast, MessageBox, Field, Picker, Spinner } from 'mint-ui'
Vue.component(Cell.name, Cell)
Vue.component(Button.name, Button)
Vue.component(Checklist.name, Checklist)
Vue.component(Switch.name, Switch)
Vue.component(Popup.name, Popup)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Header.name, Header)
Vue.component(IndexList.name, IndexList)
Vue.component(IndexSection.name, IndexSection)
Vue.component(Field.name, Field)
Vue.component(Picker.name, Picker)
Vue.component(Spinner.name, Spinner)
Vue.prototype.Indicator = Indicator
Vue.prototype.Toast = Toast
Vue.prototype.MessageBox = MessageBox

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': require('@/definition/locale/zh-CN.js'),
    en: require('@/definition/locale/en.js')
  }
})

import train from './plugins/train'
pluginManager.register(train)
pluginManager.install()
const router = pluginManager.getRouterInstance()

// 为iOS添加返回事件，防止出现空白页

Vue.prototype.IOSonBack = _ => {
  if (window.VueInstance) {
    if (window.VueInstance.$store.state.GLOBAL_POPUP_LAYER.ACTIVE) {
      window.VueInstance.$store.state.GLOBAL_POPUP_LAYER.CALLBACK()
      // 关闭弹窗
      return '_CLOSE_POPUP_LAYER_'
    } else {
      if (window.VueInstance._route && (window.VueInstance._route.path === '/' || window.VueInstance._route.path === '/v2')) {
        const companySettings = JSON.parse(sessionStore.get('company-settings')) || {}
        if (companySettings && companySettings.returnURL) {
          window.location.href = G.Base64.decode(companySettings.returnURL)
          // return G.Base64.decode(companySettings.returnURL)
        } else {
          return ''
        }
      } else {
        router ? router.back() : window.history.back()
        return '_RETURN_TO_WHERE_IT_COMES_FROM_'
      }
    }
  } else {
    return ''
  }
}

Vue.config.productionTip = false
/* eslint-disable no-new */

window.VueInstance = new Vue({
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
