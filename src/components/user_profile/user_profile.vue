<template>
  <div class="user-profile panel panel-default">
    <user-card-content :user="user"></user-card-content>
  </div>
</template>

<script src="./user_profile.js"></script>

<style>
 .user-profile {
   flex: 2;
   flex-basis: 500px;
 }
</style>
