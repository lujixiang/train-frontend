import Vue from 'vue'
import Router from 'vue-router'
// 测试页面，发布正式的时候需要去掉
// const test = r => require.ensure([], () => r(require('@/components/layout/__test__')['default']), '__test__')
const Content = r => require.ensure([], () => r(require('@/components/layout/main')['default']), 'content')
const TrainList = r => require.ensure([], () => r(require('@/components/layout/train-list')['default']), 'trainlist')
const TrainListBack = r => require.ensure([], () => r(require('@/components/layout/train-list-back')['default']), 'trainlistback')
const TrainDetail = r => require.ensure([], () => r(require('@/components/layout/train-detail')['default']), 'traindetail')
const TrainDetailRoundTrip = r => require.ensure([], () => r(require('@/components/layout/train-detail-round-trip')['default']), 'traindetailroundtrip')
const trainOrder = r => require.ensure([], () => r(require('@/components/layout/train-order')['default']), 'trainorder')
// 双程下单页
const trainOrderRoundTrip = r => require.ensure([], () => r(require('@/components/layout/train-order-round-trip')['default']), 'trainorderroundtrip')
const redirect = r => require.ensure([], () => r(require('@/components/layout/redirect')['default']), 'redirect')
const notFound = r => require.ensure([], () => r(require('@/components/layout/404')['default']), 'notfound')
const endorse = r => require.ensure([], () => r(require('@/components/layout/endorse')['default']), 'endorse')
const passengers = r => require.ensure([], () => r(require('@/components/layout/passengers')['default']), 'passengers')

Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '*',
      name: 'noPageWasFound',
      component: notFound
    },
    // {
    //   path: '/__test__',
    //   name: '__test__',
    //   component: test
    // },
    {
      path: '/',
      name: 'Content',
      component: Content,
      meta: {title: '火车票'}
    },
    {
      path: '/trainlist',
      name: 'TrainList',
      component: TrainList,
      meta: {title: '车次列表'}
    },
    {
      path: '/backtrainlist',
      name: 'BackTrainList',
      component: TrainListBack,
      meta: {title: '请选择返程'}
    },
    {
      path: '/traindetail',
      name: 'TrainDetail',
      component: TrainDetail,
      meta: {title: '选坐席'}
    },
    {
      path: '/traindetailRoundTrip',
      name: 'TrainDetailRoundTrip',
      component: TrainDetailRoundTrip,
      meta: {title: '选坐席'}
    },
    {
      path: '/trainorder',
      name: 'trainOrder',
      component: trainOrder,
      meta: {title: '火车票预订'}
    },
    {
      path: '/trainOrderRoundTrip',
      name: 'trainOrderRoundTrip',
      component: trainOrderRoundTrip,
      meta: {title: '火车票预订'}
    },
    {
      path: '/endorse',
      name: 'endorse',
      component: endorse,
      meta: {title: '火车票改签'}
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: redirect,
      meta: {title: '页面跳转中...'}
    },
    {
      path: '/passengers',
      name: 'passengers',
      component: passengers,
      meta: {title: '选择人员'}
    },
    {
      path: '/404',
      name: 'notFound',
      component: notFound,
      meta: {title: '没找到页面'}
    }
  ]
})
