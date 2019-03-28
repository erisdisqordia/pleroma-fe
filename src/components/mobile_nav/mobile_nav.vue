<template>
  <nav class='nav-bar container' id="nav">
    <div class='mobile-inner-nav' @click="scrollToTop()">
      <div class='item'>
        <a href="#" class="mobile-nav-button" @click.stop.prevent="toggleMobileSidebar()">
          <i class="button-icon icon-menu"></i>
        </a>
        <router-link class="site-name" :to="{ name: 'root' }" active-class="home">{{sitename}}</router-link>
      </div>
      <div class='item right'>
        <a class="mobile-nav-button" v-if="currentUser" href="#" @click.stop.prevent="openMobileNotifications()">
          <i class="button-icon icon-bell-alt"></i>
          <div class="alert-dot" v-if="unseenNotificationsCount"></div>
        </a>
      </div>
    </div>
    <SideDrawer ref="sideDrawer" :logout="logout"/>
    <div v-if="currentUser"
      class="mobile-notifications-drawer"
      :class="{ 'closed': !notificationsOpen }"
      @touchstart="notificationsTouchStart"
      @touchmove="notificationsTouchMove"
    >
      <div class="mobile-notifications-header">
        <span class="title">{{$t('notifications.notifications')}}</span>
        <a class="mobile-nav-button" @click.stop.prevent="closeMobileNotifications()">
          <i class="button-icon icon-cancel"/>
        </a>
      </div>
      <div v-if="currentUser" class="mobile-notifications">
        <Notifications ref="notifications" noHeading="true"/>
      </div>
    </div>
    <MobilePostStatusModal />
  </nav>
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
