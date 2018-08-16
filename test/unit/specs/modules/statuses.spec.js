import { cloneDeep } from 'lodash'
import { defaultState, mutations, findMaxId, prepareStatus, statusType } from '../../../../src/modules/statuses.js'

// eslint-disable-next-line camelcase
const makeMockStatus = ({id, text, is_post_verb = true}) => {
  return {
    id,
    user: {id: 0},
    name: 'status',
    text: text || `Text number ${id}`,
    fave_num: 0,
    uri: '',
    is_post_verb,
    attentions: []
  }
}

describe('Statuses.statusType', () => {
  it('identifies favorites', () => {
    const fav = {
      uri: 'tag:soykaf.com,2016-08-21:fave:2558:note:339495:2016-08-21T16:54:04+00:00'
    }

    const mastoFav = {
      uri: 'tag:mastodon.social,2016-11-27:objectId=73903:objectType=Favourite'
    }

    expect(statusType(fav)).to.eql('favorite')
    expect(statusType(mastoFav)).to.eql('favorite')
  })
})

describe('Statuses.prepareStatus', () => {
  it('sets nsfw for statuses with the #nsfw tag', () => {
    const safe = makeMockStatus({id: 1, text: 'Hello oniichan'})
    const nsfw = makeMockStatus({id: 1, text: 'Hello oniichan #nsfw'})

    expect(prepareStatus(safe).nsfw).to.eq(false)
    expect(prepareStatus(nsfw).nsfw).to.eq(true)
  })

  it('leaves existing nsfw settings alone', () => {
    const nsfw = makeMockStatus({id: 1, text: 'Hello oniichan #nsfw'})
    nsfw.nsfw = false

    expect(prepareStatus(nsfw).nsfw).to.eq(false)
  })

  it('sets deleted flag to false', () => {
    const aStatus = makeMockStatus({id: 1, text: 'Hello oniichan'})
    expect(prepareStatus(aStatus).deleted).to.eq(false)
  })
})

describe('Statuses.findMaxId', () => {
  it('returns the largest id in any of the given arrays', () => {
    const statusesOne = [{ id: 100 }, { id: 2 }]
    const statusesTwo = [{ id: 3 }]

    const maxId = findMaxId(statusesOne, statusesTwo)
    expect(maxId).to.eq(100)
  })

  it('returns undefined for empty arrays', () => {
    const maxId = findMaxId([], [])
    expect(maxId).to.eq(undefined)
  })
})

