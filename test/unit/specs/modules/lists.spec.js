import { cloneDeep } from 'lodash'
import { defaultState, mutations, getters } from '../../../../src/modules/lists.js'

describe('The lists module', () => {
  describe('mutations', () => {
    it('updates array of all lists', () => {
      const state = cloneDeep(defaultState)
      const list = { id: '1', title: 'testList' }

      mutations.setLists(state, [list])
      expect(state.allLists).to.have.length(1)
      expect(state.allLists).to.eql([list])
    })

    it('adds a new list with a title, updating the title for existing lists', () => {
      const state = cloneDeep(defaultState)
      const list = { id: '1', title: 'testList' }
      const modList = { id: '1', title: 'anotherTestTitle' }

      mutations.setList(state, list)
      expect(state.allListsObject[list.id]).to.eql({ title: list.title })
      expect(state.allLists).to.have.length(1)
      expect(state.allLists[0]).to.eql(list)

      mutations.setList(state, modList)
      expect(state.allListsObject[modList.id]).to.eql({ title: modList.title })
      expect(state.allLists).to.have.length(1)
      expect(state.allLists[0]).to.eql(modList)
    })

    it('adds a new list with an array of IDs, updating the IDs for existing lists', () => {
      const state = cloneDeep(defaultState)
      const list = { id: '1', accountIds: ['1', '2', '3'] }
      const modList = { id: '1', accountIds: ['3', '4', '5'] }

      mutations.setListAccounts(state, list)
      expect(state.allListsObject[list.id]).to.eql({ accountIds: list.accountIds })

      mutations.setListAccounts(state, modList)
      expect(state.allListsObject[modList.id]).to.eql({ accountIds: modList.accountIds })
    })

    it('deletes a list', () => {
      const state = {
        allLists: [{ id: '1', title: 'testList' }],
        allListsObject: {
          1: { title: 'testList', accountIds: ['1', '2', '3'] }
        }
      }
      const id = '1'

      mutations.deleteList(state, { id })
      expect(state.allLists).to.have.length(0)
      expect(state.allListsObject).to.eql({})
    })
  })

  describe('getters', () => {
    it('returns list title', () => {
      const state = {
        allLists: [{ id: '1', title: 'testList' }],
        allListsObject: {
          1: { title: 'testList', accountIds: ['1', '2', '3'] }
        }
      }
      const id = '1'

      expect(getters.findListTitle(state)(id)).to.eql('testList')
    })

    it('returns list accounts', () => {
      const state = {
        allLists: [{ id: '1', title: 'testList' }],
        allListsObject: {
          1: { title: 'testList', accountIds: ['1', '2', '3'] }
        }
      }
      const id = '1'

      expect(getters.findListAccounts(state)(id)).to.eql(['1', '2', '3'])
    })
  })
})
