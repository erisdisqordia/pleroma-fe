<template>
  <div
    class="user-card"
    :class="classes"
    :style="style"
  >
    <div class="panel-heading">
      <div class="user-info">
        <div class="container">
          <router-link :to="userProfileLink(user)">
            <UserAvatar
              :better-shadow="betterShadow"
              :user="user"
            />
          </router-link>
          <div class="user-summary">
            <div class="top-line">
              <div
                v-if="user.name_html"
                :title="user.name"
                class="user-name"
                v-html="user.name_html"
              />
              <div
                v-else
                :title="user.name"
                class="user-name"
              >
                {{ user.name }}
              </div>
              <router-link
                v-if="!isOtherUser"
                :to="{ name: 'user-settings' }"
              >
                <i
                  class="button-icon icon-wrench usersettings"
                  :title="$t('tool_tip.user_settings')"
                />
              </router-link>
              <a
                v-if="isOtherUser && !user.is_local"
                :href="user.statusnet_profile_url"
                target="_blank"
              >
                <i class="icon-link-ext usersettings" />
              </a>
            </div>

            <div class="bottom-line">
              <router-link
                class="user-screen-name"
                :to="userProfileLink(user)"
              >
                @{{ user.screen_name }}
              </router-link>
              <span
                v-if="!hideBio && !!visibleRole"
                class="alert staff"
              >{{ visibleRole }}</span>
              <span v-if="user.locked"><i class="icon icon-lock" /></span>
              <span
                v-if="!hideUserStatsLocal && !hideBio"
                class="dailyAvg"
              >{{ dailyAvg }} {{ $t('user_card.per_day') }}</span>
            </div>
          </div>
        </div>
        <div class="user-meta">
          <div
            v-if="user.follows_you && loggedIn && isOtherUser"
            class="following"
          >
            {{ $t('user_card.follows_you') }}
          </div>
          <div
            v-if="isOtherUser && (loggedIn || !switcher)"
            class="highlighter"
          >
            <!-- id's need to be unique, otherwise vue confuses which user-card checkbox belongs to -->
            <input
              v-if="userHighlightType !== 'disabled'"
              :id="'userHighlightColorTx'+user.id"
              v-model="userHighlightColor"
              class="userHighlightText"
              type="text"
            >
            <input
              v-if="userHighlightType !== 'disabled'"
              :id="'userHighlightColor'+user.id"
              v-model="userHighlightColor"
              class="userHighlightCl"
              type="color"
            >
            <label
              for="style-switcher"
              class="userHighlightSel select"
            >
              <select
                :id="'userHighlightSel'+user.id"
                v-model="userHighlightType"
                class="userHighlightSel"
              >
                <option value="disabled">No highlight</option>
                <option value="solid">Solid bg</option>
                <option value="striped">Striped bg</option>
                <option value="side">Side stripe</option>
              </select>
              <i class="icon-down-open" />
            </label>
          </div>
        </div>
        <div
          v-if="isOtherUser"
          class="user-interactions"
        >
          <div
            v-if="loggedIn"
            class="follow"
          >
            <span v-if="user.following">
              <!--Following them!-->
              <button
                class="pressed"
                :disabled="followRequestInProgress"
                :title="$t('user_card.follow_unfollow')"
                @click="unfollowUser"
              >
                <template v-if="followRequestInProgress">
                  {{ $t('user_card.follow_progress') }}
                </template>
                <template v-else>
                  {{ $t('user_card.following') }}
                </template>
              </button>
            </span>
            <span v-if="!user.following">
              <button
                :disabled="followRequestInProgress"
                :title="followRequestSent ? $t('user_card.follow_again') : ''"
                @click="followUser"
              >
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
          <div
            v-if="isOtherUser && loggedIn"
            class="mute"
          >
            <span v-if="user.muted">
              <button
                class="pressed"
                @click="unmuteUser"
              >
                {{ $t('user_card.muted') }}
              </button>
            </span>
            <span v-if="!user.muted">
              <button @click="muteUser">
                {{ $t('user_card.mute') }}
              </button>
            </span>
          </div>
          <div v-if="!loggedIn && user.is_local">
            <RemoteFollow :user="user" />
          </div>
          <div
            v-if="isOtherUser && loggedIn"
            class="block"
          >
            <span v-if="user.statusnet_blocking">
              <button
                class="pressed"
                @click="unblockUser"
              >
                {{ $t('user_card.blocked') }}
              </button>
            </span>
            <span v-if="!user.statusnet_blocking">
              <button @click="blockUser">
                {{ $t('user_card.block') }}
              </button>
            </span>
          </div>
          <div
            v-if="isOtherUser && loggedIn"
            class="block"
          >
            <span>
              <button @click="reportUser">
                {{ $t('user_card.report') }}
              </button>
            </span>
          </div>
          <ModerationTools
            v-if="loggedIn.role === &quot;admin&quot;"
            :user="user"
          />
        </div>
      </div>
    </div>
    <div
      v-if="!hideBio"
      class="panel-body"
    >
      <div
        v-if="!hideUserStatsLocal && switcher"
        class="user-counts"
      >
        <div
          class="user-count"
          @click.prevent="setProfileView('statuses')"
        >
          <h5>{{ $t('user_card.statuses') }}</h5>
          <span>{{ user.statuses_count }} <br></span>
        </div>
        <div
          class="user-count"
          @click.prevent="setProfileView('friends')"
        >
          <h5>{{ $t('user_card.followees') }}</h5>
          <span>{{ user.friends_count }}</span>
        </div>
        <div
          class="user-count"
          @click.prevent="setProfileView('followers')"
        >
          <h5>{{ $t('user_card.followers') }}</h5>
          <span>{{ user.followers_count }}</span>
        </div>
      </div>
      <p
        v-if="!hideBio && user.description_html"
        class="user-card-bio"
        @click.prevent="linkClicked"
        v-html="user.description_html"
      />
      <p
        v-else-if="!hideBio"
        class="user-card-bio"
      >
        {{ user.description }}
      </p>
    </div>
  </div>
