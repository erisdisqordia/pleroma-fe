<template>
  <div>
    <div class="panel-heading text-center" v-bind:style="style">
      <div class='user-info'>
        <img :src="user.profile_image_url">
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
    <div class="panel-body">
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
        this.$store.state.api.backendInteractor.followUser(this.user.id)
          .then((x) => console.log)
      }
    }
  }
</script>
