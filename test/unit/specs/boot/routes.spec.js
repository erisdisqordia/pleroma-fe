import routes from 'src/boot/routes'
import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('routes', () => {
  const router = new VueRouter({
    mode: 'abstract',
    routes: routes({})
  })

  it('root path', () => {
    router.push('/~/main/all')

    const matchedComponents = router.getMatchedComponents()

    expect(matchedComponents[0].components.hasOwnProperty('Timeline'))
  })

  it('user\'s profile', () => {
    router.push('/fake-user-name')

    const matchedComponents = router.getMatchedComponents()

    expect(matchedComponents[0].components.hasOwnProperty('UserProfile'))
  })
})
