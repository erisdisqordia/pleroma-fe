import { parseStatus, parseUser, parseNotification, addEmojis } from '../../../../../src/services/entity_normalizer/entity_normalizer.service.js'
import mastoapidata from '../../../../fixtures/mastoapi.json'
import qvitterapidata from '../../../../fixtures/statuses.json'

const makeMockStatusQvitter = (overrides = {}) => {
  return Object.assign({
    activity_type: 'post',
    attachments: [],
    attentions: [],
    created_at: 'Tue Jan 15 13:57:56 +0000 2019',
    external_url: 'https://ap.example/whatever',
    fave_num: 1,
    favorited: false,
    id: '10335970',
    in_reply_to_ostatus_uri: null,
    in_reply_to_profileurl: null,
    in_reply_to_screen_name: null,
    in_reply_to_status_id: null,
    in_reply_to_user_id: null,
    is_local: false,
    is_post_verb: true,
    possibly_sensitive: false,
    repeat_num: 0,
    repeated: false,
    statusnet_conversation_id: '16300488',
    statusnet_html: '<p>haha benis</p>',
    summary: null,
    tags: [],
    text: 'haha benis',
    uri: 'https://ap.example/whatever',
    user: makeMockUserQvitter(),
    visibility: 'public'
  }, overrides)
}

const makeMockUserQvitter = (overrides = {}) => {
  return Object.assign({
    background_image: null,
    cover_photo: '',
    created_at: 'Mon Jan 14 13:56:51 +0000 2019',
    default_scope: 'public',
    description: 'ebin',
    description_html: '<p>ebin</p>',
    favourites_count: 0,
    fields: [],
    followers_count: 1,
    following: true,
    follows_you: true,
    friends_count: 1,
    id: '60717',
    is_local: false,
    locked: false,
    name: 'Spurdo :ebin:',
    name_html: 'Spurdo <img src="whatever">',
    no_rich_text: false,
    pleroma: { confirmation_pending: false, tags: [] },
    profile_image_url: 'https://ap.example/whatever',
    profile_image_url_https: 'https://ap.example/whatever',
    profile_image_url_original: 'https://ap.example/whatever',
    profile_image_url_profile_size: 'https://ap.example/whatever',
    rights: { delete_others_notice: false },
    screen_name: 'spurdo@ap.example',
    statuses_count: 46,
    statusnet_blocking: false,
    statusnet_profile_url: ''
  }, overrides)
}

const makeMockUserMasto = (overrides = {}) => {
  return Object.assign({
    acct: 'hj',
    avatar:
    'https://shigusegubu.club/media/1657b945-8d5b-4ce6-aafb-4c3fc5772120/8ce851029af84d55de9164e30cc7f46d60cbf12eee7e96c5c0d35d9038ddade1.png',
    avatar_static:
    'https://shigusegubu.club/media/1657b945-8d5b-4ce6-aafb-4c3fc5772120/8ce851029af84d55de9164e30cc7f46d60cbf12eee7e96c5c0d35d9038ddade1.png',
    bot: false,
    created_at: '2017-12-17T21:54:14.000Z',
    display_name: 'whatever whatever whatever witch',
    emojis: [],
    fields: [],
    followers_count: 705,
    following_count: 326,
    header:
    'https://shigusegubu.club/media/7ab024d9-2a8a-4fbc-9ce8-da06756ae2db/6aadefe4e264133bc377ab450e6b045b6f5458542a5c59e6c741f86107f0388b.png',
    header_static:
    'https://shigusegubu.club/media/7ab024d9-2a8a-4fbc-9ce8-da06756ae2db/6aadefe4e264133bc377ab450e6b045b6f5458542a5c59e6c741f86107f0388b.png',
    id: '1',
    locked: false,
    note:
    'Volatile Internet Weirdo. Name pronounced as Hee Jay. JS and Java dark arts mage, Elixir trainee. I love sampo and lain. Matrix is <span><a data-user="1" href="https://shigusegubu.club/users/hj">@<span>hj</span></a></span>:matrix.heldscal.la Pronouns are whatever. Do not DM me unless it\'s truly private matter and you\'re instance\'s admin or you risk your DM to be reposted publicly.Wish i was Finnish girl.',
    pleroma: { confirmation_pending: false, tags: null },
    source: { note: '', privacy: 'public', sensitive: false },
    statuses_count: 41775,
    url: 'https://shigusegubu.club/users/hj',
    username: 'hj'
  }, overrides)
}

