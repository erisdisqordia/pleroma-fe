<template>
  <div>
    <nav
      id="nav"
      class="nav-bar container"
      :class="{ 'mobile-hidden': isChat }"
    >
      <div
        class="mobile-inner-nav"
        @click="scrollToTop()"
      >
        <div class="item">
          <a
            href="#"
            class="mobile-nav-button"
            @click.stop.prevent="toggleMobileSidebar()"
          >
            <i class="button-icon icon-menu" />
          </a>
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
          <a
            v-if="currentUser"
            class="mobile-nav-button"
            href="#"
            @click.stop.prevent="openMobileNotifications()"
          >
            <i class="button-icon icon-bell-alt" />
            <div
              v-if="unseenNotificationsCount"
              class="alert-dot"
            />
          </a>
        </div>
      </div>
    </nav>
    <div
      v-if="currentUser"
      class="mobile-notifications-drawer"
      :class="{ 'closed': !notificationsOpen }"
      @touchstart.stop="notificationsTouchStart"
      @touchmove.stop="notificationsTouchMove"
    >
      <div class="mobile-notifications-header">
        <span class="title">{{ $t('notifications.notifications') }}</span>
        <a
          class="mobile-nav-button"
          @click.stop.prevent="closeMobileNotifications()"
        >
          <i class="button-icon icon-cancel" />
        </a>
      </div>
      <div
        class="mobile-notifications"
        @scroll="onScroll"
      >
        <Notifications
          ref="notifications"
          :no-heading="true"
        />
      </div>
    </div>
    <SideDrawer
      ref="sideDrawer"
      :logout="logout"
    />
  </div>
</template>

<script src="./mobile_nav.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.mobile-inner-nav {
  width: 100%;
  display: flex;
  align-items: center;
}

.mobile-nav-button {
  display: flex;
  justify-content: center;
  width: 50px;
  position: relative;
  cursor: pointer;
}

.alert-dot {
  border-radius: 100%;
  height: 8px;
  width: 8px;
  position: absolute;
  left: calc(50% - 4px);
  top: calc(50% - 4px);
  margin-left: 6px;
  margin-top: -6px;
  background-color: $fallback--cRed;
  background-color: var(--badgeNotification, $fallback--cRed);
}

.mobile-notifications-drawer {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 1px 1px 4px rgba(0,0,0,.6);
  box-shadow: var(--panelShadow);
  transition-property: transform;
  transition-duration: 0.25s;
  transform: translateX(0);
  z-index: 1001;
  -webkit-overflow-scrolling: touch;

  &.closed {
    transform: translateX(100%);
  }
}

.mobile-notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: absolute;
  color: var(--topBarText);
  background-color: $fallback--fg;
  background-color: var(--topBar, $fallback--fg);
  box-shadow: 0px 0px 4px rgba(0,0,0,.6);
  box-shadow: var(--topBarShadow);

  .title {
    font-size: 1.3em;
    margin-left: 0.6em;
  }
}

.mobile-notifications {
  margin-top: 50px;
  width: 100vw;
  height: calc(100vh - 50px);
  overflow-x: hidden;
  overflow-y: scroll;

  color: $fallback--text;
  color: var(--text, $fallback--text);
  background-color: $fallback--bg;
  background-color: var(--bg, $fallback--bg);

  .notifications {
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    .panel {
      border-radius: 0;
      margin: 0;
      box-shadow: none;
    }
    .panel:after {
      border-radius: 0;
    }
    .panel .panel-heading {
      border-radius: 0;
      box-shadow: none;
    }
  }
}

</style>
