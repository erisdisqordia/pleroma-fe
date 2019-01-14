<template>
  <div id="app" v-bind:style="style">
    <nav class='nav-bar container' @click="scrollToTop()" id="nav">
      <div class='logo' :style='logoBgStyle'>
        <div class='mask' :style='logoMaskStyle'></div>
        <img :src='logo' :style='logoStyle'>
      </div>
      <div class='inner-nav'>
        <div class='item'>
          <a href="#" class="menu-button" @click.stop.prevent="toggleMobileSidebar()">
            <i class="button-icon icon-menu"></i>
            <div class="alert-dot" v-if="unseenNotificationsCount"></div>
          </a>
          <router-link class="site-name" :to="{ name: 'root' }" active-class="home">{{sitename}}</router-link>
        </div>
        <div class='item right'>
          <user-finder class="button-icon nav-icon mobile-hidden" @toggled="onFinderToggled"></user-finder>
          <router-link class="mobile-hidden" :to="{ name: 'settings'}"><i class="button-icon icon-cog nav-icon" :title="$t('nav.preferences')"></i></router-link>
          <a href="#" class="mobile-hidden" v-if="currentUser" @click.prevent="logout"><i class="button-icon icon-logout nav-icon" :title="$t('login.logout')"></i></a>
        </div>
      </div>
    </nav>
    <div v-if="" class="container" id="content">
      <side-drawer ref="sideDrawer" :logout="logout"></side-drawer>
      <div class="sidebar-flexer mobile-hidden">
        <div class="sidebar-bounds">
          <div class="sidebar-scroller">
            <div class="sidebar">
              <user-panel></user-panel>
              <nav-panel></nav-panel>
              <instance-specific-panel v-if="showInstanceSpecificPanel"></instance-specific-panel>
              <features-panel v-if="!currentUser"></features-panel>
              <who-to-follow-panel v-if="currentUser && suggestionsEnabled"></who-to-follow-panel>
              <notifications v-if="currentUser"></notifications>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
      <media-modal></media-modal>
    </div>
    <chat-panel :floating="true" v-if="currentUser && chat" class="floating-chat mobile-hidden"></chat-panel>
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
