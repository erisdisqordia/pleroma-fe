<template>
  <Popover
    trigger="click"
    class="timeline-menu"
    popover-class="nav-panel timeline-menu-popover"
  >
    <div slot="content">
      <ul>
        <li v-if="currentUser">
          <router-link :to="{ name: 'friends' }">
            <i class="button-icon icon-home-2" /> {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link :to="{ name: 'dms', params: { username: currentUser.screen_name } }">
            <i class="button-icon icon-mail-alt" /> {{ $t("nav.dms") }}
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
      </ul>
    </div>
    <div
      slot="trigger"
      class="title timeline-menu-title"
    >
      {{ timelineNamesForRoute[$route.name] }}
      <i class="icon-down-open" />
    </div>
  </Popover>
</template>

<script src="./timeline_menu.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.timeline-menu {
  flex-grow: 1;
  .timeline-menu-popover {
    width: 20rem;
    font-size: 1rem;
    margin-left: -0.6em;
    margin-top: 0.6em;
  }

  .timeline-menu-title {
    flex-grow: 0;
    width: 20rem;
    margin: 0;
  }
}

</style>
