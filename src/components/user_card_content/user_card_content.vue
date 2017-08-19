<template>
  <div id="heading" class="profile-panel-background" :style="headingStyle">
    <div class="panel-heading text-center">
      <div class='user-info'>
        <router-link to='/user-settings' style="float: right;">
          <i class="icon-cog usersettings"></i>
        </router-link>
        <div class='container'>
          <img :src="user.profile_image_url">
          <span class="glyphicon glyphicon-user"></span>
          <div class="name-and-screen-name">
            <div class='user-name'>{{user.name}}</div>
            <div class='user-screen-name'>@{{user.screen_name}}</div>
          </div>
        </div>
        <div v-if="isOtherUser" class="user-interactions">
          <div v-if="user.follows_you && loggedIn" class="following base06">
            Follows you!
          </div>
          <div class="follow" v-if="loggedIn">
            <span v-if="user.following">
              <!--Following them!-->
              <button @click="unfollowUser" class="base04 base00-background pressed">
                Following!
              </button>
            </span>
            <span v-if="!user.following">
              <button @click="followUser" class="base05 base02-background">
                Follow
              </button>
            </span>
          </div>
          <div class='mute' v-if='isOtherUser'>
            <span v-if='user.muted'>
              <button @click="toggleMute" class="base04 base00-background pressed">Muted</button>
            </span>
            <span v-if='!user.muted'>
              <button @click="toggleMute" class="base05 base02-background">Mute</button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body profile-panel-body" :style="bodyStyle">
      <div class="user-counts">
        <div class="user-count">
          <h5>Statuses</h5>
          <span>{{user.statuses_count}} <br><span class="dailyAvg">{{dailyAvg}} per day</span></span>
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
      headingStyle () {
        let color = this.$store.state.config.colors['base00']
        if (color) {
          let rgb = this.$store.state.config.colors['base00'].match(/\d+/g)
          return {
            backgroundColor: `rgb(${Math.floor(rgb[0] * 0.53)}, ${Math.floor(rgb[1] * 0.56)}, ${Math.floor(rgb[2] * 0.59)})`,
            backgroundImage: `url(${this.user.cover_photo})`
          }
        }
      },
      bodyStyle () {
        return {
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${this.$store.state.config.colors['base00']} 80%)`
        }
      },
      isOtherUser () {
        return this.user !== this.$store.state.users.currentUser
      },
      loggedIn () {
        return this.$store.state.users.currentUser
      },
      dailyAvg () {
        const days = Math.ceil((new Date() - new Date(this.user.created_at)) / (60 * 60 * 24 * 1000))
        return Math.round(this.user.statuses_count / days)
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
        store.state.api.backendInteractor.setUserMute(this.user)
      }
    }
  }
</script>

<style lang="scss">

.profile-panel-background {
  background-size: cover;
  border-radius: 10px;

  .panel-heading {
    padding: 0.6em 0em;
    text-align: center;
  }
}

.profile-panel-body {
  top: -0em;
  padding-top: 4em;

  word-wrap: break-word;
}

.user-info {
	color: white;
  padding: 16px 16px 16px 16px;
  margin-bottom: -4em;

  .usersettings {
    color: white;
    opacity: 0.8;
  }

  .container{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    max-height: 60px;
    overflow: hidden;
  }

  img {
    border: 2px solid;
    border-radius: 5px;
    flex: 1 0 100%;
    width: 48px;
    height: 48px;
    object-fit: cover;
  }

	text-shadow: 0px 1px 1.5px rgba(0, 0, 0, 1.0);

  .name-and-screen-name {
    display: block;
    margin-top: 0.0em;
    margin-left: 0.6em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

	.user-name{
	}

  .user-screen-name {
      font-weight: lighter;
      font-size: 15px;
      padding-right: 0.1em;
      flex: 0 0 auto;
  }

  .user-interactions {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;

    div {
      flex: 1;
    }
    margin-top: 0.7em;
    margin-bottom: -1.0em;

    .following {
      color: white;
      font-size: 14px;
      flex: 0 0 100%;
      margin: -0.7em 0.0em 0.3em 0.0em;
      padding-left: 16px;
      text-align: left;
    }

    .mute {
      max-width: 220px;
      min-height: 28px;
    }

    .follow {
      max-width: 220px;
      min-height: 28px;
    }

    button {
      border: solid;
      border-width: 1px;
      width: 92%;
      height: 100%;
    }
    .pressed {
      border: solid;
      border-width: 1px;
    }
  }
}

.user-counts {
    display: flex;
    line-height:16px;
    padding: 1em 1.5em 0em 1em;
    text-align: center;
}

.user-count {
    flex: 1;

    h5 {
    	font-size:1em;
        font-weight: bolder;
        margin: 0 0 0.25em;
    }
}

.dailyAvg {
  font-size: 0.8em;
  opacity: 0.5;
}
</style>
