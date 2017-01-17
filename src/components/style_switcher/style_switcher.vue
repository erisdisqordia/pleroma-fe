<template>
  <select v-model="selected" class="style-switcher">
    <option v-for="style in availableStyles" >{{style}}</option>
  </select>
</template>

<script src="./style_switcher.js"></script>

<style lang="scss">
 .style-switcher {
   margin-right: 1em;
 }
</style>
