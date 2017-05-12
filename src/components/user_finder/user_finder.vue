<template>
  <div class="user-finder-panel panel panel-default base00-background">
    <input @keyup.enter="findUser(username)" v-model="username" placeholder="Find user" id="user-finder-input" type="text" />
  </div>
</template>

<script src="./user_finder.js"></script>

<style lang="scss">
 .user-finder-panel {
   padding: 10px;
 }
</style>
