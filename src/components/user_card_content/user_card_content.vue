<template>
  <div>
    <div class="base00-background panel-heading text-center" v-bind:style="style">
      <div class='user-info'>
        <img :src="user.profile_image_url">
        <div v-if='user.muted' class='muteinfo'>Muted</div>
        <div class='muteinfo' v-if='isOtherUser'>
          <button @click="toggleMute">Mute/Unmute</button>
        </div>
        <span class="glyphicon glyphicon-user"></span>
        <div class='user-name'>{{user.name}}</div>
        <div class='user-screen-name'>@{{user.screen_name}}</div>
        <div v-if="isOtherUser" class="following-info">
          <div v-if="user.follows_you" class="following">
            Follows you!
          </div>
          <div class="followed">
            <span v-if="user.following">
              Following them!
              <button @click="unfollowUser">
                Unfollow!
              </button>
            </span>
            <span v-if="!user.following" >
              <button @click="followUser">
                Follow!
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body base00-background">
      <div class="user-counts">
        <div class="user-count">
          <h5>Statuses</h5>
          <span>{{user.statuses_count}}</span>
        </div>
        <div class="user-count">
          <h5>Following</h5>
          <span>{{user.friends_count}}</span>
        </div>
        <div class="user-count">
          <h5>Followers</h5>
          <span>{{user.followers_count}}</span>
        </div>
      </div>
      <p>{{user.description}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: [ 'user' ],
    computed: {
      style () {
        return {
          color: `#${this.user.profile_link_color}`,
          'background-image': `url(${this.user.cover_photo})`
        }
      },
      isOtherUser () {
        return this.user !== this.$store.state.users.currentUser
      }
    },
    methods: {
      followUser () {
        const store = this.$store
        store.state.api.backendInteractor.followUser(this.user.id)
          .then((followedUser) => store.commit('addNewUsers', [followedUser]))
      },
      unfollowUser () {
        const store = this.$store
        store.state.api.backendInteractor.unfollowUser(this.user.id)
          .then((unfollowedUser) => store.commit('addNewUsers', [unfollowedUser]))
      },
      toggleMute () {
        const store = this.$store
        store.commit('setMuted', {user: this.user, muted: !this.user.muted})
      }
    }
  }
</script>
