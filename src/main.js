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
/*
  ---------------------------------------自定义UI库----------------------------------------
*/
import ykbIcon from './components/icon'
import filterBar from './components/filter-bar'
import calendar from './components/calendar'
import actionSheetHeader from './components/action-sheet-header'
import datePickerPreviousNext from './components/datepicker-next-previous'
import dateSelectCell from './components/date-select-cell'
import citySelect from './components/city-station-cell'
import searchHistory from './components/search-history'
import bottom from './components/bottom'
import banner from './components/banner'
// 引入加强版的header
import enhanceHeader from '@/components/enhance-header'
import indexList from '@/components/index-list'
import NSR from './components/no-search-result'
import passengerV2 from './components/passenger-v2'
import passengerRoundTrip from './components/passenger-v2-round-trip'
import ticketCard from './components/ticket-card'
import orderNotice from '@/components/order-notice'
import timeList from './components/time-list'
import stationInfo from './components/station-info'
import seating from './components/seating'
import cityPicker from './components/city-picker'
import ykbCell from './components/cell'
import search from './components/search'
import noticeBar from './components/notice-bar'
import keyboard from './components/keyboard'
import editId from './components/edit-id'
import onlineSeatSelection from './components/online-seat-selection'
import onlineSeat from './components/online-seat'
import textAlert from './components/text-alert'
import tripCard from './components/trip-card'
import navBar from './components/nav-bar'
import tripTip from './components/trip-tips'
import tripPicker from './components/trip-picker'
import guidInstruction from './components/guid-instruction'
import enhancePassengers from './components/enhance-passengers'
import idWallet from './components/id-wallet'
import idCard from './components/id-card'
import idModify from './components/id-modify'
import listView from './components/list-view'
import outerList from './components/outer-list'
const components = [
  ykbIcon,
  filterBar,
  calendar,
  actionSheetHeader,
  datePickerPreviousNext,
  dateSelectCell,
  citySelect,
  searchHistory,
  bottom,
  banner,
  enhanceHeader,
  indexList,
  NSR,
  passengerV2,
  passengerRoundTrip,
  ticketCard,
  orderNotice,
  timeList,
  stationInfo,
  seating,
  cityPicker,
  ykbCell,
  search,
  noticeBar,
  keyboard,
  editId,
  onlineSeatSelection,
  onlineSeat,
  textAlert,
  tripCard,
  navBar,
  tripTip,
  tripPicker,
  guidInstruction,
  enhancePassengers,
  idWallet,
  idCard,
  idModify,
  listView,
  outerList
]
components.map(_components => {
  Vue.use(_components)
})
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
  store,
  router,
  render: h => h(App)
}).$mount('#app')
