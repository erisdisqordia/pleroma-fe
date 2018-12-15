<template>
  <div id="app" v-bind:style="style">
    <nav class='container' @click="scrollToTop()" id="nav">
      <div class='logo' :style='logoBgStyle'>
        <div class='mask' :style='logoMaskStyle'></div>
        <img :src='logo' :style='logoStyle'>
      </div>
      <div class='inner-nav'>
        <div class='item'>
          <router-link class="back-button" @click.native="activatePanel('timeline')" :to="{ name: 'root' }" active-class="hidden">
            <i class="icon-left-open" :title="$t('nav.back')"></i>
          </router-link>
          <router-link class="site-name" :to="{ name: 'root' }" active-class="home">{{sitename}}</router-link>
        </div>
        <div class='item right'>
          <a href="#" @click.prevent="toggleMobileSidebar()"><i class="icon-menu"></i></a>
          <user-finder class="nav-icon" @toggled="onFinderToggled"></user-finder>
          <router-link @click.native="activatePanel('timeline')" :to="{ name: 'settings'}"><i class="icon-cog nav-icon" :title="$t('nav.preferences')"></i></router-link>
          <a href="#" v-if="currentUser" @click.prevent="logout"><i class="icon-logout nav-icon" :title="$t('login.logout')"></i></a>
        </div>
      </div>
    </nav>



    <div v-if="" class="container" id="content">
      <side-drawer :activatePanel="activatePanel" :closed="!showMobileSidebar"></side-drawer>
      <!--
        <button @click="activatePanel(mobileViews.postStatus)">post status</button>
        <button @click="activatePanel(mobileViews.notifications)">notifs</button>
        <button @click="activatePanel(mobileViews.timeline)">timeline</button>
      -->
      <div class="sidebar-flexer">
        <div class="sidebar-bounds">
          <div class="sidebar-scroller">
            <div class="sidebar">
              <user-panel :activatePanel="activatePanel" :class="mobileShowOnlyIn(mobileViews.postStatus)"></user-panel>
              <nav-panel :activatePanel="activatePanel" class="mobile-hidden"></nav-panel>
              <instance-specific-panel v-if="showInstanceSpecificPanel" class="mobile-hidden"></instance-specific-panel>
              <features-panel v-if="!currentUser"></features-panel>
              <who-to-follow-panel v-if="currentUser && suggestionsEnabled"></who-to-follow-panel>
              <notifications :activatePanel="activatePanel" v-if="currentUser" :class="mobileShowOnlyIn(mobileViews.notifications)"></notifications>
            </div>
          </div>
        </div>
      </div>
      <div class="main" :class="{ 'mobile-hidden': mobileActivePanel != 'timeline' }">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <chat-panel v-if="currentUser && chat" class="floating-chat mobile-hidden"></chat-panel>
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
