<template>
  <div id="heading" class="profile-panel-background" :style="headingStyle">
    <div class="panel-heading text-center">
      <div class='user-info'>
        <router-link to='/user-settings' style="float: right; margin-top:16px;" v-if="!isOtherUser">
          <i class="icon-cog usersettings"></i>
        </router-link>
        <a :href="user.statusnet_profile_url" target="_blank" style="float: right; margin-top:16px;" v-if="isOtherUser">
          <i class="icon-link-ext usersettings"></i>
        </a>
        <div class='container'>
          <router-link :to="{ name: 'user-profile', params: { id: user.id } }">
            <StillImage class="avatar" :src="user.profile_image_url_original"/>
          </router-link>
          <div class="name-and-screen-name">
            <div :title="user.name" class='user-name'>{{user.name}}</div>
            <router-link class='user-screen-name':to="{ name: 'user-profile', params: { id: user.id } }">
              <span>@{{user.screen_name}}</span>
              <span class="dailyAvg">{{dailyAvg}} {{ $t('user_card.per_day') }}</span>
            </router-link>
          </div>
        </div>
        <div v-if="isOtherUser" class="user-interactions">
          <div v-if="user.follows_you && loggedIn" class="following">
            {{ $t('user_card.follows_you') }}
          </div>
          <div class="follow" v-if="loggedIn">
            <span v-if="user.following">
              <!--Following them!-->
              <button @click="unfollowUser" class="pressed">
                {{ $t('user_card.following') }}
              </button>
            </span>
            <span v-if="!user.following">
              <button @click="followUser">
                {{ $t('user_card.follow') }}
              </button>
            </span>
          </div>
          <div class='mute' v-if='isOtherUser'>
            <span v-if='user.muted'>
              <button @click="toggleMute" class="pressed">
                {{ $t('user_card.muted') }}
              </button>
            </span>
            <span v-if='!user.muted'>
              <button @click="toggleMute">
                {{ $t('user_card.mute') }}
              </button>
            </span>
          </div>
          <div class="remote-follow" v-if='!loggedIn && user.is_local'>
            <form method="POST" :action='subscribeUrl'>
              <input type="hidden" name="nickname" :value="user.screen_name">
              <input type="hidden" name="profile" value="">
              <button click="submit" class="remote-button">
                {{ $t('user_card.remote_follow') }}
              </button>
            </form>
          </div>
          <div class='block' v-if='isOtherUser && loggedIn'>
            <span v-if='user.statusnet_blocking'>
              <button @click="unblockUser" class="pressed">
                {{ $t('user_card.blocked') }}
              </button>
            </span>
            <span v-if='!user.statusnet_blocking'>
              <button @click="blockUser">
                {{ $t('user_card.block') }}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body profile-panel-body">
      <div class="user-counts" :class="{clickable: switcher}">
        <div class="user-count" v-on:click.prevent="setProfileView('statuses')" :class="{selected: selected === 'statuses'}">
          <h5>{{ $t('user_card.statuses') }}</h5>
          <span>{{user.statuses_count}} <br></span>
        </div>
        <div class="user-count" v-on:click.prevent="setProfileView('friends')" :class="{selected: selected === 'friends'}">
          <h5>{{ $t('user_card.followees') }}</h5>
          <span>{{user.friends_count}}</span>
        </div>
        <div class="user-count" v-on:click.prevent="setProfileView('followers')" :class="{selected: selected === 'followers'}">
          <h5>{{ $t('user_card.followers') }}</h5>
          <span>{{user.followers_count}}</span>
        </div>
      </div>
      <p v-if="!hideBio">{{user.description}}</p>
    </div>
  </div>
</template>

<script src="./user_card_content.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.profile-panel-background {
  background-size: cover;
  border-radius: $fallback--panelRadius;
  border-radius: var(--panelRadius, $fallback--panelRadius);

  .panel-heading {
    padding: 0.6em 0em;
    text-align: center;
  }
}

.profile-panel-body {
  word-wrap: break-word;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), $fallback--bg 80%);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--bg, $fallback--bg) 80%)
}

.user-info {
  color: white;
  padding: 0 16px;

  .container {
    padding: 16px 10px 6px 10px;
    display: flex;
    max-height: 56px;
    overflow: hidden;

    .avatar {
      border-radius: $fallback--avatarRadius;
      border-radius: var(--avatarRadius, $fallback--avatarRadius);
      flex: 1 0 100%;
      width: 56px;
      height: 56px;
      box-shadow: 0px 1px 8px rgba(0,0,0,0.75);
      object-fit: cover;

      &.animated::before {
        display: none;
      }
    }
  }

  &:hover .animated.avatar {
    canvas {
      display: none;
    }
    img {
      visibility: visible;
    }
  }

  text-shadow: $usercard-text-shadow;

  .usersettings {
    color: #fff;
    opacity: .8;
  }

  .name-and-screen-name {
    display: block;
    margin-left: 0.6em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1 1 0;
  }

  .user-name{
    color: white;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .user-screen-name {
    color: white;
    display: inline-block;
    font-weight: light;
    font-size: 15px;
    padding-right: 0.1em;
  }

  .user-interactions {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;

    div {
      flex: 1;
    }

    .following {
      color: white;
      font-size: 14px;
      flex: 0 0 100%;
      margin: 0 0 .4em 0;
      padding-left: 16px;
      text-align: left;
    }

    .mute {
      max-width: 220px;
      min-height: 28px;
    }

    .remote-follow {
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

    .remote-button {
      height: 28px !important;
      width: 92%;
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
  padding: .5em 1.5em 0em 1.5em;
  text-align: center;
  justify-content: space-between;
  text-shadow: $usercard-text-shadow;

  &.clickable {
    .user-count {
      cursor: pointer;

      &:hover:not(.selected) {
        background-color: rgba(0,0,0,.1);
      }
    }
  }
}

.user-count {
  flex: 1;
  padding: .5em 0 .5em 0;
  margin: 0 .5em;

  &.selected {
    background-color: rgba(0,0,0,.35);
    border-radius: $fallback--btnRadius;
    border-radius: var(--btnRadius, $fallback--btnRadius);
  }

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
  margin-left: 1em;
  font-size: 0.7em;
  color: #CCC;
}
</style>
