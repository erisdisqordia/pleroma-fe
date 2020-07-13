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

    it('merging array field in new information for old users', () => {
      const state = cloneDeep(defaultState)
      const user = {
        id: '1',
        fields: [
          { name: 'Label 1', value: 'Content 1' }
        ]
      }
      const firstModUser = {
        id: '1',
        fields: [
          { name: 'Label 2', value: 'Content 2' },
          { name: 'Label 3', value: 'Content 3' }
        ]
      }
      const secondModUser = {
        id: '1',
        fields: [
          { name: 'Label 4', value: 'Content 4' }
        ]
      }

      mutations.addNewUsers(state, [user])
      expect(state.users[0].fields).to.have.length(1)
      expect(state.users[0].fields[0].name).to.eql('Label 1')

      mutations.addNewUsers(state, [firstModUser])
      expect(state.users[0].fields).to.have.length(2)
      expect(state.users[0].fields[0].name).to.eql('Label 2')
      expect(state.users[0].fields[1].name).to.eql('Label 3')

      mutations.addNewUsers(state, [secondModUser])
      expect(state.users[0].fields).to.have.length(1)
      expect(state.users[0].fields[0].name).to.eql('Label 4')
    })
  })

  describe('findUser', () => {
    it('returns user with matching screen_name', () => {
      const user = { screen_name: 'Guy', id: '1' }
      const state = {
        usersObject: {
          1: user,
          guy: user
        }
      }
      const name = 'Guy'
      const expected = { screen_name: 'Guy', id: '1' }
      expect(getters.findUser(state)(name)).to.eql(expected)
    })

    it('returns user with matching id', () => {
      const user = { screen_name: 'Guy', id: '1' }
      const state = {
        usersObject: {
          1: user,
          guy: user
        }
      }
      const id = '1'
      const expected = { screen_name: 'Guy', id: '1' }
      expect(getters.findUser(state)(id)).to.eql(expected)
    })
  })
})
