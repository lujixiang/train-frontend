class pluginManager {

  constructor (Vue, VueRouter) {
    this.__Vue = Vue
    this.__plugins = []
    this.__components = []
    this.__routers = []
    this.VueRouter = VueRouter
    this.installVueRouter()
  }

  installVueRouter () {
    this.getVueInstance().use(this.VueRouter)
  }

  register (plugin) {
    if (!plugin) {
      return false
    }
    this.__plugins.push(plugin)
    this.__components = [...plugin.components, ...this.__components]
    this.__routers = [...this.__routers, ...plugin.routes]
  }

  getVueInstance () {
    return this.__Vue
  }

  getRoutes () {
    return this.__routers
  }

  getComponents () {
    return this.__components
  }

  getRouterInstance () {
    let routes = this.getRoutes()
    return new this.VueRouter({routes})
  }

  install () {
    this.__components.map(component => {
      this.getVueInstance().use(component)
    })
  }
}

export default pluginManager
