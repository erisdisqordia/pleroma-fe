import { parseStatus, parseUser, parseNotification } from '../../../../../src/services/entity_normalizer/entity_normalizer.service.js'

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

parseNotification
parseUser
parseStatus
makeMockStatusQvitter
makeMockUserQvitter

describe('QVitter preprocessing', () => {
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

  it('sets nsfw for statuses with the #nsfw tag', () => {
    const safe = makeMockStatusQvitter({id: '1', text: 'Hello oniichan'})
    const nsfw = makeMockStatusQvitter({id: '1', text: 'Hello oniichan #nsfw'})

    expect(parseStatus(safe).nsfw).to.eq(false)
    expect(parseStatus(nsfw).nsfw).to.eq(true)
  })

  it('leaves existing nsfw settings alone', () => {
    const nsfw = makeMockStatusQvitter({id: '1', text: 'Hello oniichan #nsfw', nsfw: false})

    expect(parseStatus(nsfw).nsfw).to.eq(false)
  })
})
