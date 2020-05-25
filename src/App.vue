<template>
  <div
    id="app"
    :style="bgAppStyle"
  >
    <div
      id="app_bg_wrapper"
      class="app-bg-wrapper"
      :style="bgStyle"
    />
    <MobileNav v-if="isMobileLayout" />
    <nav
      v-else
      id="nav"
      class="nav-bar container"
      @click="scrollToTop()"
    >
      <div class="inner-nav">
        <div
          class="logo"
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
        </div>
        <div class="item">
          <router-link
            v-if="!hideSitename"
            class="site-name"
            :to="{ name: 'root' }"
            active-class="home"
          >
            {{ sitename }}
          </router-link>
        </div>
        <div class="item right">
          <search-bar
            v-if="currentUser || !privateMode"
            class="nav-icon mobile-hidden"
            @toggled="onSearchBarToggled"
            @click.stop.native
          />
          <a
            href="#"
            class="mobile-hidden"
            @click.stop="openSettingsModal"
          >
            <i
              class="button-icon icon-cog nav-icon"
              :title="$t('nav.preferences')"
            />
          </a>
          <a
            v-if="currentUser && currentUser.role === 'admin'"
            href="/pleroma/admin/#/login-pleroma"
            class="mobile-hidden"
            target="_blank"
          ><i
            class="button-icon icon-gauge nav-icon"
            :title="$t('nav.administration')"
          /></a>
          <a
            v-if="currentUser"
            href="#"
            class="mobile-hidden"
            @click.prevent="logout"
          ><i
            class="button-icon icon-logout nav-icon"
            :title="$t('login.logout')"
          /></a>
        </div>
      </div>
    </nav>
    <div
      id="content"
      class="container underlay"
    >
      <div
        class="sidebar-flexer mobile-hidden"
        :style="sidebarAlign"
      >
        <div class="sidebar-bounds">
          <div class="sidebar-scroller">
            <div class="sidebar">
              <user-panel />
              <div v-if="!isMobileLayout">
                <nav-panel />
                <instance-specific-panel v-if="showInstanceSpecificPanel" />
                <features-panel v-if="!currentUser && showFeaturesPanel" />
                <who-to-follow-panel v-if="currentUser && suggestionsEnabled" />
                <notifications v-if="currentUser" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div
          v-if="!currentUser"
          class="login-hint panel panel-default"
        >
          <router-link
            :to="{ name: 'login' }"
            class="panel-body"
          >
            {{ $t("login.hint") }}
          </router-link>
        </div>
        <transition name="fade">
          <router-view />
        </transition>
      </div>
      <media-modal />
    </div>
    <chat-panel
      v-if="currentUser && chat"
      :floating="true"
      class="floating-chat mobile-hidden"
    />
    <MobilePostStatusButton />
    <UserReportingModal />
    <PostStatusModal />
    <SettingsModal />
    <portal-target name="modal" />
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
