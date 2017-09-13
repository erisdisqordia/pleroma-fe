import merge from 'lodash.merge'
import objectPath from 'object-path'
import localforage from 'localforage'
import { throttle, each } from 'lodash'

let loaded = false

const defaultReducer = (state, paths) => (
  paths.length === 0 ? state : paths.reduce((substate, path) => {
    objectPath.set(substate, path, objectPath.get(state, path))
    return substate
  }, {})
)

const defaultStorage = (() => {
  return localforage
})()

const defaultSetState = (key, state, storage) => {
  if (!loaded) {
    console.log('waiting for old state to be loaded...')
  } else {
    return storage.setItem(key, state)
  }
}

export default function createPersistedState ({
  key = 'vuex-lz',
  paths = [],
  getState = (key, storage) => {
    let value = storage.getItem(key)
    return value
  },
  setState = throttle(defaultSetState, 60000),
  reducer = defaultReducer,
  storage = defaultStorage,
  subscriber = store => handler => store.subscribe(handler)
} = {}) {
  return store => {
    getState(key, storage).then((savedState) => {
      try {
        if (typeof savedState === 'object') {
          // build user cache
          const usersState = savedState.users || {}
          usersState.usersObject = {}
          const users = usersState.users || []
          each(users, (user) => { usersState.usersObject[user.id] = user })
          savedState.users = usersState

          store.replaceState(
            merge({}, store.state, savedState)
          )
        }
        if (store.state.users.lastLoginName) {
          store.dispatch('loginUser', {username: store.state.users.lastLoginName, password: 'xxx'})
        }
        loaded = true
      } catch (e) {
        console.log("Couldn't load state")
        loaded = true
      }
    })

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
