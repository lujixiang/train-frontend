import test from './__test__.vue'

test.install = (Vue) => {
  Vue.component('__test__', test)
}
export default test
