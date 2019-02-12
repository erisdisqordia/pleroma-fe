import { cloneDeep } from 'lodash'

import { defaultState, mutations, getters } from '../../../../src/modules/users.js'

describe('The users module', () => {
  describe('mutations', () => {
    it('adds new users to the set, merging in new information for old users', () => {
      const state = cloneDeep(defaultState)
      const user = { id: '1', name: 'Guy' }
      const modUser = { id: '1', name: 'Dude' }

      mutations.addNewUsers(state, [user])
      expect(state.users).to.have.length(1)
      expect(state.users).to.eql([user])

      mutations.addNewUsers(state, [modUser])
      expect(state.users).to.have.length(1)
      expect(state.users).to.eql([user])
      expect(state.users[0].name).to.eql('Dude')
    })

    it('sets a mute bit on users', () => {
      const state = cloneDeep(defaultState)
      const user = { id: '1', name: 'Guy' }

      mutations.addNewUsers(state, [user])
      mutations.setMuted(state, {user, muted: true})

      expect(user.muted).to.eql(true)

      mutations.setMuted(state, {user, muted: false})

      expect(user.muted).to.eql(false)
    })
  })

  describe('getUserByName', () => {
    it('returns user with matching screen_name', () => {
      const state = {
        users: [
          { screen_name: 'Guy', id: '1' }
        ]
      }
      const name = 'Guy'
      const expected = { screen_name: 'Guy', id: '1' }
      expect(getters.userByName(state)(name)).to.eql(expected)
    })

    it('returns user with matching screen_name with different case', () => {
      const state = {
        users: [
          { screen_name: 'guy', id: '1' }
        ]
      }
      const name = 'Guy'
      const expected = { screen_name: 'guy', id: '1' }
      expect(getters.userByName(state)(name)).to.eql(expected)
    })
  })

  describe('getUserById', () => {
    it('returns user with matching id', () => {
      const state = {
        users: [
          { screen_name: 'Guy', id: '1' }
        ]
      }
      const id = '1'
      const expected = { screen_name: 'Guy', id: '1' }
      expect(getters.userById(state)(id)).to.eql(expected)
    })
  })
})
