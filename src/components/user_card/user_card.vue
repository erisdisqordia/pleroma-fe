<template>
  <div
    class="user-card"
    :class="classes"
  >
    <div
      :class="{ 'hide-bio': hideBio }"
      :style="style"
      class="background-image"
    />
    <div class="panel-heading">
      <div class="user-info">
        <div class="container">
          <a
            v-if="allowZoomingAvatar"
            class="user-info-avatar-link"
            @click="zoomAvatar"
          >
            <UserAvatar
              :better-shadow="betterShadow"
              :user="user"
            />
            <div class="user-info-avatar-link-overlay">
              <i class="button-icon icon-zoom-in" />
            </div>
          </a>
          <router-link
            v-else
            :to="userProfileLink(user)"
          >
            <UserAvatar
              :better-shadow="betterShadow"
              :user="user"
            />
          </router-link>
          <div class="user-summary">
            <div class="top-line">
              <!-- eslint-disable vue/no-v-html -->
              <div
                v-if="user.name_html"
                :title="user.name"
                class="user-name"
                v-html="user.name_html"
              />
              <!-- eslint-enable vue/no-v-html -->
              <div
                v-else
                :title="user.name"
                class="user-name"
              >
                {{ user.name }}
              </div>
              <a
                v-if="isOtherUser && !user.is_local"
                :href="user.statusnet_profile_url"
                target="_blank"
              >
                <i class="icon-link-ext usersettings" />
              </a>
              <AccountActions
                v-if="isOtherUser && loggedIn"
                :user="user"
                :relationship="relationship"
              />
            </div>
            <div class="bottom-line">
              <router-link
                class="user-screen-name"
                :title="user.screen_name"
                :to="userProfileLink(user)"
              >
                @{{ user.screen_name }}
              </router-link>
              <template v-if="!hideBio">
                <span
                  v-if="!!visibleRole"
                  class="alert user-role"
                >
                  {{ visibleRole }}
                </span>
                <span
                  v-if="user.bot"
                  class="alert user-role"
                >
                  bot
                </span>
              </template>
              <span v-if="user.locked"><i class="icon icon-lock" /></span>
              <span
                v-if="!mergedConfig.hideUserStats && !hideBio"
                class="dailyAvg"
              >{{ dailyAvg }} {{ $t('user_card.per_day') }}</span>
            </div>
          </div>
        </div>
        <div class="user-meta">
          <div
            v-if="relationship.followed_by && loggedIn && isOtherUser"
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
              for="theme_tab"
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
          v-if="loggedIn && isOtherUser"
          class="user-interactions"
        >
          <div class="btn-group">
            <FollowButton :relationship="relationship" />
            <template v-if="relationship.following">
              <ProgressButton
                v-if="!relationship.subscribing"
                class="btn btn-default"
                :click="subscribeUser"
                :title="$t('user_card.subscribe')"
              >
                <i class="icon-bell-alt" />
              </ProgressButton>
              <ProgressButton
                v-else
                class="btn btn-default toggled"
                :click="unsubscribeUser"
                :title="$t('user_card.unsubscribe')"
              >
                <i class="icon-bell-ringing-o" />
              </ProgressButton>
            </template>
          </div>
          <div>
            <button
              v-if="relationship.muting"
              class="btn btn-default btn-block toggled"
              @click="unmuteUser"
            >
              {{ $t('user_card.muted') }}
            </button>
            <button
              v-else
              class="btn btn-default btn-block"
              @click="muteUser"
            >
              {{ $t('user_card.mute') }}
            </button>
          </div>
          <div>
            <button
              class="btn btn-default btn-block"
              @click="mentionUser"
            >
              {{ $t('user_card.mention') }}
            </button>
          </div>
          <ModerationTools
            v-if="loggedIn.role === &quot;admin&quot;"
            :user="user"
          />
        </div>
        <div
          v-if="!loggedIn && user.is_local"
          class="user-interactions"
        >
          <RemoteFollow :user="user" />
        </div>
      </div>
    </div>
    <div
      v-if="!hideBio"
      class="panel-body"
    >
      <div
        v-if="!mergedConfig.hideUserStats && switcher"
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
          <span>{{ hideFollowsCount ? $t('user_card.hidden') : user.friends_count }}</span>
        </div>
        <div
          class="user-count"
          @click.prevent="setProfileView('followers')"
        >
          <h5>{{ $t('user_card.followers') }}</h5>
          <span>{{ hideFollowersCount ? $t('user_card.hidden') : user.followers_count }}</span>
        </div>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <p
        v-if="!hideBio && user.description_html"
        class="user-card-bio"
        @click.prevent="linkClicked"
        v-html="user.description_html"
      />
      <!-- eslint-enable vue/no-v-html -->
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
  position: relative;

  .panel-heading {
    padding: .5em 0;
    text-align: center;
    box-shadow: none;
    background: transparent;
    flex-direction: column;
    align-items: stretch;
    // create new stacking context
    position: relative;
  }

  .panel-body {
    word-wrap: break-word;
    border-bottom-right-radius: inherit;
    border-bottom-left-radius: inherit;
    // create new stacking context
    position: relative;
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    mask: linear-gradient(to top, white, transparent) bottom no-repeat,
          linear-gradient(to top, white, white);
    // Autoprefixed seem to ignore this one, and also syntax is different
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    background-size: cover;
    mask-size: 100% 60%;
    border-top-left-radius: calc(var(--panelRadius) - 1px);
    border-top-right-radius: calc(var(--panelRadius) - 1px);
    background-color: var(--profileBg);

    &.hide-bio {
      mask-size: 100% 40px;
    }
  }

  p {
    margin-bottom: 0;
  }

  &-bio {
    text-align: center;

    a {
      color: $fallback--link;
      color: var(--postLink, $fallback--link);
    }

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
    align-items: flex-start;
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

  &:hover .avatar {
    --still-image-img: visible;
    --still-image-canvas: hidden;
  }

  &-avatar-link {
    position: relative;
    cursor: pointer;

    &-overlay {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: $fallback--avatarRadius;
      border-radius: var(--avatarRadius, $fallback--avatarRadius);
      opacity: 0;
      transition: opacity .2s ease;

      i {
        color: #FFF;
      }
    }

    &:hover &-overlay {
      opacity: 1;
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

    .user-role {
      flex: none;
      text-transform: capitalize;
      color: $fallback--text;
      color: var(--alertNeutralText, $fallback--text);
      background-color: $fallback--fg;
      background-color: var(--alertNeutral, $fallback--fg);
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
    position: relative;
    display: flex;
    flex-flow: row wrap;
    margin-right: -.75em;

    > * {
      margin: 0 .75em .6em 0;
      white-space: nowrap;
      min-width: 95px;
    }

    button {
      margin: 0;
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
