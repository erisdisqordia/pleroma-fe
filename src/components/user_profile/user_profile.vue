<template>
  <div class="user-profile panel panel-default base00-background">
    <user-card-content :user="user"></user-card-content>
  </div>
</template>

<script src="./user_profile.js"></script>

<style lang="scss">
 .user-profile {
   flex: 2;
   flex-basis: 500px;
 }

 .user-info {
     .following-info {
         display: flex;

         div {
             flex: 1;
         }
         margin-top: 1em;
         margin-bottom: -1.2em;
     }
     .muteinfo{
     	margin: 0.5em 0;
     }
     .user-screen-name {
     	margin-top: 0.4em;
     }
 }
</style>
