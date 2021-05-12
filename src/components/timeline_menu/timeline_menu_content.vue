<template>
  <ul>
    <li v-if="currentUser">
      <router-link
        class="menu-item"
        :to="{ name: 'friends' }"
      >
        <FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding "
          icon="home"
        />{{ $t("nav.home_timeline") }}
      </router-link>
    </li>
    <li v-if="currentUser">
      <router-link
        class="menu-item"
        :to="{ name: 'bookmarks'}"
      >
        <FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding "
          icon="bookmark"
        />{{ $t("nav.bookmarks") }}
      </router-link>
    </li>
    <li v-if="currentUser">
      <router-link
        class="menu-item"
        :to="{ name: 'dms', params: { username: currentUser.screen_name } }"
      >
        <FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding "
          icon="envelope"
        />{{ $t("nav.dms") }}
      </router-link>
    </li>
    <li v-if="currentUser || !privateMode">
      <router-link
        class="menu-item"
        :to="{ name: 'public-timeline' }"
      >
        <FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding "
          icon="users"
        />{{ $t("nav.public_tl") }}
      </router-link>
    </li>
    <li v-if="federating && (currentUser || !privateMode)">
      <router-link
        class="menu-item"
        :to="{ name: 'public-external-timeline' }"
      >
        <FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding "
          icon="globe"
        />{{ $t("nav.twkn") }}
      </router-link>
    </li>
  </ul>
</template>

<script src="./timeline_menu_content.js" ></script>
