<template>
  <div id="app" v-bind:style="style" class="base02-background">
    <nav class='container base01-background base04'>
      <div class='inner-nav' :style="logoStyle">
        <div class='item'>
          <router-link :to="{ name: 'root'}">{{sitename}}</router-link>
        </div>
        <div class='item right'>
          <router-link :to="{ name: 'settings'}"><i class="icon-cog"></i></router-link>
        </div>
      </div>
    </nav>
    <div class="container" id="content">
      <div class="panel-switcher">
        <button @click="activatePanel('sidebar')">Sidebar</button>
        <button @click="activatePanel('timeline')">Timeline</button>
      </div>
      <div class="sidebar" :class="{ 'mobile-hidden': mobileActivePanel != 'sidebar' }">
        <user-panel></user-panel>
        <nav-panel></nav-panel>
        <notifications v-if="currentUser"></notifications>
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
