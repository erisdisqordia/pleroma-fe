import { remove, find } from 'lodash'

export const defaultState = {
  allLists: [],
  allListsObject: {}
}

export const mutations = {
  setLists (state, value) {
    state.allLists = value
  },
  setList (state, { id, title }) {
    if (!state.allListsObject[id]) {
      state.allListsObject[id] = {}
    }
    state.allListsObject[id].title = title

    if (!find(state.allLists, { id })) {
      state.allLists.push({ id, title })
    } else {
      find(state.allLists, { id }).title = title
    }
  },
  setListAccounts (state, { id, accountIds }) {
    if (!state.allListsObject[id]) {
      state.allListsObject[id] = {}
    }
    state.allListsObject[id].accountIds = accountIds
  },
  deleteList (state, { id }) {
    delete state.allListsObject[id]
    remove(state.allLists, list => list.id === id)
  }
}

const actions = {
  setLists ({ commit }, value) {
    commit('setLists', value)
  },
  createList ({ rootState, commit }, { title }) {
    return rootState.api.backendInteractor.createList({ title })
      .then((list) => {
        commit('setList', { id: list.id, title })
        return list
      })
  },
  fetchList ({ rootState, commit }, { id }) {
    return rootState.api.backendInteractor.getList({ id })
      .then((list) => commit('setList', { id: list.id, title: list.title }))
  },
  fetchListAccounts ({ rootState, commit }, { id }) {
    return rootState.api.backendInteractor.getListAccounts({ id })
      .then((accountIds) => commit('setListAccounts', { id, accountIds }))
  },
  setList ({ rootState, commit }, { id, title }) {
    rootState.api.backendInteractor.updateList({ id, title })
    commit('setList', { id, title })
  },
  setListAccounts ({ rootState, commit }, { id, accountIds }) {
    commit('setListAccounts', { id, accountIds })
    rootState.api.backendInteractor.addAccountsToList({ id, accountIds })
    rootState.api.backendInteractor.removeAccountsFromList({
      id,
      accountIds: rootState.lists.allListsObject[id].accountIds.filter(id => !accountIds.includes(id))
    })
  },
  deleteList ({ rootState, commit }, { id }) {
    rootState.api.backendInteractor.deleteList({ id })
    commit('deleteList', { id })
  }
}

export const getters = {
  findListTitle: state => id => {
    if (!state.allListsObject[id]) return
    return state.allListsObject[id].title
  },
  findListAccounts: state => id => {
    return state.allListsObject[id].accountIds
  }
}

const lists = {
  state: defaultState,
  mutations,
  actions,
  getters
}

export default lists
