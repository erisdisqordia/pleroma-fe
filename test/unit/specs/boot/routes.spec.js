import Vuex from 'vuex'
import routes from 'src/boot/routes'
import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const store = new Vuex.Store({
  state: {
    instance: {}
  }
})

describe('routes', () => {
  const router = new VueRouter({
    mode: 'abstract',
    routes: routes(store)
  })

  it('root path', () => {
    router.push('/main/all')

    const matchedComponents = router.getMatchedComponents()

    expect(matchedComponents[0].components.hasOwnProperty('Timeline')).to.eql(true)
  })

  it('user\'s profile', () => {
    router.push('/fake-user-name')

    const matchedComponents = router.getMatchedComponents()

    expect(matchedComponents[0].components.hasOwnProperty('UserCard')).to.eql(true)
  })

  it('user\'s profile at /users', () => {
    router.push('/users/fake-user-name')

    const matchedComponents = router.getMatchedComponents()

    expect(matchedComponents[0].components.hasOwnProperty('UserCard')).to.eql(true)
  })

  it('list view', async () => {
    await router.push('/lists')

    const matchedComponents = router.currentRoute.value.matched

    expect(matchedComponents[0].components.default.components.hasOwnProperty('ListCard')).to.eql(true)
  })

  it('list timeline', async () => {
    await router.push('/lists/1')

    const matchedComponents = router.currentRoute.value.matched

    expect(matchedComponents[0].components.default.components.hasOwnProperty('Timeline')).to.eql(true)
  })

  it('list edit', async () => {
    await router.push('/lists/1/edit')

    const matchedComponents = router.currentRoute.value.matched

    expect(matchedComponents[0].components.default.components.hasOwnProperty('BasicUserCard')).to.eql(true)
  })
})
