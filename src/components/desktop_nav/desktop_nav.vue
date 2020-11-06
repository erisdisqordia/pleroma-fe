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
          {{ sitename }}
        </router-link>
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
        <a
          href="#"
          class="nav-icon"
          @click.stop="openSettingsModal"
        >
          <FAIcon
            fixed-width
            class="fa-scale-110 fa-old-padding"
            icon="cog"
            :title="$t('nav.preferences')"
          />
        </a>
        <a
          v-if="currentUser && currentUser.role === 'admin'"
          href="/pleroma/admin/#/login-pleroma"
          class="nav-icon"
          target="_blank"
        ><FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding"
          icon="tachometer-alt"
          :title="$t('nav.administration')"
        /></a>
        <a
          v-if="currentUser"
          href="#"
          class="nav-icon"
          @click.prevent="logout"
        ><FAIcon
          fixed-width
          class="fa-scale-110 fa-old-padding"
          icon="sign-out-alt"
          :title="$t('login.logout')"
        /></a>
      </div>
    </div>
  </nav>
</template>
<script src="./desktop_nav.js"></script>

<style src="./desktop_nav.scss" lang="scss"></style>
