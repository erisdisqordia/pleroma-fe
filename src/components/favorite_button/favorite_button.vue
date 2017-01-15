<template>
  <div>
    <i :class='classes' class='favorite-button fa' v-on:click.prevent='favorite()'></i>
    <span v-if='status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style lang='scss'>
  .favorite-button {
      cursor: pointer;
      &:hover {
        color: orange;
      }
  }
  .icon-star {
      color: orange;
  }
</style>
