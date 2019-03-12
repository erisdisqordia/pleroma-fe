<template>
  <nav class='nav-bar container' @click="scrollToTop()" id="nav">
    <div class='inner-nav'>
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
    </div>
    <SideDrawer ref="sideDrawer" :logout="logout"/>
    <div class="mobile-notifications" :class="{ 'closed': !notificationsOpen }">
      <Notifications/>
    </div>
  </nav>
</template>

<script src="./mobile_nav.js"></script>

<style lang="scss">


</style>