describe('The Statuses module', () => {
  it('adds the status to allStatuses and to the given timeline', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    mutations.addNewStatuses(state, { statuses: [status], timeline: 'public' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.newStatusCount).to.equal(1)
  })

  it('counts the status as new if it has not been seen on this timeline', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    mutations.addNewStatuses(state, { statuses: [status], timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [status], timeline: 'friends' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.newStatusCount).to.equal(1)

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.friends.statuses).to.eql([status])
    expect(state.timelines.friends.visibleStatuses).to.eql([])
    expect(state.timelines.friends.newStatusCount).to.equal(1)
  })

  it('add the statuses to allStatuses if no timeline is given', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    mutations.addNewStatuses(state, { statuses: [status] })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.newStatusCount).to.equal(0)
  })

  it('adds the status to allStatuses and to the given timeline, directly visible', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([status])
    expect(state.timelines.public.newStatusCount).to.equal(0)
  })

  it('removes statuses by tag on deletion', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const otherStatus = makeMockStatus({id: 3})
    status.uri = 'xxx'
    const deletion = makeMockStatus({id: 2, is_post_verb: false})
    deletion.text = 'Dolus deleted notice {{tag:gs.smuglo.li,2016-11-18:noticeId=1038007:objectType=note}}.'
    deletion.uri = 'xxx'

    mutations.addNewStatuses(state, { statuses: [status, otherStatus], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [deletion], showImmediately: true, timeline: 'public' })

    expect(state.allStatuses).to.eql([otherStatus])
    expect(state.timelines.public.statuses).to.eql([otherStatus])
    expect(state.timelines.public.visibleStatuses).to.eql([otherStatus])
    expect(state.timelines.public.maxId).to.eql(3)
  })

  it('does not update the maxId when the noIdUpdate flag is set', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const secondStatus = makeMockStatus({id: 2})

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.maxId).to.eql(1)

    mutations.addNewStatuses(state, { statuses: [secondStatus], showImmediately: true, timeline: 'public', noIdUpdate: true })
    expect(state.timelines.public.statuses).to.eql([secondStatus, status])
    expect(state.timelines.public.visibleStatuses).to.eql([secondStatus, status])
    expect(state.timelines.public.maxId).to.eql(1)
  })

  it('keeps a descending by id order in timeline.visibleStatuses and timeline.statuses', () => {
    const state = cloneDeep(defaultState)
    const nonVisibleStatus = makeMockStatus({id: 1})
    const status = makeMockStatus({id: 3})
    const statusTwo = makeMockStatus({id: 2})
    const statusThree = makeMockStatus({id: 4})

    mutations.addNewStatuses(state, { statuses: [nonVisibleStatus], showImmediately: false, timeline: 'public' })

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [statusTwo], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.minVisibleId).to.equal(2)

    mutations.addNewStatuses(state, { statuses: [statusThree], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.statuses).to.eql([statusThree, status, statusTwo, nonVisibleStatus])
    expect(state.timelines.public.visibleStatuses).to.eql([statusThree, status, statusTwo])
  })

  it('splits retweets from their status and links them', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const retweet = makeMockStatus({id: 2, is_post_verb: false})
    const modStatus = makeMockStatus({id: 1, text: 'something else'})

    retweet.retweeted_status = status

    // It adds both statuses, but only the retweet to visible.
    mutations.addNewStatuses(state, { statuses: [retweet], timeline: 'public', showImmediately: true })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.timelines.public.statuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].id).to.equal(1)
    expect(state.allStatuses[1].id).to.equal(2)

    // It refers to the modified status.
    mutations.addNewStatuses(state, { statuses: [modStatus], timeline: 'public' })
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].id).to.equal(1)
    expect(state.allStatuses[0].text).to.equal(modStatus.text)
    expect(state.allStatuses[1].id).to.equal(2)
    expect(retweet.retweeted_status.text).to.eql(modStatus.text)
  })

  it('replaces existing statuses with the same id', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const modStatus = makeMockStatus({id: 1, text: 'something else'})

    // Add original status
    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(1)

    // Add new version of status
    mutations.addNewStatuses(state, { statuses: [modStatus], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(1)
    expect(state.allStatuses[0].text).to.eql(modStatus.text)
  })

  it('replaces existing statuses with the same id, coming from a retweet', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})
    const modStatus = makeMockStatus({id: 1, text: 'something else'})
    const retweet = makeMockStatus({id: 2, is_post_verb: false})
    retweet.retweeted_status = modStatus

    // Add original status
    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(1)

    // Add new version of status
    mutations.addNewStatuses(state, { statuses: [retweet], showImmediately: false, timeline: 'public' })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    // Don't add the retweet itself if the tweet is visible
    expect(state.timelines.public.statuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].text).to.eql(modStatus.text)
  })

  it('handles favorite actions', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: 1})

    const favorite = {
      id: 2,
      is_post_verb: false,
      in_reply_to_status_id: '1', // The API uses strings here...
      uri: 'tag:shitposter.club,2016-08-21:fave:3895:note:773501:2016-08-21T16:52:15+00:00',
      text: 'a favorited something by b',
      user: {}
    }

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [favorite], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.visibleStatuses.length).to.eql(1)
    expect(state.timelines.public.visibleStatuses[0].fave_num).to.eql(1)
    expect(state.timelines.public.maxId).to.eq(favorite.id)

    // Adding it again does nothing
    mutations.addNewStatuses(state, { statuses: [favorite], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.visibleStatuses.length).to.eql(1)
    expect(state.timelines.public.visibleStatuses[0].fave_num).to.eql(1)
    expect(state.timelines.public.maxId).to.eq(favorite.id)

    // If something is favorited by the current user, it also sets the 'favorited' property
    const user = {
      id: 1
    }

    const ownFavorite = {
      id: 3,
      is_post_verb: false,
      in_reply_to_status_id: '1', // The API uses strings here...
      uri: 'tag:shitposter.club,2016-08-21:fave:3895:note:773501:2016-08-21T16:52:15+00:00',
      text: 'a favorited something by b',
      user
    }

    mutations.addNewStatuses(state, { statuses: [ownFavorite], showImmediately: true, timeline: 'public', user })

    expect(state.timelines.public.visibleStatuses.length).to.eql(1)
    expect(state.timelines.public.visibleStatuses[0].fave_num).to.eql(2)
    expect(state.timelines.public.visibleStatuses[0].favorited).to.eql(true)
  })

  describe('notifications', () => {
    it('removes a notification when the notice gets removed', () => {
      const user = { id: 1 }
      const state = cloneDeep(defaultState)
      const status = makeMockStatus({id: 1})
      const otherStatus = makeMockStatus({id: 3})
      const mentionedStatus = makeMockStatus({id: 2})
      mentionedStatus.attentions = [user]
      mentionedStatus.uri = 'xxx'
      otherStatus.attentions = [user]

      const deletion = makeMockStatus({id: 4, is_post_verb: false})
      deletion.text = 'Dolus deleted notice {{tag:gs.smuglo.li,2016-11-18:noticeId=1038007:objectType=note}}.'
      deletion.uri = 'xxx'

      mutations.addNewStatuses(state, { statuses: [status, otherStatus], user })
      mutations.addNewNotifications(
        state,
        {
          notifications: [{
            ntype: 'mention',
            status: otherStatus,
            notice: otherStatus,
            is_seen: false
          }]
        })

      expect(state.notifications.data.length).to.eql(1)
      mutations.addNewNotifications(
        state,
        {
          notifications: [{
            ntype: 'mention',
            status: mentionedStatus,
            notice: mentionedStatus,
            is_seen: false
          }]
        })

      mutations.addNewStatuses(state, { statuses: [mentionedStatus], user })
      expect(state.allStatuses.length).to.eql(3)
      expect(state.notifications.data.length).to.eql(2)
      expect(state.notifications.data[1].status).to.eql(mentionedStatus)
      expect(state.notifications.data[1].action).to.eql(mentionedStatus)
      expect(state.notifications.data[1].type).to.eql('mention')

      mutations.addNewStatuses(state, { statuses: [deletion], user })
      expect(state.allStatuses.length).to.eql(2)
      expect(state.notifications.data.length).to.eql(1)
    })
  })
})
