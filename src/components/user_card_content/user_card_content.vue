<template>
<div id="heading" class="profile-panel-background" :style="headingStyle">
  <div class="panel-heading text-center">
    <div class='user-info'>
      <div class='container'>
        <router-link :to="userProfileLink(user)">
          <StillImage class="avatar" :class='{ "better-shadow": betterShadow }' :src="user.profile_image_url_original"/>
        </router-link>
        <div class="name-and-screen-name">
          <div class="top-line">
            <div :title="user.name" class='user-name' v-if="user.name_html" v-html="user.name_html"></div>
            <div :title="user.name" class='user-name' v-else>{{user.name}}</div>
            <router-link :to="{ name: 'user-settings' }" v-if="!isOtherUser">
              <i class="button-icon icon-cog usersettings" :title="$t('tool_tip.user_settings')"></i>
            </router-link>
            <a :href="user.statusnet_profile_url" target="_blank" v-if="isOtherUser">
              <i class="icon-link-ext usersettings"></i>
            </a>
          </div>

          <router-link class='user-screen-name' :to="userProfileLink(user)">
            <span class="handle">@{{user.screen_name}}</span><span v-if="user.locked"><i class="icon icon-lock"></i></span>
            <span v-if="!hideUserStatsLocal && !hideBio" class="dailyAvg">{{dailyAvg}} {{ $t('user_card.per_day') }}</span>
          </router-link>
        </div>
      </div>
      <div class="user-meta">
        <div v-if="user.follows_you && loggedIn && isOtherUser" class="following">
          {{ $t('user_card.follows_you') }}
        </div>
        <div class="highlighter" v-if="isOtherUser && (loggedIn || !switcher)">
          <!-- id's need to be unique, otherwise vue confuses which user-card checkbox belongs to -->
          <input class="userHighlightText" type="text" :id="'userHighlightColorTx'+user.id" v-if="userHighlightType !== 'disabled'" v-model="userHighlightColor"/>
          <input class="userHighlightCl" type="color" :id="'userHighlightColor'+user.id" v-if="userHighlightType !== 'disabled'" v-model="userHighlightColor"/>
          <label for="style-switcher" class='userHighlightSel select'>
            <select class="userHighlightSel" :id="'userHighlightSel'+user.id" v-model="userHighlightType">
              <option value="disabled">No highlight</option>
              <option value="solid">Solid bg</option>
              <option value="striped">Striped bg</option>
              <option value="side">Side stripe</option>
            </select>
            <i class="icon-down-open"/>
          </label>
        </div>
      </div>
      <div v-if="isOtherUser" class="user-interactions">
        <div class="follow" v-if="loggedIn">
          <span v-if="user.following">
            <!--Following them!-->
            <button @click="unfollowUser" class="pressed" :disabled="followRequestInProgress" :title="$t('user_card.follow_unfollow')">
              <template v-if="followRequestInProgress">
                {{ $t('user_card.follow_progress') }}
              </template>
              <template v-else>
                {{ $t('user_card.following') }}
              </template>
            </button>
          </span>
          <span v-if="!user.following">
            <button @click="followUser" :disabled="followRequestInProgress" :title="followRequestSent ? $t('user_card.follow_again') : ''">
              <template v-if="followRequestInProgress">
                {{ $t('user_card.follow_progress') }}
              </template>
              <template v-else-if="followRequestSent">
                {{ $t('user_card.follow_sent') }}
              </template>
              <template v-else>
                {{ $t('user_card.follow') }}
              </template>
            </button>
          </span>
        </div>
        <div class='mute' v-if='isOtherUser && loggedIn'>
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
  <div class="panel-body profile-panel-body" v-if="!hideBio">
    <div v-if="!hideUserStatsLocal || switcher" class="user-counts">
      <div class="user-count" v-on:click.prevent="setProfileView('statuses')">
        <h5>{{ $t('user_card.statuses') }}</h5>
        <span v-if="!hideUserStatsLocal">{{user.statuses_count}} <br></span>
      </div>
      <div class="user-count" v-on:click.prevent="setProfileView('friends')">
        <h5>{{ $t('user_card.followees') }}</h5>
        <span v-if="!hideUserStatsLocal">{{user.friends_count}}</span>
      </div>
      <div class="user-count" v-on:click.prevent="setProfileView('followers')">
        <h5>{{ $t('user_card.followers') }}</h5>
        <span v-if="!hideUserStatsLocal">{{user.followers_count}}</span>
      </div>
    </div>
    <p @click.prevent="linkClicked" v-if="!hideBio && user.description_html" class="profile-bio" v-html="user.description_html"></p>
    <p v-else-if="!hideBio" class="profile-bio">{{ user.description }}</p>
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
  overflow: hidden;

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  .panel-heading {
    padding: .5em 0;
    text-align: center;
    box-shadow: none;
  }
}

