const Content = r => require.ensure([], () => r(require('@/plugins/train/layout/main')['default']), 'content')
const TrainList = r => require.ensure([], () => r(require('@/plugins/train/layout/train-list')['default']), 'trainlist')
const TrainListBack = r => require.ensure([], () => r(require('@/plugins/train/layout/train-list-back')['default']), 'trainlistback')
const TrainDetail = r => require.ensure([], () => r(require('@/plugins/train/layout/train-detail')['default']), 'traindetail')
const TrainDetailRoundTrip = r => require.ensure([], () => r(require('@/plugins/train/layout/train-detail-round-trip')['default']), 'traindetailroundtrip')
const trainOrder = r => require.ensure([], () => r(require('@/plugins/train/layout/train-order')['default']), 'trainorder')
// 双程下单页
const trainOrderRoundTrip = r => require.ensure([], () => r(require('@/plugins/train/layout/train-order-round-trip')['default']), 'trainorderroundtrip')
// 双程首页
const ContenRoundTrip = r => require.ensure([], () => r(require('@/plugins/train/layout/main-roundtrip')['default']), 'contentroundtrip')
const redirect = r => require.ensure([], () => r(require('@/plugins/train/layout/redirect')['default']), 'redirect')
const notFound = r => require.ensure([], () => r(require('@/plugins/train/layout/404')['default']), 'notfound')
const endorse = r => require.ensure([], () => r(require('@/plugins/train/layout/endorse')['default']), 'endorse')
const passengers = r => require.ensure([], () => r(require('@/plugins/train/layout/passengers')['default']), 'passengers')

const routes = [
  {
    path: '*',
    name: 'noPageWasFound',
    component: notFound
  },
  {
    path: '/',
    name: 'Content',
    component: Content,
    meta: {title: '火车票'}
  },
  {
    path: '/v2',
    name: 'ContentRoundTrip',
    component: ContenRoundTrip,
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
export default routes
