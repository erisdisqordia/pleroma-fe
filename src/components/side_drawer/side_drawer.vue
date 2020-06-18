<template>
  <div
    class="side-drawer-container"
    :class="{ 'side-drawer-container-closed': closed, 'side-drawer-container-open': !closed }"
  >
    <div
      class="side-drawer-darken"
      :class="{ 'side-drawer-darken-closed': closed}"
    />
    <div
      class="side-drawer"
      :class="{'side-drawer-closed': closed}"
      @touchstart="touchStart"
      @touchmove="touchMove"
    >
      <div
        class="side-drawer-heading"
        @click="toggleDrawer"
      >
        <UserCard
          v-if="currentUser"
          :user-id="currentUser.id"
          :hide-bio="true"
        />
        <div
          v-else
          class="side-drawer-logo-wrapper"
        >
          <img :src="logo">
          <span v-if="!hideSitename">{{ sitename }}</span>
        </div>
      </div>
      <ul>
        <li
          v-if="!currentUser"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'login' }">
            <i class="button-icon icon-login" /> {{ $t("login.login") }}
          </router-link>
        </li>
        <li
          v-if="currentUser"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            <i class="button-icon icon-mail-alt" /> {{ $t("nav.dms") }}
          </router-link>
        </li>
        <li
          v-if="currentUser"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'interactions', params: { username: currentUser.screen_name } }">
            <i class="button-icon icon-bell-alt" /> {{ $t("nav.interactions") }}
          </router-link>
        </li>
      </ul>
      <ul>
        <li
          v-if="currentUser"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'friends' }">
            <i class="button-icon icon-home-2" /> {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li
          v-if="currentUser && currentUser.locked"
          @click="toggleDrawer"
        >
          <router-link to="/friend-requests">
            <i class="button-icon icon-user-plus" /> {{ $t("nav.friend_requests") }}
            <span
              v-if="followRequestCount > 0"
              class="badge follow-request-count"
            >
              {{ followRequestCount }}
            </span>
          </router-link>
        </li>
        <li
          v-if="currentUser || !privateMode"
          @click="toggleDrawer"
        >
          <router-link to="/main/public">
            <i class="button-icon icon-users" /> {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li
          v-if="federating && (currentUser || !privateMode)"
          @click="toggleDrawer"
        >
          <router-link to="/main/all">
            <i class="button-icon icon-globe" /> {{ $t("nav.twkn") }}
          </router-link>
        </li>
        <li
          v-if="currentUser && chat"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'chat' }">
            <i class="button-icon icon-chat" /> {{ $t("nav.chat") }}
          </router-link>
        </li>
      </ul>
      <ul>
        <li
          v-if="currentUser || !privateMode"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'search' }">
            <i class="button-icon icon-search" /> {{ $t("nav.search") }}
          </router-link>
        </li>
        <li
          v-if="currentUser && suggestionsEnabled"
          @click="toggleDrawer"
        >
          <router-link :to="{ name: 'who-to-follow' }">
            <i class="button-icon icon-user-plus" /> {{ $t("nav.who_to_follow") }}
          </router-link>
        </li>
        <li @click="toggleDrawer">
          <a
            href="#"
            @click="openSettingsModal"
          >
            <i class="button-icon icon-cog" /> {{ $t("settings.settings") }}
          </a>
        </li>
        <li @click="toggleDrawer">
          <router-link :to="{ name: 'about'}">
            <i class="button-icon icon-info-circled" /> {{ $t("nav.about") }}
          </router-link>
        </li>
        <li
          v-if="currentUser && currentUser.role === 'admin'"
          @click="toggleDrawer"
        >
          <a
            href="/pleroma/admin/#/login-pleroma"
            target="_blank"
          >
            <i class="button-icon icon-gauge" /> {{ $t("nav.administration") }}
          </a>
        </li>
        <li
          v-if="currentUser"
          @click="toggleDrawer"
        >
          <a
            href="#"
            @click="doLogout"
          >
            <i class="button-icon icon-logout" /> {{ $t("login.logout") }}
          </a>
        </li>
      </ul>
    </div>
    <div
      class="side-drawer-click-outside"
      :class="{'side-drawer-click-outside-closed': closed}"
      @click.stop.prevent="toggleDrawer"
    />
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
  transition-duration: 0s;
  transition-property: transform;
}

.side-drawer-container-open {
  transform: translate(0%);
}

.side-drawer-container-closed {
  transition-delay: 0.35s;
  transform: translate(-100%);
}

.side-drawer-darken {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: -1;
  transition: 0.35s;
  transition-property: background-color;
  background-color: rgba(0, 0, 0, 0.5);
}

.side-drawer-darken-closed {
  background-color: rgba(0, 0, 0, 0);
}

.side-drawer-click-outside {
  flex: 1 1 100%;
}

.side-drawer {
  overflow-x: hidden;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition: 0.35s;
  transition-property: transform;
  margin: 0 0 0 -100px;
  padding: 0 0 1em 100px;
  width: 80%;
  max-width: 20em;
  flex: 0 0 80%;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  box-shadow: var(--panelShadow);
  background-color: $fallback--bg;
  background-color: var(--popover, $fallback--bg);
  color: $fallback--link;
  color: var(--popoverText, $fallback--link);
  --faint: var(--popoverFaintText, $fallback--faint);
  --faintLink: var(--popoverFaintLink, $fallback--faint);
  --lightText: var(--popoverLightText, $fallback--lightText);
  --icon: var(--popoverIcon, $fallback--icon);

  .button-icon:before {
    width: 1.1em;
  }
}

.side-drawer-logo-wrapper {
  display: flex;
  align-items: center;
  padding: 0.85em;

  img {
    flex: none;
    height: 50px;
    margin-right: 0.85em;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
  padding: 0;
  margin: 0;
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
      background-color: var(--selectedMenuPopover, $fallback--lightBg);
      color: $fallback--text;
      color: var(--selectedMenuPopoverText, $fallback--text);
      --faint: var(--selectedMenuPopoverFaintText, $fallback--faint);
      --faintLink: var(--selectedMenuPopoverFaintLink, $fallback--faint);
      --lightText: var(--selectedMenuPopoverLightText, $fallback--lightText);
      --icon: var(--selectedMenuPopoverIcon, $fallback--icon);
    }
  }
}
</style>
