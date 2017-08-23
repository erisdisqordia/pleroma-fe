<template>
  <div id="heading" class="profile-panel-background" :style="headingStyle">
    <div class="panel-heading text-center">
      <div class='user-info'>
        <router-link to='/user-settings' style="float: right;" v-if="!isOtherUser">
          <i class="icon-cog usersettings"></i>
        </router-link>
        <div class='container'>
          <router-link :to="{ name: 'user-profile', params: { id: user.id } }">
            <img :src="user.profile_image_url_original">
          </router-link>
          <span class="glyphicon glyphicon-user"></span>
          <div class="name-and-screen-name">
            <div class='user-name'>{{user.name}}</div>
            <router-link :to="{ name: 'user-profile', params: { id: user.id } }">
              <div class='user-screen-name'>@{{user.screen_name}}</div>
            </router-link>
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
        <div class="user-count base04">
          <a href="#" v-on:click.prevent="setProfileView('statuses')" v-if="switcher"><h5 class="base05">Statuses</h5></a>
          <h5 v-else>Statuses</h5>
          <span class="base05">{{user.statuses_count}} <br><span class="dailyAvg">{{dailyAvg}} per day</span></span>
        </div>
        <div class="user-count">
          <a href="#" v-on:click.prevent="setProfileView('friends')" v-if="switcher"><h5 class="base05">Following</h5></a>
          <h5 v-else>Following</h5>
          <span class="base05">{{user.friends_count}}</span>
        </div>
        <div class="user-count">
          <a href="#" v-on:click.prevent="setProfileView('followers')" v-if="switcher"><h5 class="base05">Followers</h5></a>
          <h5 v-else>Followers</h5>
          <span class="base05">{{user.followers_count}}</span>
        </div>
      </div>
      <p>{{user.description}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: [ 'user', 'switcher' ],
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
      },
      setProfileView (v) {
        const store = this.$store
        store.commit('setProfileView', { v })
      }
    }
  }
</script>

<style lang="scss">
@import '../../_variables.scss';
  
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
  padding: 0 16px 16px 16px;
  margin-bottom: -4em;

  .usersettings {
    color: white;
    opacity: 0.8;
  }

  .container{
    padding: 16px 10px 4px 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    max-height: 56px;
    overflow: hidden;
  }

  img {
    border-radius: 5px;
    flex: 1 0 100%;
    width: 56px;
    height: 56px;
    box-shadow: 0px 1px 8px rgba(0,0,0,0.75);
    object-fit: cover;
  }

	text-shadow: 0px 1px 1.5px rgba(0, 0, 0, 1.0);

  .name-and-screen-name {
    display: block;
    margin-left: 0.6em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

	.user-name{
      color: white;
	}

  .user-screen-name {
      color: white;
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
      width: 92%;
      height: 100%;
    }
    .pressed {
      border-bottom-color: rgba(255, 255, 255, 0.2);
      border-top-color: rgba(0, 0, 0, 0.2);
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
    a {
        text-decoration: none;
    }
}

.dailyAvg {
  font-size: 0.8em;
  opacity: 0.5;
}
</style>
