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

class Store {
  constructor (opt) {
    this._vm = new Vue({
      data: {
        state: opt.state
      }
    })

    let getters = opt.getters || {}
    this.getters = {}
    forEach(getters, (getterName, value) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return value(this.state)
        }
      })
    })

    let mutations = opt.mutations || {}
    this.mutations = {}
    forEach(mutations, (mutationsName, value) => {
      this.mutations[mutationsName] = payload => {
        value(this.state, payload)
      }
    })

    let actions = opt.actions || {}
    this.actions = {}
    forEach(actions, (actionName, value) => {
      this.actions[actionName] = (payload) => {
        value(this, payload)
      }
    })
  }

  dispatch = (type, payload) => {
    this.actions[type](payload)
  }

  commit = (type, payload) => {
    this.mutations[type](payload)
  }

  get state () {
    return this._vm.state
  }
}

export default {
  install,
  Store
}