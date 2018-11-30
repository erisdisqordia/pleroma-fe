<template>
  <div class="user-search panel panel-default">
    <div class="panel-heading">
      {{$t('nav.user_search')}}
    </div>
    <div class="panel-body">
      <user-card v-for="user in users" :key="user.id" :user="user" :showFollows="true"></user-card>
    </div>
  </div>
</template>

<script src="./user_search.js"></script>
