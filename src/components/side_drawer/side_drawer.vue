<template>
  <div class="side-drawer-container"
    :class="{ 'side-drawer-container-closed': closed, 'side-drawer-container-open': !closed }"
  >
    <div class="side-drawer"
      :class="{'side-drawer-closed': closed}"
      @touchstart="touchStart"
      @touchmove="touchMove"
    >
      <div class="side-drawer-heading" @click="toggleDrawer">
        <user-card-content :user="currentUser" :switcher="false" :hideBio="true" v-if="currentUser">
        </user-card-content>
      </div>
      <ul>
        <li v-if="currentUser" @click="toggleDrawer">
          <router-link :to="{ name: 'new-status', params: { username: currentUser.screen_name } }">
            {{ $t("post_status.new_status") }}
          </router-link>
        </li>
        <li v-else @click="toggleDrawer">
          <router-link :to="{ name: 'login' }">
            {{ $t("login.login") }}
          </router-link>
        </li>
        <li v-if="currentUser" @click="toggleDrawer">
          <router-link :to="{ name: 'notifications', params: { username: currentUser.screen_name } }">
            {{ $t("notifications.notifications") }} {{ unseenNotificationsCount > 0 ? `(${unseenNotificationsCount})` : '' }}
          </router-link>
        </li>
        <li v-if="currentUser" @click="toggleDrawer">
          <router-link :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            {{ $t("nav.dms") }}
          </router-link>
        </li>
      </ul>
      <ul>
        <li v-if="currentUser" @click="toggleDrawer">
          <router-link :to="{ name: 'friends' }">
            {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if="currentUser && currentUser.locked" @click="toggleDrawer">
          <router-link to='/friend-requests'>
            {{ $t("nav.friend_requests") }}
          </router-link>
        </li>
        <li @click="toggleDrawer">
          <router-link to='/main/public'>
            {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li @click="toggleDrawer">
          <router-link to='/main/all'>
            {{ $t("nav.twkn") }}
          </router-link>
        </li>
        <li v-if="currentUser && chat" @click="toggleDrawer">
          <router-link :to="{ name: 'chat' }">
            {{ $t("nav.chat") }}
          </router-link>
        </li>
      </ul>
      <ul>
        <li @click="toggleDrawer">
          <router-link :to="{ name: 'user-search' }">
            {{ $t("nav.user_search") }}
          </router-link>
        </li>
        <li v-if="currentUser && suggestionsEnabled" @click="toggleDrawer">
          <router-link :to="{ name: 'who-to-follow' }">
            {{ $t("nav.who_to_follow") }}
          </router-link>
        </li>
        <li @click="toggleDrawer">
          <router-link :to="{ name: 'settings' }">
            {{ $t("settings.settings") }}
          </router-link>
        </li>
        <li @click="toggleDrawer">
          <router-link :to="{ name: 'about'}">
            {{ $t("nav.about") }}
          </router-link>
        </li>
        <li v-if="currentUser" @click="toggleDrawer">
          <a @click="doLogout" href="#">
            {{ $t("login.logout") }}
          </a>
        </li>
      </ul>
    </div>
    <div class="side-drawer-click-outside"
      @click.stop.prevent="toggleDrawer"
      :class="{'side-drawer-click-outside-closed': closed}"
    ></div>
  </div>
</template>

<script src="./side_drawer.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.side-drawer-container {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
}

.side-drawer-container-open {
  transition-delay: 0.0s;
  transition-property: left;
}

.side-drawer-container-closed {
  left: -100%;
  transition-delay: 0.5s;
  transition-property: left;
}

.side-drawer-click-outside {
  flex: 1 1 100%;
}

.side-drawer {
  overflow-x: hidden;
  transition: 0.35s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  margin: 0 0 0 -100px;
  padding: 0 0 1em 100px;
  width: 80%;
  max-width: 20em;
  flex: 0 0 80%;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  box-shadow: var(--panelShadow);
  background-color: $fallback--bg;
  background-color: var(--bg, $fallback--bg);
}

.side-drawer-click-outside-closed {
  flex: 0 0 0;
}

.side-drawer-closed {
  transform: translate(-100%);
}

.side-drawer-heading {
  background: transparent;
  flex-direction: column;
  align-items: stretch;
  display: flex;
  min-height: 7em;
  padding: 0;
  margin: 0;

  .profile-panel-background {
    border-radius: 0;
    .panel-heading {
      background: transparent;
      flex-direction: column;
      align-items: stretch;
    }
  }
}

.side-drawer ul {
  list-style: none;
  margin: 0;
  padding: 0;

  border-bottom: 1px solid;
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
  margin: 0.2em 0;
}

.side-drawer ul:last-child {
  border: 0;
}

.side-drawer li {
  padding: 0;

  a {
    display: block;
    padding: 0.5em 0.85em;

    &:hover {
      background-color: $fallback--lightBg;
      background-color: var(--lightBg, $fallback--lightBg);
    }
  }
}
</style>
