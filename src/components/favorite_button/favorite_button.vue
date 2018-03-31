<template>
  <div v-if="loggedIn">
    <i :class='classes' class='favorite-button fav-active' @click.prevent='favorite()'/>
    <span v-if='status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
  <div v-else>
    <i :class='classes' class='favorite-button'/>
    <span v-if='status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
</template>

<script src="./favorite_button.js" ></script>

<style lang='scss'>
  .fav-active {
      cursor: pointer;
      animation-duration: 0.6s;
      &:hover {
        color: orange;
        color: var(--cOrange);
      }
  }
  .favorite-button.icon-star {
      color: orange;
      color: var(--cOrange);
  }

</style>
