import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

describe('generateProfileLink', () => {
  it('returns obj for local user', () => {
    const user = { screen_name: 'john' }

    expect(generateProfileLink(user, 'jack')).to.eql({ name: 'user-profile', params: { name: 'jack' } })
  })

  it('returns obj for external user', () => {
    const user = { screen_name: 'john@domain', id: 1 }

    expect(generateProfileLink(user)).to.eql({ name: 'user-profile', params: { id: 1 } })
  })
})
