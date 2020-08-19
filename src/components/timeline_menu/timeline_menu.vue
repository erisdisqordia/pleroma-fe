<template>
  <Popover
    trigger="click"
    class="timeline-menu"
    :class="{ 'open': isOpen }"
    :margin="{ left: -15, right: -200 }"
    :bound-to="{ x: 'container' }"
    popover-class="timeline-menu-popover-wrap"
    @show="openMenu"
    @close="() => isOpen = false"
  >
    <div
      slot="content"
      class="timeline-menu-popover panel panel-default"
    >
      <ul>
        <li v-if="currentUser">
          <router-link :to="{ name: 'friends' }">
            <i class="button-icon icon-home-2" />{{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'bookmarks'}">
            <i class="button-icon icon-bookmark" />{{ $t("nav.bookmarks") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            <i class="button-icon icon-mail-alt" />{{ $t("nav.dms") }}
          </router-link>
        </li>
        <li v-if="currentUser || !privateMode">
          <router-link :to="{ name: 'public-timeline' }">
            <i class="button-icon icon-users" />{{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li v-if="federating && (currentUser || !privateMode)">
          <router-link :to="{ name: 'public-external-timeline' }">
            <i class="button-icon icon-globe" />{{ $t("nav.twkn") }}
          </router-link>
        </li>
      </ul>
    </div>
    <div
      slot="trigger"
      class="title timeline-menu-title"
    >
      <span>{{ timelineName() }}</span>
      <i class="icon-down-open" />
    </div>
  </Popover>
</template>

<script src="./timeline_menu.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.timeline-menu {
  flex-shrink: 1;
  margin-right: auto;
  min-width: 0;
  width: 24rem;
  .timeline-menu-popover-wrap {
    overflow: hidden;
    // Match panel heading padding to line up menu with bottom of heading
    margin-top: 0.6rem;
    padding: 0 15px 15px 15px;
  }
  .timeline-menu-popover {
    width: 24rem;
    max-width: 100vw;
    margin: 0;
    font-size: 1rem;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    transform: translateY(-100%);
    transition: transform 100ms;
  }
  .panel::after {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
  &.open .timeline-menu-popover {
    transform: translateY(0);
  }

  .timeline-menu-title {
    margin: 0;
    cursor: pointer;
    display: flex;
    user-select: none;
    width: 100%;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    i {
      margin-left: 0.6em;
      flex-shrink: 0;
      font-size: 1rem;
      transition: transform 100ms;
    }
  }

  &.open .timeline-menu-title i {
    color: $fallback--text;
    color: var(--panelText, $fallback--text);
    transform: rotate(180deg);
  }

  .panel {
    box-shadow: var(--popoverShadow);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    border-bottom: 1px solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    padding: 0;

    &:last-child a {
      border-bottom-right-radius: $fallback--panelRadius;
      border-bottom-right-radius: var(--panelRadius, $fallback--panelRadius);
      border-bottom-left-radius: $fallback--panelRadius;
      border-bottom-left-radius: var(--panelRadius, $fallback--panelRadius);
    }

    &:last-child {
      border: none;
    }

    i {
      margin: 0 0.5em;
    }
  }

  a {
    display: block;
    padding: 0.6em 0;

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
}

</style>
