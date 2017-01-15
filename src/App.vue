<template>
  <div id="app" v-bind:style="style" class="base02-background">
    <nav class='container base01-background base04'>
      <div class='item'>
        <a route-to='friends-timeline' href="#">Pleroma FE</a>
      </div>
    </nav>
    <div class="container" id="content">
      <div class="sidebar">
        <user-panel></user-panel>
        <nav-panel></nav-panel>
        <notifications v-if="currentUser"></notifications>
      </div>
      <div class="main">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
