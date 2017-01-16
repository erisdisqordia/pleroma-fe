<template>
  <select v-model="selected">
    <option v-for="style in availableStyles" >{{style}}</option>
  </select>
</template>

<script src="./style_switcher.js"></script>
