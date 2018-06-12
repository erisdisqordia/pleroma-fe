<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('nav.friend_requests')}}
    </div>
    <div class="panel-body">
      <user-card v-for="request in requests" :key="request.id" :user="request" :showFollows="false" :showApproval="true"></user-card>
    </div>
  </div>
</template>

<script src="./follow_requests.js"></script>
