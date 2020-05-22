let Vue

const install = _Vue => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

const forEach = (obj, cb) => {
  Object.keys(obj).forEach(key => {
    cb(key, obj[key])
  })
}

class ModuleCollection {
  constructor(opt) {
    this.register([], opt)
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }
    if (path.length === 0) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((root, current) => {
        return root._children[current]
      }, this.root)
      parent._children[path[path.length-1]] = newModule
    }
    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

const installModule = (store, state, path, rootModule) => {
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((state, current) => {
      return state[current]
    }, state)
    Vue.set(parent, path[path.length - 1], rootModule.state)
  }

  let getters = rootModule._raw.getters
  if (getters) {
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return fn(rootModule.state)
        }
      })
    })
  }

  let mutations = rootModule._raw.mutations
  if (mutations) {
    forEach(mutations, (mutationsName, fn) => {
      let arr = store.mutations[mutationsName] || (store.mutations[mutationsName] = [])
      arr.push(payload => {
        fn.call(store, rootModule.state, payload)
      })
    })
  }

  let actions = rootModule._raw.actions
  if (actions) {
    forEach(actions, (actionsName, fn) => {
      let arr = store.actions[actionsName] || (store.actions[actionsName] = [])
      arr.push(payload => {
        fn.call(store, store, payload)
      })
    })
  }

  forEach(rootModule._children, (moduleName, module) => {
    installModule(store, store.state, path.concat(moduleName), module)
  })
}

class Store {
  constructor (opt) {
    this._vm = new Vue({
      data: {
        state: opt.state
      }
    })

    this.getters = {}
    this.mutations = {}
    this.actions = {}
    
    // let getters = opt.getters || {}
    // forEach(getters, (getterName, value) => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       return value(this.state)
    //     }
    //   })
    // })

    // let mutations = opt.mutations || {}
    // forEach(mutations, (mutationsName, value) => {
    //   this.mutations[mutationsName] = payload => {
    //     value.call(this, this.state, payload)
    //   }
    // })

    // let actions = opt.actions || {}
    // forEach(actions, (actionName, value) => {
    //   this.actions[actionName] = (payload) => {
    //     value.call(this, this, payload)
    //   }
    // })

    this.modules = new ModuleCollection(opt)
    installModule(this, this.state, [], this.modules.root)
  }

  dispatch = (type, payload) => {
    this.actions[type].forEach(fn => fn(payload))
  }

  commit = (type, payload) => {
    this.mutations[type].forEach(fn => fn(payload))
  }

  get state () {
    return this._vm.state
  }
}

export default {
  install,
  Store
}