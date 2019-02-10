import * as MatcherService from 'src/services/matcher/matcher.service.js'

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

describe('MatcherService', () => {
  describe('mentionMatchesUrl', () => {
    it('should match local mention', () => {
      const attention = localAttn()
      const url = 'https://instance.com/users/person'

      expect(MatcherService.mentionMatchesUrl(attention, url)).to.eql(true)
    })

    it('should not match a local mention with same name but different instance', () => {
      const attention = localAttn()
      const url = 'https://website.com/users/person'

      expect(MatcherService.mentionMatchesUrl(attention, url)).to.eql(false)
    })

    it('should match external pleroma mention', () => {
      const attention = externalAttn()
      const url = 'https://instance.com/users/person'

      expect(MatcherService.mentionMatchesUrl(attention, url)).to.eql(true)
    })

    it('should not match external pleroma mention with same name but different instance', () => {
      const attention = externalAttn()
      const url = 'https://website.com/users/person'

      expect(MatcherService.mentionMatchesUrl(attention, url)).to.eql(false)
    })

    it('should match external mastodon mention', () => {
      const attention = externalAttn()
      const url = 'https://instance.com/@person'

      expect(MatcherService.mentionMatchesUrl(attention, url)).to.eql(true)
    })

    it('should not match external mastodon mention with same name but different instance', () => {
      const attention = externalAttn()
      const url = 'https://website.com/@person'

      expect(MatcherService.mentionMatchesUrl(attention, url)).to.eql(false)
    })
  })
  describe('extractTagFromUrl', () => {
    it('should return tag name from valid pleroma url', () => {
      const url = 'https://website.com/tag/photo'

      expect(MatcherService.extractTagFromUrl(url)).to.eql('photo')
    })

    it('should return tag name from valid mastodon url', () => {
      const url = 'https://website.com/tags/sky'

      expect(MatcherService.extractTagFromUrl(url)).to.eql('sky')
    })

    it('should not return string but false if invalid url', () => {
      const url = 'https://website.com/users/sky'

      expect(MatcherService.extractTagFromUrl(url)).to.eql(false)
    })
  })
})
