<template>
  <div v-if="loggedIn">
    <i :class='classes' class='favorite-button fav-active base09' @click.prevent='favorite()'/>
    <span v-if='status.fave_num > 0'>{{status.fave_num}}</span>
  </div>
  <div v-else>
    <i :class='classes' class='favorite-button base09'/>
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
      }
  }
  .favorite-button.icon-star {
      color: orange;
  }

</style>
