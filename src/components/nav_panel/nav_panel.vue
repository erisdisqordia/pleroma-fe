<template>
  <div class="nav-panel">
    <div class="panel panel-default">
      <ul>
        <li v-if="currentUser">
          <router-link :to="{ name: 'friends' }">
            <i class="button-icon icon-home-2" /> {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'interactions', params: { username: currentUser.screen_name } }">
            <i class="button-icon icon-bell-alt" /> {{ $t("nav.interactions") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            <i class="button-icon icon-mail-alt" /> {{ $t("nav.dms") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'bookmarks'}">
            <i class="button-icon icon-bookmark" /> {{ $t("nav.bookmarks") }}
          </router-link>
        </li>
        <li v-if="currentUser && currentUser.locked">
          <router-link :to="{ name: 'friend-requests' }">
            <i class="button-icon icon-user-plus" /> {{ $t("nav.friend_requests") }}
            <span
              v-if="followRequestCount > 0"
              class="badge follow-request-count"
            >
              {{ followRequestCount }}
            </span>
          </router-link>
        </li>
        <li v-if="currentUser || !privateMode">
          <router-link :to="{ name: 'public-timeline' }">
            <i class="button-icon icon-users" /> {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li v-if="federating && (currentUser || !privateMode)">
          <router-link :to="{ name: 'public-external-timeline' }">
            <i class="button-icon icon-globe" /> {{ $t("nav.twkn") }}
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'about' }">
            <i class="button-icon icon-info-circled" /> {{ $t("nav.about") }}
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

.follow-request-count {
  margin: -6px 10px;
  background-color: $fallback--bg;
  background-color: var(--input, $fallback--faint);
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
    background-color: var(--selectedMenu, $fallback--lightBg);
    color: $fallback--link;
    color: var(--selectedMenuText, $fallback--link);
    --faint: var(--selectedMenuFaintText, $fallback--faint);
    --faintLink: var(--selectedMenuFaintLink, $fallback--faint);
    --lightText: var(--selectedMenuLightText, $fallback--lightText);
    --icon: var(--selectedMenuIcon, $fallback--icon);
  }

  &.router-link-active {
    font-weight: bolder;
    background-color: $fallback--lightBg;
    background-color: var(--selectedMenu, $fallback--lightBg);
    color: $fallback--text;
    color: var(--selectedMenuText, $fallback--text);
    --faint: var(--selectedMenuFaintText, $fallback--faint);
    --faintLink: var(--selectedMenuFaintLink, $fallback--faint);
    --lightText: var(--selectedMenuLightText, $fallback--lightText);
    --icon: var(--selectedMenuIcon, $fallback--icon);

    &:hover {
      text-decoration: underline;
    }
  }
}

.nav-panel .button-icon:before {
  width: 1.1em;
}
</style>
