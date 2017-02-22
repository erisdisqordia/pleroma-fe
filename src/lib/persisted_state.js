import merge from 'lodash.merge'
import objectPath from 'object-path'
import { throttle } from 'lodash'
import { inflate, deflate } from 'pako'

const defaultReducer = (state, paths) => (
  paths.length === 0 ? state : paths.reduce((substate, path) => {
    objectPath.set(substate, path, objectPath.get(state, path))
    return substate
  }, {})
)

const defaultStorage = (() => {
  const hasLocalStorage = typeof window !== 'undefined' && window.localStorage
  if (hasLocalStorage) {
    return window.localStorage
  }

  class InternalStorage {
    setItem (key, item) {
      this[key] = item
      return item
    }
    getItem (key) {
      return this[key]
    }
    removeItem (key) {
      delete this[key]
    }
    clear () {
      Object.keys(this).forEach(key => delete this[key])
    }
  }

  return new InternalStorage()
})()

const defaultSetState = (key, state, storage) => {
  return storage.setItem(key, deflate(JSON.stringify(state), { to: 'string' }))
}

export default function createPersistedState ({
  key = 'vuex',
  paths = [],
  getState = (key, storage) => {
    let value = storage.getItem(key)
    try {
      value = inflate(value, { to: 'string' })
    } catch (e) {
      console.log("Couldn't inflate value... Maybe upgrading")
    }
    return value && value !== 'undefined' ? JSON.parse(value) : undefined
  },
  setState = throttle(defaultSetState, 60000),
  reducer = defaultReducer,
  storage = defaultStorage,
  subscriber = store => handler => store.subscribe(handler)
} = {}) {
  return store => {
    const savedState = getState(key, storage)
    if (typeof savedState === 'object') {
      store.replaceState(
        merge({}, store.state, savedState)
      )
    }

    subscriber(store)((mutation, state) => {
      try {
        setState(key, reducer(state, paths), storage)
      } catch (e) {
        console.log("Couldn't persist state:")
        console.log(e)
      }
    })
  }
}
