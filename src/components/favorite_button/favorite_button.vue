<template>
  <div>
    <i :class='classes' class='favorite-button fa' v-on:click.prevent='favorite()'></i>
    <span v-if='status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style>
 .favorite-button {
     cursor: pointer
 }
</style>
