import { cloneDeep } from 'lodash'
import { defaultState, mutations, prepareStatus } from '../../../../src/modules/statuses.js'

// eslint-disable-next-line camelcase
const makeMockStatus = ({id, text, type = 'status'}) => {
  return {
    id,
    user: {id: '0'},
    name: 'status',
    text: text || `Text number ${id}`,
    fave_num: 0,
    uri: '',
    type,
    attentions: []
  }
}

describe('Statuses.prepareStatus', () => {
  it('sets deleted flag to false', () => {
    const aStatus = makeMockStatus({id: '1', text: 'Hello oniichan'})
    expect(prepareStatus(aStatus).deleted).to.eq(false)
  })
})

describe('The Statuses module', () => {
  it('adds the status to allStatuses and to the given timeline', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})

    mutations.addNewStatuses(state, { statuses: [status], timeline: 'public' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.newStatusCount).to.equal(1)
  })

  it('counts the status as new if it has not been seen on this timeline', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})

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
    const status = makeMockStatus({id: '1'})

    mutations.addNewStatuses(state, { statuses: [status] })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([])
    expect(state.timelines.public.visibleStatuses).to.eql([])
    expect(state.timelines.public.newStatusCount).to.equal(0)
  })

  it('adds the status to allStatuses and to the given timeline, directly visible', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })

    expect(state.allStatuses).to.eql([status])
    expect(state.timelines.public.statuses).to.eql([status])
    expect(state.timelines.public.visibleStatuses).to.eql([status])
    expect(state.timelines.public.newStatusCount).to.equal(0)
  })

  it('removes statuses by tag on deletion', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})
    const otherStatus = makeMockStatus({id: '3'})
    status.uri = 'xxx'
    const deletion = makeMockStatus({id: '2', type: 'deletion'})
    deletion.text = 'Dolus deleted notice {{tag:gs.smuglo.li,2016-11-18:noticeId=1038007:objectType=note}}.'
    deletion.uri = 'xxx'

    mutations.addNewStatuses(state, { statuses: [status, otherStatus], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [deletion], showImmediately: true, timeline: 'public' })

    expect(state.allStatuses).to.eql([otherStatus])
    expect(state.timelines.public.statuses).to.eql([otherStatus])
    expect(state.timelines.public.visibleStatuses).to.eql([otherStatus])
    expect(state.timelines.public.maxId).to.eql('3')
  })

  it('does not update the maxId when the noIdUpdate flag is set', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})
    const secondStatus = makeMockStatus({id: '2'})

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    expect(state.timelines.public.maxId).to.eql('1')

    mutations.addNewStatuses(state, { statuses: [secondStatus], showImmediately: true, timeline: 'public', noIdUpdate: true })
    expect(state.timelines.public.statuses).to.eql([secondStatus, status])
    expect(state.timelines.public.visibleStatuses).to.eql([secondStatus, status])
    expect(state.timelines.public.maxId).to.eql('1')
  })

  it('keeps a descending by id order in timeline.visibleStatuses and timeline.statuses', () => {
    const state = cloneDeep(defaultState)
    const nonVisibleStatus = makeMockStatus({id: '1'})
    const status = makeMockStatus({id: '3'})
    const statusTwo = makeMockStatus({id: '2'})
    const statusThree = makeMockStatus({id: '4'})

    mutations.addNewStatuses(state, { statuses: [nonVisibleStatus], showImmediately: false, timeline: 'public' })

    mutations.addNewStatuses(state, { statuses: [status], showImmediately: true, timeline: 'public' })
    mutations.addNewStatuses(state, { statuses: [statusTwo], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.minVisibleId).to.equal('2')

    mutations.addNewStatuses(state, { statuses: [statusThree], showImmediately: true, timeline: 'public' })

    expect(state.timelines.public.statuses).to.eql([statusThree, status, statusTwo, nonVisibleStatus])
    expect(state.timelines.public.visibleStatuses).to.eql([statusThree, status, statusTwo])
  })

  it('splits retweets from their status and links them', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})
    const retweet = makeMockStatus({id: '2', type: 'retweet'})
    const modStatus = makeMockStatus({id: '1', text: 'something else'})

    retweet.retweeted_status = status

    // It adds both statuses, but only the retweet to visible.
    mutations.addNewStatuses(state, { statuses: [retweet], timeline: 'public', showImmediately: true })
    expect(state.timelines.public.visibleStatuses).to.have.length(1)
    expect(state.timelines.public.statuses).to.have.length(1)
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].id).to.equal('1')
    expect(state.allStatuses[1].id).to.equal('2')

    // It refers to the modified status.
    mutations.addNewStatuses(state, { statuses: [modStatus], timeline: 'public' })
    expect(state.allStatuses).to.have.length(2)
    expect(state.allStatuses[0].id).to.equal('1')
    expect(state.allStatuses[0].text).to.equal(modStatus.text)
    expect(state.allStatuses[1].id).to.equal('2')
    expect(retweet.retweeted_status.text).to.eql(modStatus.text)
  })

  it('replaces existing statuses with the same id', () => {
    const state = cloneDeep(defaultState)
    const status = makeMockStatus({id: '1'})
    const modStatus = makeMockStatus({id: '1', text: 'something else'})

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
    const status = makeMockStatus({id: '1'})
    const modStatus = makeMockStatus({id: '1', text: 'something else'})
    const retweet = makeMockStatus({id: '2', type: 'retweet'})
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
    const status = makeMockStatus({id: '1'})

    const favorite = {
      id: '2',
      type: 'favorite',
      in_reply_to_status_id: '1', // The API uses strings here...
      uri: 'tag:shitposter.club,2016-08-21:fave:3895:note:773501:2016-08-21T16:52:15+00:00',
      text: 'a favorited something by b',
      user: { id: '99' }
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

    // If something is favorited by the current user, it also sets the 'favorited' property but does not increment counter to avoid over-counting. Counter is incremented (updated, really) via response to the favorite request.
    const user = {
      id: '1'
    }

    const ownFavorite = {
      id: '3',
      type: 'favorite',
      in_reply_to_status_id: '1', // The API uses strings here...
      uri: 'tag:shitposter.club,2016-08-21:fave:3895:note:773501:2016-08-21T16:52:15+00:00',
      text: 'a favorited something by b',
      user
    }

    mutations.addNewStatuses(state, { statuses: [ownFavorite], showImmediately: true, timeline: 'public', user })

    expect(state.timelines.public.visibleStatuses.length).to.eql(1)
    expect(state.timelines.public.visibleStatuses[0].fave_num).to.eql(1)
    expect(state.timelines.public.visibleStatuses[0].favorited).to.eql(true)
  })

  it('keeps userId when clearing user timeline', () => {
    const state = cloneDeep(defaultState)
    state.timelines.user.userId = 123

    mutations.clearTimeline(state, { timeline: 'user' })

    expect(state.timelines.user.userId).to.eql(123)
  })

  describe('notifications', () => {
    it('removes a notification when the notice gets removed', () => {
      const user = { id: '1' }
      const state = cloneDeep(defaultState)
      const status = makeMockStatus({id: '1'})
      const otherStatus = makeMockStatus({id: '3'})
      const mentionedStatus = makeMockStatus({id: '2'})
      mentionedStatus.attentions = [user]
      mentionedStatus.uri = 'xxx'
      otherStatus.attentions = [user]

      const deletion = makeMockStatus({id: '4', type: 'deletion'})
      deletion.text = 'Dolus deleted notice {{tag:gs.smuglo.li,2016-11-18:noticeId=1038007:objectType=note}}.'
      deletion.uri = 'xxx'

      mutations.addNewStatuses(state, { statuses: [status, otherStatus], user })
      mutations.addNewNotifications(
        state,
        {
          notifications: [{
            from_profile: { id: '2' },
            id: '998',
            type: 'mention',
            status: otherStatus,
            action: otherStatus,
            seen: false
          }]
        })

      expect(state.notifications.data.length).to.eql(1)
      mutations.addNewNotifications(
        state,
        {
          notifications: [{
            from_profile: { id: '2' },
            id: '999',
            type: 'mention',
            status: mentionedStatus,
            action: mentionedStatus,
            seen: false
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
