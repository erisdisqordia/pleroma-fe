<template>
  <a href="#" v-if="hidden"><i class="icon-user-plus user-finder-icon" @click.prevent="toggleHidden"/></a>
  <span v-else>
    <input class="user-finder-input base03-border" @keyup.enter="findUser(username)" v-model="username" placeholder="Find user" id="user-finder-input" type="text"/>
    <i class="icon-cancel user-finder-icon" @click="toggleHidden"/>
  </span>
</template>

<script src="./user_finder.js"></script>

<style lang="scss">
 .user-finder-icon {
   margin-right: 0.25em;
 }

 .user-finder-input {
   border-width: 1px;
   border-style: solid;
   border-color: inherit;
   border-radius: 5px;
   padding: 0.1em 0.2em 0.2em 0.2em;
 }
</style>
