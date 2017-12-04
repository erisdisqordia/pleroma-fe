<template>
  <div class="nav-panel">
    <div class="panel panel-default base01-background">
      <ul class="base03-border">
        <li v-if='currentUser'>
          <router-link class="base00-background" to='/main/friends'>
            {{ $t("nav.timeline") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link class="base00-background" to='/chat'>
            {{ $t("nav.chat") }}
          </router-link>
        </li>
        <li v-if='currentUser'>
          <router-link class="base00-background" :to="{ name: 'mentions', params: { username: currentUser.screen_name } }">
            {{ $t("nav.mentions") }}
          </router-link>
        </li>
        <li>
          <router-link class="base00-background" to='/main/public'>
            {{ $t("nav.public_tl") }}
          </router-link>
        </li>
        <li>
          <router-link class="base00-background" to='/main/all'>
            {{ $t("nav.twkn") }}
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
     border-bottom: 1px solid;
     border-color: inherit;
     padding: 0;
     &:first-child a {
       border-top-right-radius: 10px;
       border-top-left-radius: 10px;
     }
     &:last-child a {
       border-bottom-right-radius: 10px;
       border-bottom-left-radius: 10px;
     }
 }

 .nav-panel li:last-child {
     border: none;
 }

 .nav-panel a {
     display: block;
     padding: 0.8em 0.85em;
     &:hover {
       background-color: transparent;
     }
     &.router-link-active {
       font-weight: bolder;
       background-color: transparent;
       &:hover {
         text-decoration: underline;
       }
     }
 }

</style>