.profile-panel-body {
  word-wrap: break-word;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), $fallback--bg 80%);
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--bg, $fallback--bg) 80%);

  .profile-bio {
    text-align: center;
  }
}

.user-info {
  color: $fallback--lightText;
  color: var(--lightText, $fallback--lightText);
  padding: 0 26px;

  .container {
    padding: 16px 0 6px;
    display: flex;
    max-height: 56px;

    .avatar {
      border-radius: $fallback--avatarRadius;
      border-radius: var(--avatarRadius, $fallback--avatarRadius);
      flex: 1 0 100%;
      width: 56px;
      height: 56px;
      box-shadow: 0px 1px 8px rgba(0,0,0,0.75);
      box-shadow: var(--avatarShadow);
      object-fit: cover;

      &.better-shadow {
        box-shadow: var(--avatarShadowInset);
        filter: var(--avatarShadowFilter)
      }

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

  .usersettings {
    color: $fallback--lightText;
    color: var(--lightText, $fallback--lightText);
    opacity: .8;
  }

  .name-and-screen-name {
    display: block;
    margin-left: 0.6em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1 1 0;
    // This is so that text doesn't get overlapped by avatar's shadow if it has
    // big one
    z-index: 1;

    img {
      width: 26px;
      height: 26px;
      vertical-align: middle;
      object-fit: contain
    }
    .top-line {
      display: flex;
    }
  }

  .user-name {
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1 1 auto;
    margin-right: 1em;
  }

  .user-screen-name {
    color: $fallback--lightText;
    color: var(--lightText, $fallback--lightText);
    display: inline-block;
    font-weight: light;
    font-size: 15px;
    padding-right: 0.1em;
    width: 100%;
    display: flex;

    .dailyAvg {
      min-width: 1px;
      flex: 0 0 auto;
      margin-left: 1em;
      font-size: 0.7em;
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }

    .handle {
      min-width: 1px;
      flex: 0 1 auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .user-meta {
    margin-bottom: .15em;
    display: flex;
    align-items: baseline;
    font-size: 14px;
    line-height: 22px;
    flex-wrap: wrap;

    .following {
      flex: 1 0 auto;
      margin: 0;
      margin-bottom: .25em;
      text-align: left;
    }

    .highlighter {
      flex: 0 1 auto;
      display: flex;
      flex-wrap: wrap;
      margin-right: -.5em;
      align-self: start;

      .userHighlightCl {
        padding: 2px 10px;
        flex: 1 0 auto;
      }

      .userHighlightSel,
      .userHighlightSel.select {
        padding-top: 0;
        padding-bottom: 0;
        flex: 1 0 auto;
      }
      .userHighlightSel.select i {
        line-height: 22px;
      }

      .userHighlightText {
        width: 70px;
        flex: 1 0 auto;
      }

      .userHighlightCl,
      .userHighlightText,
      .userHighlightSel,
      .userHighlightSel.select {
        height: 22px;
        vertical-align: top;
        margin-right: .5em;
        margin-bottom: .25em;
      }
    }
  }
  .user-interactions {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;

    margin-right: -.75em;

    div {
      flex: 1 0 0;
      margin-right: .75em;
      margin-bottom: .6em;
      white-space: nowrap;
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
      width: 100%;
      height: 100%;
      margin: 0;
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
  color: $fallback--lightText;
  color: var(--lightText, $fallback--lightText);
  flex-wrap: wrap;
}

.user-count {
  flex: 1 0 auto;
  padding: .5em 0 .5em 0;
  margin: 0 .5em;

  h5 {
    font-size:1em;
    font-weight: bolder;
    margin: 0 0 0.25em;
  }
  a {
    text-decoration: none;
  }
}

.floater {
}
</style>
