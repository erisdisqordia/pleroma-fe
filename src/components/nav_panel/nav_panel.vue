<template>
  <div class="nav-panel">
    <div class="panel panel-default">
      <ul>
        <li v-if='loggedIn'>
          <router-link to='/main/friends'>
            Timeline
          </router-link>
        </li>
        <li>
          <router-link to='/main/public'>
            Public Timeline
          </router-link>
        </li>
        <li>
          <router-link to='/main/all'>
            The Whole Known Network
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./nav_panel.js" ></script>

<style lang="scss">

 .nav-panel ul {
     list-style: none;
     margin: 0;
     padding: 0;
 }

 .nav-panel li {
     border-bottom: 1px solid silver;
     padding: 0.5em;
     padding-left: 1em;
 }

 .nav-panel li:last-child {
     border: none;
 }

 .nav-panel a {
     display: block;
     width: 100%;

     &.router-link-active {
         font-weight: bold
     }
 }

</style>
