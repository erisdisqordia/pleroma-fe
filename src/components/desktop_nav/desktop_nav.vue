<template>
  <nav
    id="nav"
    class="DesktopNav"
    :class="{ '-logoLeft': logoLeft }"
    @click="scrollToTop()"
  >
    <div class="inner-nav">
      <div class="item sitename">
        <router-link
          v-if="!hideSitename"
          class="site-name"
          :to="{ name: 'root' }"
          active-class="home"
        >
          <img src="/favicon.png">
          {{ sitename }}
        </router-link>
        <div
          v-if="currentUser || !privateMode"
          class="nav-items left"
        >
          <router-link
            :to="{ name: 'public-timeline' }"
            class="nav-icon"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110 fa-old-padding"
              icon="users"
              :title="$t('nav.public_tl')"
            />
          </router-link>
          <router-link
            :to="{ name: 'public-external-timeline' }"
            class="nav-icon"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110 fa-old-padding"
              icon="globe"
              :title="$t('nav.twkn')"
            />
          </router-link>
          <router-link
            :to="{ name: 'bookmarks' }"
            class="nav-icon"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110 fa-old-padding"
              icon="bookmark"
              :title="$t('nav.bookmarks')"
            />
          </router-link>
          <router-link
            class="nav-icon"
            :to="{ name: 'chats', params: { username: currentUser.screen_name } }"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110 fa-old-padding"
              icon="comments"
              :title="$t('chats.chats')"
            />
          </router-link>
        </div>
      </div>
      <router-link
        class="logo"
        :to="{ name: 'root' }"
        :style="logoBgStyle"
      >
        <div
          class="mask"
          :style="logoMaskStyle"
        />
        <img
          :src="logo"
          :style="logoStyle"
        >
      </router-link>
      <div class="item right actions">
        <search-bar
          v-if="currentUser || !privateMode"
          @toggled="onSearchBarToggled"
          @click.stop.native
        />
        <div
          v-if="currentUser || !privateMode"
          class="nav-items right"
        >
          <router-link
            class="nav-icon"
            :to="{ name: 'interactions', params: { username: currentUser.screen_name } }"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110 fa-old-padding"
              icon="bolt"
            />
          </router-link>
        </div>
        <button
          class="button-unstyled nav-icon"
          @click.stop="openSettingsModal"
        >
          <FAIcon
            fixed-width
            class="fa-scale-110 fa-old-padding"
            icon="cog"
            :title="$t('nav.preferences')"
          />
        </button>
        <a
          v-if="currentUser && currentUser.role === 'admin'"
          href="/pleroma/admin/#/login-pleroma"
          class="nav-icon"
          target="_blank"
        >
          <FAIcon
            fixed-width
            class="fa-scale-110 fa-old-padding"
            icon="tachometer-alt"
            :title="$t('nav.administration')"
          />
        </a>
        <button
          v-if="currentUser"
          class="button-unstyled nav-icon"
          @click.prevent="logout"
        >
          <FAIcon
            fixed-width
            class="fa-scale-110 fa-old-padding"
            icon="sign-out-alt"
            :title="$t('login.logout')"
          />
        </button>
      </div>
    </div>
  </nav>
</template>
<script src="./desktop_nav.js"></script>

<style src="./desktop_nav.scss" lang="scss"></style>
