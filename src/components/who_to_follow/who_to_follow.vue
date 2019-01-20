<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      {{$t('who_to_follow.who_to_follow')}}
    </div>
    <div class="panel-body">
      <user-card v-for="user in users" :key="user.id" :user="user" :showFollows="true"></user-card>
    </div>
  </div>
</template>

<script src="./who_to_follow.js"></script>

<style lang="scss">
</style>