const makeMockStatusMasto = (overrides = {}) => {
  return Object.assign({
    account: makeMockUserMasto(),
    application: { name: 'Web', website: null },
    content:
    '<span><a data-user="14660" href="https://pleroma.soykaf.com/users/sampo">@<span>sampo</span></a></span> god i wish i was there',
    created_at: '2019-01-17T16:29:23.000Z',
    emojis: [],
    favourited: false,
    favourites_count: 1,
    id: '10423476',
    in_reply_to_account_id: '14660',
    in_reply_to_id: '10423197',
    language: null,
    media_attachments: [],
    mentions: [
      {
        acct: 'sampo@pleroma.soykaf.com',
        id: '14660',
        url: 'https://pleroma.soykaf.com/users/sampo',
        username: 'sampo'
      }
    ],
    muted: false,
    reblog: null,
    reblogged: false,
    reblogs_count: 0,
    replies_count: 0,
    sensitive: false,
    spoiler_text: '',
    tags: [],
    uri: 'https://shigusegubu.club/objects/16033fbb-97c0-4f0e-b834-7abb92fb8639',
    url: 'https://shigusegubu.club/objects/16033fbb-97c0-4f0e-b834-7abb92fb8639',
    visibility: 'public',
    pleroma: {
      local: true
    }
  }, overrides)
}

const makeMockNotificationQvitter = (overrides = {}) => {
  return Object.assign({
    notice: makeMockStatusQvitter(),
    ntype: 'follow',
    from_profile: makeMockUserQvitter(),
    is_seen: 0,
    id: 123
  }, overrides)
}

const makeMockEmojiMasto = (overrides = [{}]) => {
  return [
    Object.assign({
      shortcode: 'image',
      static_url: 'https://example.com/image.png',
      url: 'https://example.com/image.png',
      visible_in_picker: false
    }, overrides[0]),
    Object.assign({
      shortcode: 'thinking',
      static_url: 'https://example.com/think.png',
      url: 'https://example.com/think.png',
      visible_in_picker: false
    }, overrides[1])
  ]
}

