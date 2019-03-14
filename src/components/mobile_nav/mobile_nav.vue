<template>
  <nav class='nav-bar container asd' id="nav">
    <div class='inner-nav mobile-inner-nav' @click="scrollToTop()" :class="{ 'shifted': notificationsOpen }">
      <div class='item'>
        <a href="#" class="menu-button" @click.stop.prevent="toggleMobileSidebar()">
          <i class="button-icon icon-menu"></i>
        </a>
        <router-link class="site-name" :to="{ name: 'root' }" active-class="home">{{sitename}}</router-link>
      </div>
      <div class='item right'>
        <a href="#" class="menu-button" @click.stop.prevent="toggleMobileNotifications()">
          <i class="button-icon icon-bell-alt"></i>
          <div class="alert-dot" v-if="unseenNotificationsCount"></div>
        </a>
      </div>
      <div class="mobile-notifications-header">
        <span>Notifications</span>
        <i class="icon-cancel" @click.stop.prevent="toggleMobileNotifications()"/>
      </div>
    </div>
    <SideDrawer ref="sideDrawer" :logout="logout"/>
    <div class="mobile-notifications" :class="{ 'closed': !notificationsOpen }">
      <Notifications ref="notifications" noHeading="true"/>
    </div>
    <MobilePostStatusModal />
  </nav>
</template>

<script src="./mobile_nav.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.mobile-inner-nav {
  transition: transform 0.25s;
  &.shifted {
    transform: translateX(-100%);
  }
}

.mobile-notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 1.6em);
  height: 100%;
  margin: 0 0.8em 0 0.8em;
  position: absolute;
  font-size: 1.3em;
  color: $fallback--text;
  color: var(--text, $fallback--text);
  top: 0;
  left: 100%;
}

.menu-button {
  position: relative;
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

.mobile-notifications {
  position: fixed;
  width: 100vw;
  height: calc(100vh - 50px);
  top: 50px;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  transition-property: transform;
  transition-duration: 0.25s;
  transform: translate(0);

  color: $fallback--text;
  color: var(--text, $fallback--text);
  background-color: $fallback--bg;
  background-color: var(--bg, $fallback--bg);

  .notifications {
    margin: 0;
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

  &.closed {
    transform: translate(100%);
  }
}

</style>
