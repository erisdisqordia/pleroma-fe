<template>
  <div class="side-drawer-container" :class="{'side-drawer-container-closed': closed, 'side-drawer-container-open': !closed}">
    <div class="panel panel-default side-drawer" :class="{'side-drawer-closed': closed}">
      <ul>
        <li v-if='currentUser'>
          <a href="#" @click="gotoPanel('poststatus')">
            {{ $t("post_status.new_status") }}
          </a>
        </li>
        <li v-else>
          <a href="#" @click="gotoPanel('poststatus')">
            {{ $t("login.login") }}
          </a>
        </li>
        <li v-if='currentUser'>
          <a href="#" @click="gotoPanel('notifications')">
            {{ $t("notifications.notifications") }}
          </a>
        </li>
        <li v-if='currentUser'>
          <router-link @click.native="gotoPanel('timeline')" to='/main/friends'>
            {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link @click.native="gotoPanel('timeline')" :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            {{ $t("nav.dms") }}
          </router-link>
        </li>
        <li v-if='currentUser && currentUser.locked'>
          <router-link @click.native="gotoPanel('timeline')" to='/friend-requests'>
            {{ $t("nav.friend_requests") }}
          </router-link>
        </li>
        <li>
          <router-link @click.native="gotoPanel('timeline')" to='/main/public'>
            {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li>
          <router-link @click.native="gotoPanel('timeline')" to='/main/all'>
            {{ $t("nav.twkn") }}
          </router-link>
        </li>
        <li>
          <router-link @click.native="gotoPanel('timeline')" :to="{ name: 'settings'}">
            {{ $t("settings.settings") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <a @click="doLogout" href="#">
            {{ $t("login.logout") }}
          </a>
        </li>
      </ul>
    </div>
    <div class="side-drawer-click-outside" @click.stop.prevent="clickedOutside" :class="{'side-drawer-click-outside-closed': closed}"></div>
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
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  margin: 0 0 0 -100px;
  padding: 0 0 0 100px;
  width: 75%;
  flex: 0 0 75%;
}

.side-drawer-click-outside-closed {
  flex: 0 0 0;
}

.side-drawer-closed {
  margin: 0 0 0 calc(-100% - 100px);
}

.side-drawer .panel {
  overflow: hidden;
  margin: 0;
}
.side-drawer ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.side-drawer li {
  border-bottom: 1px solid;
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
  padding: 0;

  &:first-child a {
    border-top-right-radius: $fallback--panelRadius;
    border-top-right-radius: var(--panelRadius, $fallback--panelRadius);
    border-top-left-radius: $fallback--panelRadius;
    border-top-left-radius: var(--panelRadius, $fallback--panelRadius);
  }

  &:last-child a {
    border-bottom-right-radius: $fallback--panelRadius;
    border-bottom-right-radius: var(--panelRadius, $fallback--panelRadius);
    border-bottom-left-radius: $fallback--panelRadius;
    border-bottom-left-radius: var(--panelRadius, $fallback--panelRadius);
  }
}

.side-drawer li:last-child {
  border: none;
}

.side-drawer a {
  display: block;
  padding: 0.8em 0.85em;

  &:hover {
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);
  }

  &.router-link-active {
    font-weight: bolder;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
