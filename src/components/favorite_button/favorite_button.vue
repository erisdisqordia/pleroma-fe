<template>
  <div>
    <i :class='classes' class='favorite-button fa' @click.prevent='favorite()'/>
    <span v-if='status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style lang='scss'>
  .favorite-button {
      cursor: pointer;
      animation-duration: 0.6s;
      &:hover {
        color: orange;
      }
  }
  .icon-star {
      color: orange;
  }

</style>
