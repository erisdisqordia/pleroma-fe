<template>
  <div id="app" v-bind:style="style">
    <nav class='container'>
      <div class='item'>
        <a route-to='friends-timeline' href="#">Pleroma FE</a>
      </div>
    </nav>
    <div class="container" id="content">
      <sidebar>
        <user-panel></user-panel>
        <nav-panel></nav-panel>
      </sidebar>
      <router-view></router-view>
    </div>
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
