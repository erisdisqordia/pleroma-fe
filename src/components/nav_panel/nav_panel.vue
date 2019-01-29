<template>
  <div class="nav-panel">
    <div class="panel panel-default">
      <ul>
        <li v-if='currentUser'>
          <router-link :to="{ name: 'friends' }">
            {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link :to="{ name: 'mentions', params: { username: currentUser.screen_name } }">
            {{ $t("nav.mentions") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            {{ $t("nav.dms") }}
          </router-link>
        </li>
        <li v-if='currentUser && currentUser.locked'>
          <router-link :to="{ name: 'friend-requests' }">
            {{ $t("nav.friend_requests") }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'public-timeline' }">
            {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'public-external-timeline' }">
            {{ $t("nav.twkn") }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./nav_panel.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.nav-panel .panel {
  overflow: hidden;
  box-shadow: var(--panelShadow);
}
.nav-panel ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-panel li {
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

.nav-panel li:last-child {
  border: none;
}

.nav-panel a {
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