</template>

<script src="./user_card.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-card {
  background-size: cover;
  overflow: hidden;

  .panel-heading {
    padding: .5em 0;
    text-align: center;
    box-shadow: none;
    background: transparent;
    flex-direction: column;
    align-items: stretch;
  }

  .panel-body {
    word-wrap: break-word;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), $fallback--bg 80%);
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--bg, $fallback--bg) 80%);
  }

  p {
    margin-bottom: 0;
  }

  &-bio {
    text-align: center;

    img {
      object-fit: contain;
      vertical-align: middle;
      max-width: 100%;
      max-height: 400px;

      &.emoji {
        width: 32px;
        height: 32px;
      }
    }
  }

  // Modifiers

  &-rounded-t {
    border-top-left-radius: $fallback--panelRadius;
    border-top-left-radius: var(--panelRadius, $fallback--panelRadius);
    border-top-right-radius: $fallback--panelRadius;
    border-top-right-radius: var(--panelRadius, $fallback--panelRadius);
  }

  &-rounded {
    border-radius: $fallback--panelRadius;
    border-radius: var(--panelRadius, $fallback--panelRadius);
  }

  &-bordered {
    border-width: 1px;
    border-style: solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
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
      flex: 1 0 100%;
      width: 56px;
      height: 56px;
      box-shadow: 0px 1px 8px rgba(0,0,0,0.75);
      box-shadow: var(--avatarShadow);
      object-fit: cover;
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

  .user-summary {
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
    font-size: 15px;

    img {
      object-fit: contain;
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  .bottom-line {
    display: flex;
    font-weight: light;
    font-size: 15px;

    .user-screen-name {
      min-width: 1px;
      flex: 0 1 auto;
      text-overflow: ellipsis;
      overflow: hidden;
      color: $fallback--lightText;
      color: var(--lightText, $fallback--lightText);
    }

    .dailyAvg {
      min-width: 1px;
      flex: 0 0 auto;
      margin-left: 1em;
      font-size: 0.7em;
      color: $fallback--text;
      color: var(--text, $fallback--text);
    }

    // TODO use proper colors
    .staff {
      flex: none;
      text-transform: capitalize;
      color: $fallback--text;
      color: var(--btnText, $fallback--text);
      background-color: $fallback--fg;
      background-color: var(--btn, $fallback--fg);
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
</style>
