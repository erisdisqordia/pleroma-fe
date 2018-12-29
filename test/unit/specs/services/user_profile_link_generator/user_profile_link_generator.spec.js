import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

describe('generateProfileLink', () => {
  it('returns obj for local user', () => {
    expect(generateProfileLink(1, 'jack')).to.eql({
      name: 'user-profile', params: { name: 'jack' }
    })
  })

  it('returns obj for external user', () => {
    expect(generateProfileLink(1, 'john@domain')).to.eql({
      name: 'external-user-profile', params: { id: 1 }
    })
  })

  it('returns obj for restricted user', () => {
    expect(generateProfileLink(1, 'lain', ['lain'])).to.eql({
      name: 'external-user-profile', params: { id: 1 }
    })
  })
})
