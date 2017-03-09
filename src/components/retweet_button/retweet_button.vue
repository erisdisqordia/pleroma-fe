<template>
  <div>
    <i :class='classes' class='icon-retweet fa' v-on:click.prevent='retweet()'></i>
    <span v-if='status.repeat_num > 0'>{{status.repeat_num}}</span>
  </div>
</template>

<script src="./retweet_button.js" ></script>

<style lang='scss'>
  @import '../../_variables.scss';
  .icon-retweet {
     cursor: pointer;
     animation-duration: 0.6s;
     &:hover {
      color: $green;
     }
  }
  .retweeted {
     color: $green;
  }
</style>
