<template>
  <div id="app" v-bind:style="style" class="base02-background">
    <nav class='container base01-background base04' @click="scrollToTop()">
      <div class='inner-nav' :style="logoStyle">
        <div class='item'>
          <router-link :to="{ name: 'root'}">{{sitename}}</router-link>
        </div>
        <div class='item right'>
          <user-finder class="nav-icon"></user-finder>
          <router-link :to="{ name: 'settings'}"><i class="icon-cog nav-icon"></i></router-link>
          <a href="#" v-if="currentUser" @click.prevent="logout"><i class="icon-logout nav-icon" title="Logout" ></i></a>
        </div>
      </div>
    </nav>
    <div class="container" id="content">
      <div class="panel-switcher">
        <button @click="activatePanel('sidebar')" class="base01-background base04">Sidebar</button>
        <button @click="activatePanel('timeline')" class="base01-background base04">Timeline</button>
      </div>
      <div class="sidebar-flexer" :class="{ 'mobile-hidden': mobileActivePanel != 'sidebar'}">
        <div class="sidebar" :class="{ 'mobile-hidden': mobileActivePanel != 'sidebar' }">
          <div class="sidebar-container">
            <user-panel></user-panel>
            <nav-panel></nav-panel>
            <notifications v-if="currentUser"></notifications>
          </div>
        </div>
      </div>
      <div class="main" :class="{ 'mobile-hidden': mobileActivePanel != 'timeline' }">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
