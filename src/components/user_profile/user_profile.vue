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
     .user-interactions {
         display: flex;
         flex-flow: row wrap;
         justify-content: center;

         div {
             flex: 1;
         }
         margin-top: 0.5em;
         margin-bottom: -1.2em;

         .following {
             font-size: 14px;
             flex: 0 0 100%;
             margin-bottom: 0.5em;
         }

         .mute {
             max-width: 200px;
         }

         .follow {
             max-width: 200px;
         }

         button {
             width: 80%;
             height: 100%;
             border: 1px solid;
         }
     }
     .user-screen-name {
     	margin-top: 0.4em;
     }
 }
</style>
