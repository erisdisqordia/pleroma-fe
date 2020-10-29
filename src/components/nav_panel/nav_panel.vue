<template>
  <div class="NavPanel">
    <div class="panel panel-default">
      <ul>
        <li v-if="currentUser || !privateMode">
          <router-link
            :to="{ name: timelinesRoute }"
            :class="onTimelineRoute && 'router-link-active'"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="home"
            />{{ $t("nav.timelines") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'interactions', params: { username: currentUser.screen_name } }">
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="bell"
            />{{ $t("nav.interactions") }}
          </router-link>
        </li>
        <li v-if="currentUser && pleromaChatMessagesAvailable">
          <router-link :to="{ name: 'chats', params: { username: currentUser.screen_name } }">
            <div
              v-if="unreadChatCount"
              class="badge badge-notification unread-chat-count"
            >
              {{ unreadChatCount }}
            </div>
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="comments"
            />{{ $t("nav.chats") }}
          </router-link>
        </li>
        <li v-if="currentUser && currentUser.locked">
          <router-link :to="{ name: 'friend-requests' }">
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="user-plus"
            />{{ $t("nav.friend_requests") }}
            <span
              v-if="followRequestCount > 0"
              class="badge follow-request-count"
            >
              {{ followRequestCount }}
            </span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'about' }">
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="info-circle"
            />{{ $t("nav.about") }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./nav_panel.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.NavPanel {
  .panel {
    overflow: hidden;
    box-shadow: var(--panelShadow);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .follow-request-count {
    vertical-align: baseline;
    background-color: $fallback--bg;
    background-color: var(--input, $fallback--faint);
  }

  li {
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

  li:last-child {
    border: none;
  }

  a {
    display: block;
    box-sizing: border-box;
    align-items: stretch;
    height: 3.5em;
    line-height: 3.5em;
    padding: 0 1em;

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

  .fa-scale-110 {
    margin-right: 0.8em;
  }
}
</style>
