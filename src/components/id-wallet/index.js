import wallet from './wallet.vue'

wallet.install = (Vue) => {
  Vue.component('idWallet', wallet)
}
export default wallet
