<template>
  <div>
    <div class="panel panel-default side-drawer" :class="{'side-drawer-closed': closed}">
      <ul>
        <li v-if='currentUser'>
          <router-link @click.native="activatePanel('timeline')" to='/main/friends'>
            {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link @click.native="activatePanel('timeline')" :to="{ name: 'mentions', params: { username: currentUser.screen_name } }">
            {{ $t("nav.mentions") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link @click.native="activatePanel('timeline')" :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            {{ $t("nav.dms") }}
          </router-link>
        </li>
        <li v-if='currentUser && currentUser.locked'>
          <router-link @click.native="activatePanel('timeline')" to='/friend-requests'>
            {{ $t("nav.friend_requests") }}
          </router-link>
        </li>
        <li>
          <router-link @click.native="activatePanel('timeline')" to='/main/public'>
            {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li>
          <router-link @click.native="activatePanel('timeline')" to='/main/all'>
            {{ $t("nav.twkn") }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./side_drawer.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.side-drawer {
  height: 100%; /* 100% Full-height */
  position: fixed; /* Stay in place */
  z-index: 1000; /* Stay on top */
  top: 0; /* Stay at the top */
  left: -200px;
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  margin: 0;
  padding-left: 200px;
}

.side-drawer-closed {
  left: calc(-100% - 200px);
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
    background-color: $fallback--lightBg;
    background-color: var(--lightBg, $fallback--lightBg);

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
