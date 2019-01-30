import * as MentionMatcher from 'src/services/mention_matcher/mention_matcher.js'

const localAttn = () => ({
  id: 123,
  is_local: true,
  name: 'Guy',
  screen_name: 'person',
  statusnet_profile_url: 'https://instance.com/users/person'
})

const externalAttn = () => ({
  id: 123,
  is_local: false,
  name: 'Guy',
  screen_name: 'person@instance.com',
  statusnet_profile_url: 'https://instance.com/users/person'
})

describe('MentionMatcher', () => {
  describe.only('mentionMatchesUrl', () => {
    it('should match local mention', () => {
      const attention = localAttn()
      const url = 'https://instance.com/users/person'

      expect(MentionMatcher.mentionMatchesUrl(attention, url)).to.eql(true)
    })

    it('should not match a local mention with same name but different instance', () => {
      const attention = localAttn()
      const url = 'https://website.com/users/person'

      expect(MentionMatcher.mentionMatchesUrl(attention, url)).to.eql(false)
    })

    it('should match external pleroma mention', () => {
      const attention = externalAttn()
      const url = 'https://instance.com/users/person'

      expect(MentionMatcher.mentionMatchesUrl(attention, url)).to.eql(true)
    })

    it('should not match external pleroma mention with same name but different instance', () => {
      const attention = externalAttn()
      const url = 'https://website.com/users/person'

      expect(MentionMatcher.mentionMatchesUrl(attention, url)).to.eql(false)
    })

    it('should match external mastodon mention', () => {
      const attention = externalAttn()
      const url = 'https://instance.com/@person'

      expect(MentionMatcher.mentionMatchesUrl(attention, url)).to.eql(true)
    })

    it('should not match external mastodon mention with same name but different instance', () => {
      const attention = externalAttn()
      const url = 'https://website.com/@person'

      expect(MentionMatcher.mentionMatchesUrl(attention, url)).to.eql(false)
    })
  })
})
