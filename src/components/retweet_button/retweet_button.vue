<template>
  <div v-if="loggedIn">
    <i :class='classes' class='icon-retweet rt-active' v-on:click.prevent='retweet()'></i>
    <span v-if='status.repeat_num > 0'>{{status.repeat_num}}</span>
  </div>
  <div v-else>
    <i :class='classes' class='icon-retweet'></i>
    <span v-if='status.repeat_num > 0'>{{status.repeat_num}}</span>
  </div>
</template>

<script src="./retweet_button.js" ></script>

<style lang='scss'>
  @import '../../_variables.scss';
  .rt-active {
     cursor: pointer;
     animation-duration: 0.6s;
     &:hover {
      color: $green_;
      color: var(--cGreen);
     }
  }
  .icon-retweet.retweeted {
     color: $green_;
     color: var(--cGreen);
  }
</style>
