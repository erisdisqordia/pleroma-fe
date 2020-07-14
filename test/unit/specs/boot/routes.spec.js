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
})