describe('API Entities normalizer', () => {
  describe('parseStatus', () => {
    describe('QVitter preprocessing', () => {
      it('doesn\'t blow up', () => {
        const parsed = qvitterapidata.map(parseStatus)
        expect(parsed.length).to.eq(qvitterapidata.length)
      })

      it('identifies favorites', () => {
        const fav = {
          uri: 'tag:soykaf.com,2016-08-21:fave:2558:note:339495:2016-08-21T16:54:04+00:00',
          is_post_verb: false
        }

        const mastoFav = {
          uri: 'tag:mastodon.social,2016-11-27:objectId=73903:objectType=Favourite',
          is_post_verb: false
        }

        expect(parseStatus(makeMockStatusQvitter(fav))).to.have.property('type', 'favorite')
        expect(parseStatus(makeMockStatusQvitter(mastoFav))).to.have.property('type', 'favorite')
      })

      it('processes repeats correctly', () => {
        const post = makeMockStatusQvitter({ retweeted_status: null, id: 'deadbeef' })
        const repeat = makeMockStatusQvitter({ retweeted_status: post, is_post_verb: false, id: 'foobar' })

        const parsedPost = parseStatus(post)
        const parsedRepeat = parseStatus(repeat)

        expect(parsedPost).to.have.property('type', 'status')
        expect(parsedRepeat).to.have.property('type', 'retweet')
        expect(parsedRepeat).to.have.property('retweeted_status')
        expect(parsedRepeat).to.have.deep.property('retweeted_status.id', 'deadbeef')
      })

      it('sets nsfw for statuses with the #nsfw tag', () => {
        const safe = makeMockStatusQvitter({ id: '1', text: 'Hello oniichan' })
        const nsfw = makeMockStatusQvitter({ id: '1', text: 'Hello oniichan #nsfw' })

        expect(parseStatus(safe).nsfw).to.eq(false)
        expect(parseStatus(nsfw).nsfw).to.eq(true)
      })

      it('leaves existing nsfw settings alone', () => {
        const nsfw = makeMockStatusQvitter({ id: '1', text: 'Hello oniichan #nsfw', nsfw: false })

        expect(parseStatus(nsfw).nsfw).to.eq(false)
      })
    })

    describe('Mastoapi preprocessing and converting', () => {
      it('doesn\'t blow up', () => {
        const parsed = mastoapidata.map(parseStatus)
        expect(parsed.length).to.eq(mastoapidata.length)
      })

      it('processes repeats correctly', () => {
        const post = makeMockStatusMasto({ reblog: null, id: 'deadbeef' })
        const repeat = makeMockStatusMasto({ reblog: post, id: 'foobar' })

        const parsedPost = parseStatus(post)
        const parsedRepeat = parseStatus(repeat)

        expect(parsedPost).to.have.property('type', 'status')
        expect(parsedRepeat).to.have.property('type', 'retweet')
        expect(parsedRepeat).to.have.property('retweeted_status')
        expect(parsedRepeat).to.have.deep.property('retweeted_status.id', 'deadbeef')
      })

      it('adds emojis to post content', () => {
        const post = makeMockStatusMasto({ emojis: makeMockEmojiMasto(), content: 'Makes you think :thinking:' })

        const parsedPost = parseStatus(post)

        expect(parsedPost).to.have.property('statusnet_html').that.contains('<img')
      })

      it('adds emojis to subject line', () => {
        const post = makeMockStatusMasto({ emojis: makeMockEmojiMasto(), spoiler_text: 'CW: 300 IQ :thinking:' })

        const parsedPost = parseStatus(post)

        expect(parsedPost).to.have.property('summary_html').that.contains('<img')
      })
    })
  })

  // Statuses generally already contain some info regarding users and there's nearly 1:1 mapping, so very little to test
  describe('parseUsers (MastoAPI)', () => {
    it('sets correct is_local for users depending on their screen_name', () => {
      const local = makeMockUserMasto({ acct: 'foo' })
      const remote = makeMockUserMasto({ acct: 'foo@bar.baz' })

      expect(parseUser(local)).to.have.property('is_local', true)
      expect(parseUser(remote)).to.have.property('is_local', false)
    })

    it('adds emojis to user name', () => {
      const user = makeMockUserMasto({ emojis: makeMockEmojiMasto(), display_name: 'The :thinking: thinker' })

      const parsedUser = parseUser(user)

      expect(parsedUser).to.have.property('name_html').that.contains('<img')
    })

    it('adds emojis to user bio', () => {
      const user = makeMockUserMasto({ emojis: makeMockEmojiMasto(), note: 'Hello i like to :thinking: a lot' })

      const parsedUser = parseUser(user)

      expect(parsedUser).to.have.property('description_html').that.contains('<img')
    })

    it('adds emojis to user profile fields', () => {
      const user = makeMockUserMasto({ emojis: makeMockEmojiMasto(), fields: [{ name: ':thinking:', value: ':image:' }] })

      const parsedUser = parseUser(user)

      expect(parsedUser).to.have.property('fields_html').to.be.an('array')

      const field = parsedUser.fields_html[0]

      expect(field).to.have.property('name').that.contains('<img')
      expect(field).to.have.property('value').that.contains('<img')
    })

    it('removes html tags from user profile fields', () => {
      const user = makeMockUserMasto({ emojis: makeMockEmojiMasto(), fields: [{ name: 'user', value: '<a rel="me" href="https://example.com/@user">@user</a>' }] })

      const parsedUser = parseUser(user)

      expect(parsedUser).to.have.property('fields_text').to.be.an('array')

      const field = parsedUser.fields_text[0]

      expect(field).to.have.property('name').that.equal('user')
      expect(field).to.have.property('value').that.equal('@user')
    })

    it('adds hide_follows and hide_followers user settings', () => {
      const user = makeMockUserMasto({ pleroma: { hide_followers: true, hide_follows: false, hide_followers_count: false, hide_follows_count: true } })

      expect(parseUser(user)).to.have.property('hide_followers', true)
      expect(parseUser(user)).to.have.property('hide_follows', false)
      expect(parseUser(user)).to.have.property('hide_followers_count', false)
      expect(parseUser(user)).to.have.property('hide_follows_count', true)
    })
  })

  // We currently use QvitterAPI notifications only, and especially due to MastoAPI lacking is_seen, support for MastoAPI
  // is more of an afterthought
  describe('parseNotifications (QvitterAPI)', () => {
    it('correctly normalizes data to FE\'s format', () => {
      const notif = makeMockNotificationQvitter({
        id: 123,
        notice: makeMockStatusQvitter({ id: 444 }),
        from_profile: makeMockUserQvitter({ id: 'spurdo' })
      })
      expect(parseNotification(notif)).to.have.property('id', 123)
      expect(parseNotification(notif)).to.have.property('seen', false)
      expect(parseNotification(notif)).to.have.deep.property('status.id', '444')
      expect(parseNotification(notif)).to.have.deep.property('action.id', '444')
      expect(parseNotification(notif)).to.have.deep.property('from_profile.id', 'spurdo')
    })

    it('correctly normalizes favorite notifications', () => {
      const notif = makeMockNotificationQvitter({
        id: 123,
        ntype: 'like',
        notice: makeMockStatusQvitter({
          id: 444,
          favorited_status: makeMockStatusQvitter({ id: 4412 })
        }),
        is_seen: 1,
        from_profile: makeMockUserQvitter({ id: 'spurdo' })
      })
      expect(parseNotification(notif)).to.have.property('id', 123)
      expect(parseNotification(notif)).to.have.property('type', 'like')
      expect(parseNotification(notif)).to.have.property('seen', true)
      expect(parseNotification(notif)).to.have.deep.property('status.id', '4412')
      expect(parseNotification(notif)).to.have.deep.property('action.id', '444')
      expect(parseNotification(notif)).to.have.deep.property('from_profile.id', 'spurdo')
    })
  })

  describe('MastoAPI emoji adder', () => {
    const emojis = makeMockEmojiMasto()
    const imageHtml = '<img src="https://example.com/image.png" alt=":image:" title=":image:" class="emoji" />'
      .replace(/"/g, '\'')
    const thinkHtml = '<img src="https://example.com/think.png" alt=":thinking:" title=":thinking:" class="emoji" />'
      .replace(/"/g, '\'')

    it('correctly replaces shortcodes in supplied string', () => {
      const result = addEmojis('This post has :image: emoji and :thinking: emoji', emojis)
      expect(result).to.include(thinkHtml)
      expect(result).to.include(imageHtml)
    })

    it('handles consecutive emojis correctly', () => {
      const result = addEmojis('Lelel emoji spam :thinking::thinking::thinking::thinking:', emojis)
      expect(result).to.include(thinkHtml + thinkHtml + thinkHtml + thinkHtml)
    })

    it('Doesn\'t replace nonexistent emojis', () => {
      const result = addEmojis('Admin add the :tenshi: emoji', emojis)
      expect(result).to.equal('Admin add the :tenshi: emoji')
    })

    it('Doesn\'t blow up on regex special characters', () => {
      const emojis = makeMockEmojiMasto([{
        shortcode: 'c++'
      }, {
        shortcode: '[a-z] {|}*'
      }])
      const result = addEmojis('This post has :c++: emoji and :[a-z] {|}*: emoji', emojis)
      expect(result).to.include('title=\':c++:\'')
      expect(result).to.include('title=\':[a-z] {|}*:\'')
    })
  })
})
