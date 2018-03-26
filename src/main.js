// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css/normalize.css'
import 'animate.css/animate.min.css'
import '@/less/base.less'
import store from './store'
const FastClick = require('fastclick')
FastClick.attach(document.body)
const sessionStore = require('@/lib/sessionStorage')['default']
const G = require('@/definition/g')
/*
  ----------------------------------------第三方UI库------------------------------------------
*/
import { Button, Cell, Checklist, Switch, Popup, Tabbar, TabItem, Header, IndexList, IndexSection, Indicator, Toast, MessageBox, Field, Picker } from 'mint-ui'
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
Vue.prototype.Indicator = Indicator
Vue.prototype.Toast = Toast
Vue.prototype.MessageBox = MessageBox
/*
  ---------------------------------------自定义UI库----------------------------------------
*/
import ykbIcon from './components/icon'
Vue.use(ykbIcon)
import filterBar from './components/filter-bar'
Vue.use(filterBar)
import calendar from './components/calendar'
Vue.use(calendar)
import actionSheetHeader from './components/action-sheet-header'
Vue.use(actionSheetHeader)
import datePickerPreviousNext from './components/datepicker-next-previous'
Vue.use(datePickerPreviousNext)
import dateSelectCell from './components/date-select-cell'
Vue.use(dateSelectCell)
import citySelect from './components/city-station-cell'
Vue.use(citySelect)
import searchHistory from './components/search-history'
Vue.use(searchHistory)
import bottom from './components/bottom'
Vue.use(bottom)
import banner from './components/banner'
Vue.use(banner)
// 引入加强版的header
import enhanceHeader from '@/components/enhance-header'
Vue.use(enhanceHeader)
import indexList from '@/components/index-list'
Vue.use(indexList)
import NSR from './components/no-search-result'
Vue.use(NSR)
import passenger from './components/passenger'
Vue.use(passenger)
import passengerV2 from './components/passenger-v2'
Vue.use(passengerV2)
import addPassenger from './components/add-passenger'
Vue.use(addPassenger)
import passengerRoundTrip from './components/passenger-v2-round-trip'
Vue.use(passengerRoundTrip)
import ticketCard from './components/ticket-card'
Vue.use(ticketCard)
import orderNotice from '@/components/order-notice'
Vue.use(orderNotice)
import timeList from './components/time-list'
Vue.use(timeList)
import stationInfo from './components/station-info'
Vue.use(stationInfo)
import seating from './components/seating'
Vue.use(seating)
import cityPicker from './components/city-picker'
Vue.use(cityPicker)
import ykbCell from './components/cell'
Vue.use(ykbCell)
import search from './components/search'
Vue.use(search)
import noticeBar from './components/notice-bar'
Vue.use(noticeBar)
import keyboard from './components/keyboard'
Vue.use(keyboard)
import editId from './components/edit-id'
Vue.use(editId)
import onlineSeatSelection from './components/online-seat-selection'
Vue.use(onlineSeatSelection)
import onlineSeat from './components/online-seat'
Vue.use(onlineSeat)
import textAlert from './components/text-alert'
Vue.use(textAlert)
import tripCard from './components/trip-card'
Vue.use(tripCard)
import navBar from './components/nav-bar'
Vue.use(navBar)
import tripTip from './components/trip-tips'
Vue.use(tripTip)
import tripPicker from './components/trip-picker'
Vue.use(tripPicker)
// 为iOS添加返回事件，防止出现空白页

Vue.prototype.IOSonBack = _ => {
  if (window.VueInstance) {
    if (window.VueInstance.$store.state.GLOBAL_POPUP_LAYER.ACTIVE) {
      window.VueInstance.$store.state.GLOBAL_POPUP_LAYER.CALLBACK()
      // 关闭弹窗
      return '_CLOSE_POPUP_LAYER_'
    } else {
      if (window.VueInstance._route && window.VueInstance._route.path === '/') {
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
  store,
  router,
  render: h => h(App)
}).$mount('#app')
