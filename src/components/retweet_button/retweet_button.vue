<template>
  <div>
    <i :class='classes' class='icon-retweet fa' v-on:click.prevent='retweet()'></i>
    <span v-if='status.repeat_num > 0'>{{status.repeat_num}}</span>
  </div>
</template>

<script src="./retweet_button.js" ></script>

<style>
 .icon-retweet {
     cursor: pointer
 }
 .retweeted {
     cursor: auto;
     color: green;
 }
</style>
