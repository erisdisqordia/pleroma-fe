<template>
  <div id="app" v-bind:style="style">
    <nav class='container' @click="scrollToTop()" id="nav">
      <div class='logo' :style='logoBgStyle'>
        <div class='mask' :style='logoMaskStyle'></div>
        <img :src='logo' :style='logoStyle'>
      </div>
      <div class='inner-nav'>
        <div class='item'>
          <router-link :to="{ name: 'root'}">{{sitename}}</router-link>
        </div>
        <div class='item right'>
          <user-finder class="nav-icon"></user-finder>
          <router-link :to="{ name: 'settings'}"><i class="icon-cog nav-icon"></i></router-link>
          <a href="#" v-if="currentUser" @click.prevent="logout"><i class="icon-logout nav-icon" :title="$t('login.logout')"></i></a>
        </div>
      </div>
    </nav>
    <div class="container" id="content">
      <div class="panel-switcher">
        <button @click="activatePanel('sidebar')">Sidebar</button>
        <button @click="activatePanel('timeline')">Timeline</button>
      </div>
      <div class="sidebar-flexer" :class="{ 'mobile-hidden': mobileActivePanel != 'sidebar'}">
        <div class="sidebar-bounds">
          <div class="sidebar-scroller">
            <div class="sidebar">
              <user-panel></user-panel>
              <nav-panel></nav-panel>
              <instance-specific-panel v-if="showInstanceSpecificPanel"></instance-specific-panel>
              <who-to-follow-panel v-if="currentUser && suggestionsEnabled"></who-to-follow-panel>
              <notifications v-if="currentUser"></notifications>
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
